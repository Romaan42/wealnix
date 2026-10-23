"use client";
import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import {
  Plus,
  Trash2,
  Edit3,
  Play,
  Search,
  Loader2,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function AdminLMSList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lms/courses");
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/lms/courses/${id}`, { method: "DELETE" });
    fetchCourses();
  };

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-black rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">LMS Admin</h1>
            <p className="text-sm text-gray-500">
              {courses.length} Courses •{" "}
              {courses.reduce((a, c) => a + (c.totalLessons || 0), 0)} Lessons
            </p>
          </div>
          <Link
            href="/admin/lms/create"
            className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 w-fit"
          >
            <Plus className="w-4 h-4" /> Create Course
          </Link>
        </div>

        {/* Search + Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border border-black rounded-2xl p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="flex-1 text-sm outline-none"
            />
          </div>
          <div className="bg-[#C9A24C] border border-black rounded-2xl p-4 flex items-center gap-3">
            <BookOpen className="w-5 h-5" />
            <div>
              <p className="text-xs font-bold">Total Courses</p>
              <p className="text-xl font-black">{courses.length}</p>
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-black rounded-[20px] overflow-hidden group hover:shadow-[4px_4px_0px_0px_black] transition-all"
              >
                <div className="relative h-40 bg-gray-100">
                  {course.thumbnailPublicId ? (
                    <CldImage
                      src={course.thumbnailPublicId}
                      width={400}
                      height={225}
                      crop="fill"
                      gravity="auto"
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3 text-[10px] bg-black text-white px-2.5 py-1 rounded-full">
                    {course.rankRequired}
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] bg-white border border-black px-2.5 py-1 rounded-full flex gap-1 items-center">
                    <Play className="w-3 h-3" />
                    {course.totalLessons} Lessons
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1 h-8">
                    {course.description}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/admin/lms/edit/${course._id}`}
                      className="flex-1 border border-black rounded-full py-2 text-xs font-bold flex justify-center gap-1.5 hover:bg-gray-50"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="px-3 border border-black rounded-full bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="bg-white border border-black rounded-2xl p-10 text-center">
            <p className="text-sm">No courses found</p>
            <Link
              href="/admin/lms/create"
              className="text-xs mt-2 inline-block bg-black text-white px-4 py-2 rounded-full"
            >
              Create First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
