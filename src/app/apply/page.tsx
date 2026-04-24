"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import SurveyStep from "@/components/SurveyStep";
import Logo from "@/components/Logo";
import { loadLead, updateLead, captureUTMsFromURL, type SurveyAnswers } from "@/lib/storage";
import { track } from "@/lib/tracking";

type QKey = keyof SurveyAnswers;

type Question = {
  key: QKey;
  title: string;
  subtext?: string;
  options: string[];
};

const questions: Question[] = [
  {
    key: "q1_industry",
    title: "What does your business do?",
    options: [
      "Lending / Finance",
      "B2B SaaS / Software",
      "Marketing / Creative Agency",
      "Consulting / Professional Services",
      "Other B2B Service",
    ],
  },
  {
    key: "q2_revenue",
    title: "What's your current monthly revenue?",
    options: ["Under $10K/mo", "$10K–$50K/mo", "$50K–$250K/mo", "$250K+/mo"],
  },
  {
    key: "q3_current_channel",
    title: "How are you currently getting sales calls booked?",
    options: [
      "Referrals / word of mouth",
      "Paid ads",
      "I do cold outreach myself",
      "I have someone else doing outreach",
      "I'm not getting calls booked consistently",
    ],
  },
  {
    key: "q4_timeline",
    title: "How soon are you looking to add more qualified calls to your calendar?",
    options: [
      "Immediately / this week",
      "Within the next 30 days",
      "1–3 months out",
      "Just exploring options",
    ],
  },
  {
    key: "q5_bottleneck",
    title: "What's your biggest bottleneck right now?",
    options: [
      "Not enough leads coming in",
      "Leads are low quality / don't convert",
      "I don't have time to do outreach",
      "I've tried cold email but it didn't work",
      "I'm starting from scratch",
    ],
  },
];

const ADVANCE_MS = 300;

export default function SurveyPage() {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage + capture UTMs in case user landed here directly.
  useEffect(() => {
    captureUTMsFromURL();
    const saved = loadLead();
    setAnswers({
      q1_industry: saved.q1_industry,
      q2_revenue: saved.q2_revenue,
      q3_current_channel: saved.q3_current_channel,
      q4_timeline: saved.q4_timeline,
      q5_bottleneck: saved.q5_bottleneck,
    });

    // Fire InitiateCheckout on first survey view.
    track.surveyStart();
    setHydrated(true);
  }, []);

  const current = questions[idx];

  const handleSelect = (value: string) => {
    const nextAnswers: SurveyAnswers = { ...answers, [current.key]: value };
    setAnswers(nextAnswers);
    updateLead({ [current.key]: value });

    window.setTimeout(() => {
      if (idx < questions.length - 1) {
        setIdx(idx + 1);
      } else {
        router.push("/apply/contact");
      }
    }, ADVANCE_MS);
  };

  const handleBack = () => {
    if (idx === 0) return;
    setIdx(idx - 1);
  };

  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-radial-violet opacity-60"
      />

      {/* Minimal top strip with just the logo to keep the survey focused */}
      <div className="mx-auto max-w-xl px-5 pt-8">
        <div className="flex justify-center">
          <Logo size="sm" href="/" />
        </div>
      </div>

      <div className="mx-auto max-w-xl px-5 pb-20 pt-10">
        <ProgressBar current={idx + 1} total={questions.length} />

        <div className="mt-10">
          {hydrated ? (
            <SurveyStep
              // Keying on idx forces remount + refocus per question.
              key={current.key}
              questionNumber={idx + 1}
              question={current.title}
              subtext={current.subtext}
              options={current.options}
              selected={answers[current.key]}
              onSelect={handleSelect}
              onBack={idx > 0 ? handleBack : undefined}
            />
          ) : (
            // Minimal skeleton so layout doesn't jump before hydration.
            <div className="h-[360px] animate-pulse rounded-xl border border-white/5 bg-white/[0.02]" />
          )}
        </div>
      </div>
    </main>
  );
}
