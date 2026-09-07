import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { RUBRIC } from "@/lib/rubric";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { toast } from "sonner";

function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="p-0.5 focus:outline-hidden"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              s <= value
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 hover:text-amber-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function RatingPage() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [showPolicy, setShowPolicy] = useState(true);
  const [agreed, setAgreed] = useState(false);

  // Fetch school details from Supabase
  const { data: school, isLoading: schoolLoading } = useQuery({
    queryKey: ["school", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!schoolId,
  });

  // Check verification status for the current user
  const { data: verifications = [], isLoading: verLoading } = useQuery({
    queryKey: ["myVerification", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("user_id", user?.id)
        .eq("status", "approved")
        .eq("type", "identity");

      if (error) return [];
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch all approved verifications to calculate anonymous reviewer number sequence
  const { data: allVerifications = [] } = useQuery({
    queryKey: ["allApprovedVerifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("id")
        .eq("status", "approved")
        .eq("type", "identity")
        .order("created_at", { ascending: true });

      if (error) return [];
      return data || [];
    },
    enabled: !!user,
  });

  const isVerified = verifications.length > 0;
  const verInfo = verifications[0];
  const canComment = verInfo?.employee_status !== "resigned_over_year";

  // Create review mutation in Supabase
  const submitReview = useMutation({
    mutationFn: async (reviewData) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schoolReviews", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school", schoolId] });
      toast.success("Review submitted successfully!");
      navigate(`/school/${schoolId}`);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit review.");
    },
  });

  const handleSubmit = () => {
    if (Object.keys(ratings).length === 0) {
      toast.error("Please provide ratings before submitting.");
      return;
    }

    const myVerifId = verifications[0]?.id;
    const myPosition = allVerifications.findIndex((v) => v.id === myVerifId);
    const reviewerNum = myPosition >= 0 ? myPosition + 1 : allVerifications.length + 1;

    submitReview.mutate({
      school_id: schoolId,
      ratings: ratings,
      comment: canComment ? comment : "",
      reviewer_type: verInfo?.employee_status || "current",
      is_verified: true,
      reviewer_label: `Verified Teacher #${reviewerNum}`,
      teacher_id: user?.id,
    });
  };

  if (schoolLoading || verLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h2 className="font-display text-xl font-bold mb-2 text-slate-900">Sign In Required</h2>
        <p className="text-sm text-slate-500 mb-4">You must be signed in and verified to rate a school.</p>
        <Button onClick={() => navigate("/login")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Log In
        </Button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h2 className="font-display text-xl font-bold mb-2 text-slate-900">Verification Required</h2>
        <p className="text-sm text-slate-500 mb-4">You need to verify your teacher identity before rating.</p>
        <Button onClick={() => navigate("/verify?type=identity")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Verify Now
        </Button>
      </div>
    );
  }

  if (!agreed) {
    return (
      <PrivacyPolicyModal
        isOpen={showPolicy}
        onClose={() => navigate(-1)}
        onAgree={() => {
          setShowPolicy(false);
          setAgreed(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-1 text-slate-900">
          Rate {school?.name || "School"}
        </h1>
        <p className="text-sm text-slate-500 mb-8">Rate each aspect on a scale of 1-5 stars</p>

        <div className="space-y-6">
          {RUBRIC.map((cat, idx) => (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h3 className="font-semibold text-sm mb-4 text-slate-900">
                <span className="text-slate-400 mr-2">{idx + 1}.</span>
                {cat.title}
              </h3>
              <div className="space-y-3">
                {cat.subs.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-600 flex-1">{sub.label}</span>
                    <StarInput
                      value={ratings[sub.id] || 0}
                      onChange={(v) => setRatings((r) => ({ ...r, [sub.id]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Comment section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-semibold text-sm mb-2 text-slate-900">8. Add your comments</h3>
            {canComment ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience anonymously..."
                rows={4}
                className="mt-2"
              />
            ) : (
              <p className="text-xs text-slate-500 italic">
                As a past employee (resigned over 1 year), you can rate but not comment.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="border-slate-200">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitReview.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {submitReview.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}
