import React from 'react';
import { RUBRIC_CATEGORIES, RED_FLAGS } from "@/lib/rubric";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutUs() {
  return (
    <div className="min-h-screen px-6 py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2 text-indigo-900">About Us</h1>
        <p className="text-slate-600 text-sm mb-8">
          Learn about our rating rubric and privacy policy
        </p>

        <Tabs defaultValue="rubric">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rubric">Rating Rubric</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>

          <TabsContent value="rubric" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h2 className="font-display text-lg font-semibold mb-2 text-indigo-900">Our Rating Rubric</h2>
              <p className="text-sm text-slate-600 mb-6">
                Every school is rated on the following categories. Each sub-category is rated out of 5 stars[cite: 1].
                The category average determines the overall rating[cite: 1].
              </p>
              <div className="space-y-6">
                {RUBRIC_CATEGORIES.map((cat, idx) => (
                  <div key={cat.id}>
                    <h3 className="font-semibold text-sm mb-2 text-slate-800">
                      {cat.title}
                    </h3>
                    <ul className="space-y-1 pl-6">
                      {cat.items.map((item) => (
                        <li key={item.id} className="text-xs text-slate-600 list-disc">
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <h3 className="font-semibold text-sm mb-2 text-slate-800">7. Other Red Flags</h3>
                  <ul className="space-y-1 pl-6">
                    {RED_FLAGS.map((flag) => (
                      <li key={flag.id} className="text-xs text-slate-600 list-disc">
                        {flag.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-slate-800">
                    <span className="text-indigo-600 mr-2">8.</span>
                    Add your comments
                  </h3>
                  <p className="text-xs text-slate-600 pl-6 mt-1">Share your anonymous experience[cite: 1]</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="font-display text-lg font-semibold text-indigo-900">{PRIVACY_POLICY.title}</h2>
              {Array.isArray(PRIVACY_POLICY.sections) ? (
                PRIVACY_POLICY.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="font-semibold text-sm text-slate-800">{sec.heading}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {PRIVACY_POLICY}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}