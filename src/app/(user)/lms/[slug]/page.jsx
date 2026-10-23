"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CldImage, CldVideoPlayer } from "next-cloudinary";
import { Play, Clock, Award, FileText, Check, Loader2 } from "lucide-react";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState(null); // first free lesson preview

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/lms/courses/slug/${slug}`); // slug API
        const data = await res.json();
        setCourse(data.course);
        // first free lesson ka publicId preview ke liye
        const free = data.course?.lessons?.find((l) => l.isFree);
        if (free?.publicId) setPreviewId(free.publicId);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    if (slug) fetchCourse();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!course) return <div className="p-6">Course not found</div>;

  const totalDuration = course.lessons?.length + " lessons"; // agar duration field calc karna hai to reduce karo

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
      <div className="flex-1 p-4 md:p-6">
        <div className="bg-white border border-black rounded-2xl p-5 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Course Details</h1>
            <p className="text-sm text-gray-500">Home / LMS / {course.title}</p>
          </div>
          <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-black rounded-[20px] overflow-hidden">
              <div className="relative">
                {previewId ? (
                  <CldVideoPlayer
                    width={1280}
                    height={720}
                    src={previewId}
                    colors={{ accent: "#C9A24C" }}
                  />
                ) : course.thumbnailPublicId ? (
                  <CldImage
                    src={course.thumbnailPublicId}
                    width={800}
                    height={450}
                    crop="fill"
                    alt={course.title}
                    className="w-full h-[320px] object-cover"
                  />
                ) : (
                  <img
                    src={course.thumbnail}
                    className="w-full h-[320px] object-cover"
                    alt={course.title}
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-3 py-1 bg-[#EEF2FF] border border-black rounded-full">
                    {course.rankRequired}
                  </span>
                  <span className="text-xs px-3 py-1 bg-[#FDE9B3] border border-black rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.totalLessons} Lessons
                  </span>
                  <span className="text-xs px-3 py-1 bg-[#ECFDF5] border border-black rounded-full">
                    {course.bundleRequired > 0
                      ? `WX$ ${course.bundleRequired}`
                      : "Free Access"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-black">
                  {course.title}
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  {course.description}
                </p>
              </div>
            </div>

            <div className="bg-white border border-black rounded-[20px] p-6">
              <h3 className="font-bold text-[16px] mb-4">
                Course Content • {course.lessons.length} lessons
              </h3>
              <div className="space-y-2">
                {course.lessons.map((l, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 border border-zinc-200 rounded-xl hover:border-black transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F3F4F6] border border-black text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{l.title}</p>
                        <p className="text-xs text-gray-500">
                          {l.duration} {l.isFree && "• Preview"}
                        </p>
                      </div>
                    </div>
                    {l.isFree ? (
                      <span className="text-xs text-[#23408F] font-bold">
                        Free
                      </span>
                    ) : (
                      <span className="text-xs">🔒</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-black rounded-[20px] p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-1">Enroll in this course</h3>
              <p className="text-xs text-gray-500 mb-4">
                Lifetime access + Certificate
              </p>
              <div className="bg-[#F9FAFB] border border-black rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Lessons</span>
                  <span className="font-bold">{course.totalLessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rank Required</span>
                  <span className="font-bold bg-[#FDE9B3] px-2 py-0.5 rounded-full text-xs">
                    {course.rankRequired}
                  </span>
                </div>
              </div>
              <Link
                href={`/lms/learn/${course.slug}`}
                className="block w-full bg-[#C9A24C] text-center text-black font-bold py-3 rounded-xl hover:bg-[#b8923e] transition"
              >
                Enroll Now - Continue
              </Link>
              <p className="text-[11px] text-center text-gray-500 mt-3">
                You have access via {course.rankRequired} rank
              </p>
              <div className="mt-6 pt-6 border-t border-dashed border-black flex gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" /> Certificate
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" /> Resources
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Lifetime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
