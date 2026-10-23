"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CldVideoPlayer } from "next-cloudinary";
import { Check, Play, Clock, ArrowLeft, Loader2, BookOpen } from "lucide-react";

export default function LearnPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState([]);
  console.log(course);
  useEffect(() => {
    fetch(`/api/lms/courses/slug/${slug}`)
      .then((r) => r.json())
      .then((d) => setCourse(d.course))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  if (!course)
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6">Course not found</div>
    );

  const lesson = course.lessons[activeIdx];
  const progress = Math.round((completed.length / course.lessons.length) * 100);

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] font-sans">
      <div className="p-4 md:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* HEADER CARD - Same as Portal */}
        <div className="bg-white border border-black rounded-2xl p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link
              href={`/lms/${course.slug}`}
              className="w-10 h-10 border border-black rounded-full flex items-center justify-center bg-white hover:bg-black hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-[15px] font-bold text-[#111827] line-clamp-1">
                {course.title}
              </h1>
              <p className="text-xs text-gray-500">
                Lesson {activeIdx + 1} / {course.lessons.length} -{" "}
                {lesson.title}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-28 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A24C]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="bg-black text-white text-xs px-3 py-1.5 rounded-full font-bold">
              {progress}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* VIDEO PLAYER CARD */}
          <div className="space-y-6">
            <div className="bg-white border border-black rounded-[20px] overflow-hidden">
              <div className="bg-black aspect-video w-full">
                {lesson?.videoUrl ? (
                  <video
                    key={lesson.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    src={lesson.videoUrl}
                  />
                ) : lesson?.publicId ? (
                  <CldVideoPlayer
                    width={1280}
                    height={720}
                    src={lesson.publicId}
                    colors={{ accent: "#C9A24C" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/60">
                    No video
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#FDE9B3] border border-black text-[11px] px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.duration}
                  </span>
                  <span className="bg-white border border-black text-[11px] px-3 py-1 rounded-full font-semibold">
                    {course.rankRequired}
                  </span>
                </div>
                <h2 className="text-[18px] font-bold">{lesson.title}</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {lesson.content || course.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    disabled={activeIdx === 0}
                    onClick={() => setActiveIdx((v) => v - 1)}
                    className="border border-black rounded-xl py-3 text-sm font-bold disabled:opacity-30 bg-white"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (!completed.includes(activeIdx))
                        setCompleted([...completed, activeIdx]);
                      if (activeIdx < course.lessons.length - 1)
                        setActiveIdx((v) => v + 1);
                    }}
                    className="bg-[#C9A24C] border border-black rounded-xl py-3 text-sm font-bold"
                  >
                    Complete & Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CURRICULUM CARD - Same border style as your portal cards */}
          <div className="bg-white border border-black rounded-[20px] overflow-hidden h-fit lg:sticky lg:top-6">
            <div className="p-5 border-b border-black">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <h3 className="font-bold text-sm">Course Curriculum</h3>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold">
                    {completed.length}/{course.lessons.length}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 max-h-[65vh] overflow-y-auto">
              {course.lessons.map((l, i) => {
                const active = i === activeIdx;
                const done = completed.includes(i);
                return (
                  <div
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`p-4 flex gap-3 cursor-pointer transition ${active ? "bg-[#111827] text-white" : "bg-white hover:bg-[#F9FAFB] text-black"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-green-500 border-green-500 text-white" : active ? "bg-white border-white text-black" : "bg-white border-black"}`}
                    >
                      {done ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold line-clamp-2 leading-snug">
                        {l.title}
                      </p>
                      <p
                        className={`text-[11px] mt-1 ${active ? "text-zinc-400" : "text-gray-500"}`}
                      >
                        {l.duration} • {l.isFree ? "Free" : "Locked"}
                      </p>
                    </div>
                    {active && (
                      <Play className="w-4 h-4 shrink-0 mt-1 fill-white" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
