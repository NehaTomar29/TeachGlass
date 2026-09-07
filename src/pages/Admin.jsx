{ useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { ShieldAlert, Loader2, UserCheck, School } from "lucide-react";
import VerificationCard from "@/components/admin/VerificationCard";
import { cn } from "@/lib/utils";

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState("identity");
  const [statusFilter, setStatusFilter] = useState("pending");
  const queryClient = useQueryClient();

  // Determine user role from Supabase user_metadata or app_metadata
  const userRole = user?.user_metadata?.role || user?.app_metadata?.role;

  // Fetch verification or school requests from Supabase
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["verifications", tab, statusFilter],
    queryFn: async () => {
      const table = tab === "identity" ? "verification_requests" : "school_requests";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("status", statusFilter)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Mutation to approve or reject a request
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      const table = tab === "identity" ? "verification_requests" : "school_requests";
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
    },
  });

  const handleApprove = (id) => updateStatusMutation.mutate({ id, newStatus: "approved" });
  const handleReject = (id) => updateStatusMutation.mutate({ id, newStatus: "rejected" });

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-rose-500 mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Admin Access Required</h2>
        <p className="text-sm text-slate-500">You don't have permission to view this page.</p>
      </div>
    );
  }

  const tabs = [
    { id: "identity", label: "Identity", icon: UserCheck },
    { id: "school", label: "Schools", icon: School },
  ];

  const statusTabs = [
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-1 text-slate-900">Admin Panel</h1>
        <p className="text-sm text-slate-500 mb-8">Review and manage verification requests</p>

        <div className="flex gap-2 mb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {statusTabs.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                statusFilter === s.id
                  ? "bg-indigo-100 text-indigo-800"
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">No {statusFilter} requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <VerificationCard
                key={req.id}
                request={req}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
