"use client";
import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Plus, Trash2, Loader2, Save, Upload } from "lucide-react";

const UPLOAD_PRESET = "wealnix_lms"; // Ek hi preset use karo

export default function AdminCourseUpload() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    thumbnailPublicId: "",
    rankRequired: "Beginner",
    bundleRequired: 0,
    lessons: [
      {
        title: "",
        videoUrl: "",
        publicId: "",
        duration: "",
        isFree: true,
        content: "",
      },
    ],
  });

  const getInfo = (result) =>
    typeof result.info === "string" ? JSON.parse(result.info) : result.info;

  const addLesson = () =>
    setForm({
      ...form,
      lessons: [
        ...form.lessons,
        {
          title: "",
          videoUrl: "",
          publicId: "",
          duration: "",
          isFree: false,
          content: "",
        },
      ],
    });
  const removeLesson = (i) =>
    setForm({ ...form, lessons: form.lessons.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.thumbnailPublicId) return alert("Thumbnail upload karo pehle");
    if (form.lessons.some((l) => !l.publicId))
      return alert("Saari lessons ka video upload karo");

    setLoading(true);
    try {
      const res = await fetch("/api/lms/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert("Course Created!");
        window.location.href = "/admin/lms";
      } else throw new Error(data.error);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-black rounded-2xl p-5 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Create Course</h1>
            <p className="text-sm text-gray-500">Signed CldUploadWidget</p>
          </div>
          <div className="text-xs px-3 py-1 bg-[#23408F] text-white rounded-full">
            Admin
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-black rounded-[20px] p-6 space-y-4">
            <h3 className="font-bold">1. Basic Info</h3>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-black rounded-xl p-3 text-sm"
              placeholder="Course Title"
            />
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-black rounded-xl p-3 text-sm h-24"
              placeholder="Description"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={form.rankRequired}
                onChange={(e) =>
                  setForm({ ...form, rankRequired: e.target.value })
                }
                className="w-full border border-black rounded-xl p-3 text-sm bg-white"
              >
                <option>Beginner</option>
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Diamond</option>
              </select>
              <input
                type="number"
                value={form.bundleRequired}
                onChange={(e) =>
                  setForm({ ...form, bundleRequired: Number(e.target.value) })
                }
                className="w-full border border-black rounded-xl p-3 text-sm"
                placeholder="Bundle WX$"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Thumbnail</label>
              <div className="mt-2 flex gap-4 items-start">
                <CldUploadWidget
                  uploadPreset={UPLOAD_PRESET}
                  signatureEndpoint="/api/cloudinary/sign"
                  options={{
                    folder: "wealnix/lms/thumbs",
                    resourceType: "image",
                  }}
                  onSuccess={(result) => {
                    const info = getInfo(result);
                    setForm({
                      ...form,
                      thumbnail: info.secure_url,
                      thumbnailPublicId: info.public_id,
                    });
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="border border-dashed border-black rounded-xl p-6 flex-1 text-center hover:bg-gray-50"
                    >
                      <Upload className="mx-auto mb-2 w-5 h-5" />
                      <span className="text-xs font-medium">
                        Upload Thumbnail
                      </span>
                    </button>
                  )}
                </CldUploadWidget>
                {form.thumbnailPublicId && (
                  <div className="border border-black rounded-xl overflow-hidden">
                    <CldImage
                      width="200"
                      height="120"
                      src={form.thumbnailPublicId}
                      alt="thumb"
                      className="w-40 h-20 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-black rounded-[20px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">2. Lessons ({form.lessons.length})</h3>
              <button
                type="button"
                onClick={addLesson}
                className="text-xs px-3 py-1.5 bg-black text-white rounded-full flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {form.lessons.map((lesson, idx) => (
                <div
                  key={idx}
                  className="border border-black rounded-xl p-4 bg-[#F9FAFB]"
                >
                  <div className="flex justify-between mb-3">
                    <span className="text-sm font-bold">Lesson {idx + 1}</span>
                    <div className="flex gap-2 items-center">
                      <label className="text-xs flex gap-1">
                        <input
                          type="checkbox"
                          checked={lesson.isFree}
                          onChange={(e) => {
                            const nl = [...form.lessons];
                            nl[idx].isFree = e.target.checked;
                            setForm({ ...form, lessons: nl });
                          }}
                        />{" "}
                        Free
                      </label>
                      <button type="button" onClick={() => removeLesson(idx)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <input
                    required
                    value={lesson.title}
                    onChange={(e) => {
                      const nl = [...form.lessons];
                      nl[idx].title = e.target.value;
                      setForm({ ...form, lessons: nl });
                    }}
                    placeholder="Lesson title"
                    className="w-full border border-black rounded-lg p-2.5 text-sm mb-2"
                  />
                  <div className="grid md:grid-cols-2 gap-2">
                    <CldUploadWidget
                      uploadPreset={UPLOAD_PRESET}
                      signatureEndpoint="/api/cloudinary/sign"
                      options={{
                        folder: "wealnix/lms/videos",
                        resourceType: "video",
                      }}
                      onSuccess={(result) => {
                        const info = getInfo(result);
                        const nl = [...form.lessons];
                        nl[idx].videoUrl = info.secure_url;
                        nl[idx].publicId = info.public_id;
                        setForm({ ...form, lessons: nl });
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="border border-dashed border-black rounded-lg p-3 text-xs bg-white hover:bg-gray-50"
                        >
                          {lesson.publicId
                            ? "✓ Video Uploaded"
                            : "Upload Video"}
                        </button>
                      )}
                    </CldUploadWidget>
                    <input
                      value={lesson.duration}
                      onChange={(e) => {
                        const nl = [...form.lessons];
                        nl[idx].duration = e.target.value;
                        setForm({ ...form, lessons: nl });
                      }}
                      placeholder="12:45"
                      className="border border-black rounded-lg p-2.5 text-sm"
                    />
                  </div>
                  {lesson.publicId && (
                    <p className="text-[10px] text-green-600 mt-1 truncate">
                      ID: {lesson.publicId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#C9A24C] text-black font-bold py-4 rounded-xl border border-black flex justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}{" "}
            {loading ? "Creating..." : "Create Course & Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}
