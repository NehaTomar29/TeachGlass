import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import SearchBar from "../components/SearchBar";
import SchoolCard from "../components/SchoolCard";
import StatsBar from "../components/StatsBar";
import FloatingReviews from "../components/FloatingReviews";
import { Loader2 } from "lucide-react";

export default function SchoolDirectory() {
  const [search, setSearch] = useState("");

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const filtered =
    search.length > 1
      ? schools.filter((s) =>
          s.name?.toLowerCase().includes(search.toLowerCase())
        )
      : schools;

  return (
    <div className="min-h-screen px-6 py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2 text-slate-900">
          School Directory
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Find and review private schools across Delhi NCR
        </p>

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="mt-10">
          <StatsBar />
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-12 text-sm">
              No schools found. Add your school to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Recent School Reviews
          </h2>
          <FloatingReviews type="schools" />
        </div>
      </div>
    </div>
  );
}
