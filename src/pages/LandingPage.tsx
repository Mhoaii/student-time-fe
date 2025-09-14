import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
	<div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
	  {/* Background */}
	  <div className="pointer-events-none absolute inset-0">
		{/* soft radial glow */}
		<div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
		<div className="absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
		
		<div className="absolute -top-80 -left-80 h-20 w-20 rounded-full bg-yellow-500/10 blur-3xl" />
		<div className="absolute -bottom-16 -right-16 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
		{/* grid lines */}
		<svg
		  className="absolute inset-0 h-full w-full opacity-[0.06]"
		  xmlns="http://www.w3.org/2000/svg"
		>
		  <defs>
			<pattern
			  id="grid"
			  width="32"
			  height="32"
			  patternUnits="userSpaceOnUse"
			>
			  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
			</pattern>
		  </defs>
		  <rect width="100%" height="100%" fill="url(#grid)" />
		</svg>
	  </div>

	  {/* bar*/}
	  <header className="relative z-10">
		<div className="flex h-16 w-full items-center justify-between px-6">
			{/* logo */}
			<div className="flex items-center gap-3">
			<div className="h-9 w-9 rounded-md border border-white/20 bg-white/5" />
			<div className="h-3 w-28 rounded bg-white/10" />
			</div>
			<div className="text-sm text-white/60">v0.1</div>
		</div>
	</header>

	  {/* Center content */}
	  <main className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
		<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
		  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
		  To-do app
		</div>

		<h1 className="mb-3 text-4xl font-semibold tracking-tight md:text-5xl">
		  Quản lý thời gian cho sinh viên
		</h1>
		<p className="mb-10 max-w-xl text-white/70">
		  Lên kế hoạch, theo dõi hoạt động và hoàn thành đúng hạn—tất cả ở một nơi.
		</p>

		<div className="flex flex-col items-center gap-3 sm:flex-row">
		  <Link
			to="/login"
			className="inline-flex h-12 items-center justify-center rounded-xl bg-yellow-400 px-6 font-medium text-black shadow-[0_8px_20px_-6px_rgba(250,204,21,.6)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/60"
		  >
			Đăng nhập
		  </Link>
		  <Link
			to="/register"
			className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
		  >
			Đăng ký
		  </Link>
		</div>



		<p className="mt-12 text-xs text-white/40">
		  * Dự án của Phan Minh Hoài cho Hackathon AI Naver Việt Nam 2025
		</p>
	  </main>
	</div>
  );
}
