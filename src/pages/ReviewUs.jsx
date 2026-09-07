import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import FloatingReviews from "../components/FloatingReviews";
import { toast } from "sonner";

export default function ReviewUs() {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const submit = useMutation({
    mutationFn: async (data) => {
      const { data: newReview, error } = await supabase
        .from("platform_reviews")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return newReview;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platformReviews"] });
      setContent("");
      toast.success("Thank you for your review!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit review.");
    },
  });

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2 text-slate-900">
          Review Us
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Share your experience with TeachGlass anonymously
        </p>

        <div className="border border-slate-200 rounded-xl p-6 mb-10 bg-white shadow-xs">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us what you think about TeachGlass..."
            rows={4}
          />

          <Button
            onClick={() =>
              submit.mutate({
                content,
                author_label: "Anonymous Teacher",
              })
            }
            disabled={!content.trim() || submit.isPending}
            className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {submit.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Submit Review
          </Button>
        </div>

        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          What Others Say
        </h2>
        <FloatingReviews type="platform" />
      </div>
    </div>
  );
}
