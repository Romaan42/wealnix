"use client";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Loader2 } from "lucide-react";

export default function LMSPortal() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  console.log(category);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/lms/courses");
        const data = await res.json();
        setCourses(data.courses || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
      <div className="flex-1 p-4 md:p-6">
        {/* TOP HEADER CARD */}
        <div className="bg-white border border-black rounded-2xl p-5 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#111827]">
              LMS Access Portal
            </h1>
            <p className="text-sm text-gray-500">
              {courses.length} enrolled courses • Keep learning
            </p>
          </div>
          <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>
        <div>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 w-full border border-gray-300 mb-10 bg-white rounded-2xl"
            name="category"
            id="category"
          >
            <option value="courses">Courses</option>
            <option value="Software and Tools">Software and Tools</option>
            <option value="Mobile Softwares">Mobile Softwares</option>
            <option value="themes">Mobile Softwares</option>
            <option value="reels">Reels</option>
          </select>
        </div>

        {/* COURSES GRID */}
        {courses.length === 0 ? (
          <div className="bg-white border border-black rounded-2xl p-10 text-center">
            <p className="text-sm font-medium">No courses yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Admin will add courses soon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((c) => {
              return (
                <a key={c._id} href={c.link} target="_blank" className="group">
                  <div className="bg-white border border-black rounded-[20px] p-4 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                    <div className="relative">
                      {/* REAL CldImage */}
                      {c.thumbnail ? (
                        <CldImage
                          src={c.thumbnail}
                          width={400}
                          height={225}
                          crop="fill"
                          gravity="auto"
                          alt={c.title}
                          className="w-full h-[170px] object-cover rounded-2xl"
                        />
                      ) : (
                        <img
                          src={c.thumbnail}
                          className="w-full h-[170px] object-cover rounded-2xl"
                          alt={c.title}
                        />
                      )}
                      {/* <span className="absolute top-3 right-3 bg-[#FDE9B3] text-black text-xs font-semibold px-3 py-1 rounded-full border border-black">
                        {c.rankRequired}
                      </span> */}
                    </div>
                    <div className="pt-4">
                      <h3 className="font-bold text-[15px] text-black group-hover:text-[#23408F] transition line-clamp-1">
                        {c.title}
                      </h3>

                      <p className="text-xs mt-2 text-black font-medium">
                        {c.description}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
