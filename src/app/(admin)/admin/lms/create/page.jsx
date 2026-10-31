"use client";
import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Plus, Trash2, Loader2, Save, Upload } from "lucide-react";

const UPLOAD_PRESET = "wealnix_lms"; // Ek hi preset use karo
const BUNDLES = [
  {
    id: 20,
    name: "Digital Foundation Program (DFP)",
    priceWX: 20,
    pricePKR: 2000,
    vp: 2,
    color: "border-gray-300",
    bg: "bg-gray-50",
    desc: "Basic Personal Access",
  },
  {
    id: 50,
    name: "Professional Certification Program (PCP)",
    priceWX: 50,
    pricePKR: 5000,
    vp: 5,
    color: "border-slate-400",
    bg: "bg-slate-50",
    desc: "Standard Resell Rights",
  },
  {
    id: 100,
    name: "Advanced Digital Program (ADP)",
    priceWX: 100,
    pricePKR: 10000,
    vp: 10,
    color: "border-[#C5A059]",
    bg: "bg-[#C5A059]/10",
    desc: "Master Resell Rights (MRR)",
    popular: true,
  },
  {
    id: 150,
    name: "Digital Management Program (DMP)",
    priceWX: 150,
    pricePKR: 15000,
    vp: 15,
    color: "border-purple-400",
    bg: "bg-purple-50",
    desc: "Full White Label Rights",
  },
  {
    id: 200,
    name: "Digital Corporate Program (DCP)",
    priceWX: 200,
    pricePKR: 20000,
    vp: 20,
    color: "border-cyan-400",
    bg: "bg-cyan-50",
    desc: "White Label + Agency Master",
  },
];
export default function AdminCourseUpload() {
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [form, setForm] = useState({
    title: "",
    link: "",
    category: "",
    description: "",
    rankRequired: "Beginner",
    bundleRequired: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("/api/lms/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, thumbnail }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Course Created!");
        window.location.href = "/admin/lms";
      } else {
        console.log(data);
      }
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
            <input
              required
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full border border-black rounded-xl p-3 text-sm"
              placeholder="Course link"
            />
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full border border-black rounded-xl p-3 text-sm"
              placeholder="category"
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
                {BUNDLES.map((val, i) => (
                  <option key={i}>{val.name}</option>
                ))}
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
                    if (result.event === "success") {
                      setThumbnail(result.info.secure_url);
                    }
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
                {thumbnail && (
                  <div className="border border-black rounded-xl overflow-hidden">
                    <CldImage
                      width="200"
                      height="120"
                      src={thumbnail}
                      alt="thumb"
                      className="w-40 h-20 object-cover"
                    />
                  </div>
                )}
              </div>
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
