import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, Upload } from "lucide-react";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import { toast } from "sonner";

export default function Verification() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") || "identity";
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPolicy, setShowPolicy] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    school_name: "",
    school_address: "",
    employee_status: "",
    school_id_photo: "",
    resignation_letter_url: "",
  });
  const [uploading, setUploading] = useState(false);

  const submit = useMutation({
    mutationFn: async (data) => {
      const { data: result, error } = await supabase
        .from("verification_requests")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Verification request submitted!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit verification request");
    },
  });

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id || "anonymous"}/${Date.now()}_${field}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("verifications")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("verifications")
        .getPublicUrl(filePath);

      setForm((f) => ({ ...f, [field]: publicUrlData.publicUrl }));
      toast.success("File uploaded successfully");
    } catch (err) {
      toast.error(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit.mutate({
      type,
      name: form.name,
      school_name: form.school_name,
      school_address: type === "school" ? form.school_address : "",
      employee_status: form.employee_status,
      school_id_photo: form.school_id_photo,
      resignation_letter_url: form.resignation_letter_url,
      status: "pending",
      user_email: user?.email || "",
      user_id: user?.id,
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-slate-50/50">
        <h2 className="font-display text-xl font-bold mb-2 text-slate-900">
          Sign In Required
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Please sign in to proceed with verification.
        </p>
        <Button
          onClick={() => navigate("/register")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  }

  if (!agreed) {
    return (
      <PrivacyPolicyModal
        open={showPolicy}
        onClose={() => navigate(-1)}
        onAgree={() => {
          setShowPolicy(false);
          setAgreed(true);
        }}
      />
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-slate-50/50">
        <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2 text-slate-900">
          Request Submitted!
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Your verification will be reviewed within 1-2 days. We'll notify you
          once approved.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="font-display text-2xl font-bold mb-1 text-slate-900">
          {type === "identity" ? "Identity Verification" : "School Verification"}
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          {type === "identity"
            ? "Verify your identity as a teacher to start rating and commenting."
            : "Add a school to our directory by submitting verification details."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="school_name">School Name</Label>
            <Input
              id="school_name"
              value={form.school_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, school_name: e.target.value }))
              }
              required
            />
          </div>

          {type === "school" && (
            <div>
              <Label htmlFor="school_address">School Address</Label>
              <Input
                id="school_address"
                value={form.school_address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, school_address: e.target.value }))
                }
                required
              />
            </div>
          )}

          <div>
            <Label>Employee Status</Label>
            <Select
              value={form.employee_status}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, employee_status: v }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="currently_working">
                  Currently Working
                </SelectItem>
                <SelectItem value="resigned_within_year">
                  Resigned Within 1 Year
                </SelectItem>
                <SelectItem value="resigned_over_year">
                  Resigned Over 1 Year Ago
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "identity" && (
            <div>
              <Label>School ID Card (Photo)</Label>
              <div className="mt-1">
                <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {form.school_id_photo
                      ? "File uploaded ✓"
                      : "Upload school ID"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "school_id_photo")}
                  />
                </label>
              </div>
            </div>
          )}

          {form.employee_status &&
            form.employee_status !== "currently_working" &&
            type === "identity" && (
              <div>
                <Label>Resignation Letter</Label>
                <div className="mt-1">
                  <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {form.resignation_letter_url
                        ? "File uploaded ✓"
                        : "Upload resignation letter"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "resignation_letter_url")
                      }
                    />
                  </label>
                </div>
              </div>
            )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={submit.isPending || uploading}
          >
            {(submit.isPending || uploading) && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Submit for Verification
          </Button>
        </form>
      </div>
    </div>
  );
}
