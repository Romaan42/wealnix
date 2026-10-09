export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb] fixed inset-0 z-[9999] overflow-hidden">
      {/* Subtle BG Glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#1E3A8A]/10 rounded-full blur-[100px] -top-20 -left-20"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#C5A059]/10 rounded-full blur-[100px] -bottom-20 -right-20"></div>

      {/* Logo */}
      <div className="relative">
        <div className="w-[84px] h-[84px] bg-gradient-to-br from-[#1E3A8A] to-[#162c6b] rounded-[22px] flex items-center justify-center font-black text-[34px] text-white shadow-[0_20px_40px_rgba(30,58,138,0.25)] animate-[float_2.5s_ease-in-out_infinite]">
          W
        </div>
        {/* Live Dot */}
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="w-6 h-6 bg-[#C5A059] rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          </div>
        </div>
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-[22px] border border-[#1E3A8A]/10 scale-[1.35] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      </div>

      {/* Text */}
      <h2 className="mt-7 text-[19px] font-extrabold tracking-[0.2px] text-[#1E293B]">
        Wealnex <span className="text-[#C5A059] font-black">•</span>{" "}
        <span className="font-bold">Loading</span>
      </h2>

      <div className="mt-2 flex items-center gap-2 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          1 WX$ = 100 PKR • Syncing Wallets
        </p>
      </div>

      {/* Modern Dots */}
      <div className="mt-9 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A] animate-[bounceDot_1s_infinite_0ms]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]/80 animate-[bounceDot_1s_infinite_150ms]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-[bounceDot_1s_infinite_300ms]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]/80 animate-[bounceDot_1s_infinite_450ms]"></span>
      </div>

      {/* Progress */}
      <div className="mt-8 w-[220px] h-[4px] bg-white border border-gray-100 rounded-full overflow-hidden p-[2px]">
        <div className="h-full w-full bg-gradient-to-r from-[#1E3A8A] via-[#2a4ab8] to-[#C5A059] rounded-full animate-[shimmer_1.1s_ease-in-out_infinite]"></div>
      </div>

      <p className="mt-4 text-[10px] text-gray-400 font-medium">
        Please wait, securing your session...
      </p>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounceDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
