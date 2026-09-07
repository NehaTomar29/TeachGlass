import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Star, MapPin, Pencil, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import RubricBreakdown from "../components/RubricBreakdown";
import { calculateOverallRating } from "@/lib/rubric";

export default function SchoolProfile() {
  const { schoolId } = useParams();

  const { data: school, isLoading: isLoadingSchool } = useQuery({
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

  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery({
    queryKey: ["schoolReviews", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("school_id", schoolId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });

  const isLoading = isLoadingSchool || isLoadingReviews;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="flex justify-center items-center min-h-screen text-slate-500">
        School not found
      </div>
    );
  }

  // Aggregate ratings
  const aggregated = {};
  if (reviews.length > 0) {
    reviews.forEach((r) => {
      const parsed =
        typeof r.ratings === "string" ? JSON.parse(r.ratings) : r.ratings;
      Object.entries(parsed || {}).forEach(([key, val]) => {
        if (!aggregated[key]) aggregated[key] = [];
        aggregated[key].push(Number(val));
      });
    });
    Object.keys(aggregated).forEach((key) => {
      const vals = aggregated[key];
      aggregated[key] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });
  }

  const overallRating = calculateOverallRating(aggregated);
  const comments = reviews.filter((r) => r.comment);

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
            {school.photo_url ? (
              <img
                src={school.photo_url}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                <span className="text-5xl font-display font-bold text-indigo-200">
                  {school.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-slate-900">
              {school.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0" />
              {school.address}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${
                      s <= Math.round(overallRating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-lg text-slate-900">
                {overallRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500">
                ({reviews.length} reviews)
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                asChild
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Link to={`/rate/${school.id}`}>
                  <Pencil className="h-4 w-4 mr-1.5" /> Rate this School
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Rubric Breakdown */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold mb-4 text-slate-900">
            Rating Breakdown
          </h2>
          {reviews.length > 0 ? (
            <RubricBreakdown aggregatedRatings={aggregated} />
          ) : (
            <p className="text-sm text-slate-500">
              No ratings yet. Be the first to rate!
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="mt-10">
          <h2 className="font-display text-lg font-semibold mb-4 text-slate-900">
            Anonymous Comments
          </h2>
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-medium text-slate-500">
                      {r.reviewer_label || "Verified Teacher"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
