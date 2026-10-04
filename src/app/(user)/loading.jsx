export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7fb] fixed inset-0 z-[9999]">
      {/* Logo Pulse */}
      <div className="relative">
        <div className="w-20 h-20 bg-[#1E3A8A] rounded-2xl flex items-center justify-center font-bold text-3xl text-white animate-pulse shadow-xl shadow-[#1E3A8A]/20">
          W
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#C5A059] rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
        </div>
      </div>

      {/* Text */}
      <h2 className="mt-6 text-[18px] font-bold text-[#1E293B] tracking-wide">
        Wealnex <span className="text-[#C5A059]">Loading</span>
      </h2>
      <p className="text-[11px] text-gray-400 mt-1 font-mono">
        1 WX$ = 100 PKR • Syncing E-Wallet & S-Wallet
      </p>

      {/* Shimmer Bars */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-8 bg-[#1E3A8A] rounded-full animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-2 h-8 bg-[#1E3A8A]/70 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-2 h-8 bg-[#C5A059] rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        <div className="w-2 h-8 bg-[#C5A059]/70 rounded-full animate-[bounce_1s_infinite_600ms]"></div>
      </div>

      {/* Progress line */}
      <div className="mt-10 w-[200px] h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-[#1E3A8A] to-[#C5A059] rounded-full animate-[shimmer_1.2s_infinite]"></div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
