import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import SearchBar from "@/components/SearchBar";
import FloatingReviews from "@/components/FloatingReviews";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { GraduationCap, Shield, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch recent anonymous reviews for the floating ticker
  const { data: reviews = [] } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, comment, school_name, teacher_id")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) return [];
      return data || [];
    },
  });

  const handleAddSchoolAgree = () => {
    navigate("/verify?type=school");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-tight text-indigo-900">
            TeachGlass
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
            Bringing transparency to private education — one honest review at a time.
          </p>
          <div className="mt-8">
            <SearchBar onAddSchoolClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      </section>

      {/* Floating Reviews Ticker */}
      <section className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 text-center text-indigo-900">
            WHAT TEACHERS ARE SAYING
          </h2>
          <FloatingReviews reviews={reviews} />
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-6 py-16 bg-slate-100/70 rounded-2xl my-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-indigo-900">
            Our Mission
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            TeachGlass exists to empower private sector teachers across Delhi NCR[cite: 1]. We believe every educator deserves a transparent workplace[cite: 1]. Through anonymous, verified reviews and a structured rating rubric, we help teachers make informed career decisions and encourage schools to build better environments[cite: 1].
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: Shield,
                title: "Anonymous & Safe",
                desc: "Your identity is always protected. Rate and review without fear.",
              },
              {
                icon: Eye,
                title: "Transparent Ratings",
                desc: "Our detailed rubric covers everything from salary to work-life balance.",
              },
              {
                icon: GraduationCap,
                title: "Teacher First",
                desc: "Built by educators who understand the challenges of private schooling.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center"
              >
                <item.icon className="h-6 w-6 mb-3 text-indigo-600" />
                <h3 className="font-semibold text-sm mb-1 text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Terms Consent Modal for Adding School */}
      <PrivacyPolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAgree={handleAddSchoolAgree}
      />
    </div>
  );
}
