"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import brand from "@/config/brand";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 132, 255, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-white overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Gradient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* NAV */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold">G</div>
          <span className="font-semibold text-white tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            {brand.appName}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#templates" className="hover:text-white transition-colors">Templates</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Free to use — No credit card required
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-5xl leading-[1.05]"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Your Resume,
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Globally Perfected
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          Build beautiful, ATS-friendly resumes in minutes. Choose from professional templates, export as PDF, and share with a unique link.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Build Your Resume — Free
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#templates"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            View Templates
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 md:gap-16">
          {[
            { value: "50K+", label: "Resumes Created" },
            { value: "3", label: "Beautiful Templates" },
            { value: "100%", label: "Free to Start" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESUME PREVIEW MOCKUP */}
      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 backdrop-blur-sm bg-white/5">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-white/5 rounded-md px-4 py-1 text-xs text-gray-500 text-center">
                globalresumebuilder.com/dashboard
              </div>
            </div>
            <div className="grid grid-cols-3 min-h-[400px]">
              {/* Sidebar */}
              <div className="col-span-1 border-r border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  {["Personal Info", "Experience", "Education", "Skills", "Projects"].map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${i === 1 ? "bg-blue-600/20 text-blue-400" : "text-gray-500 hover:text-gray-300"} cursor-pointer transition-colors`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-blue-400" : "bg-gray-600"}`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* Builder area */}
              <div className="col-span-2 p-6 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-4 bg-white/20 rounded w-48 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-32" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="h-3 bg-white/20 rounded w-36 mb-1.5" />
                        <div className="h-2.5 bg-white/10 rounded w-24" />
                      </div>
                      <div className="h-2.5 bg-blue-500/30 rounded w-20" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-white/10 rounded w-full" />
                      <div className="h-2 bg-white/10 rounded w-4/5" />
                      <div className="h-2 bg-white/10 rounded w-3/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative z-10 px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Everything you need to land the job
            </h2>
            <p className="text-gray-400 text-lg">Powerful features designed for modern job seekers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✦",
                title: "3 Professional Templates",
                desc: "Modern, Minimal, and Professional designs crafted by designers.",
                color: "blue",
              },
              {
                icon: "⬡",
                title: "One-Click PDF Export",
                desc: "Download pixel-perfect PDFs that pass ATS scanners.",
                color: "indigo",
              },
              {
                icon: "◈",
                title: "Public Resume Link",
                desc: "Share your resume with a unique link — no login required for viewers.",
                color: "violet",
              },
              {
                icon: "◎",
                title: "Real-time Preview",
                desc: "See changes instantly as you type. What you see is what you get.",
                color: "blue",
              },
              {
                icon: "⊞",
                title: "Multiple Resumes",
                desc: "Create different versions for different roles and industries.",
                color: "indigo",
              },
              {
                icon: "⬒",
                title: "Secure & Private",
                desc: "Bank-level security. Your data is encrypted and never sold.",
                color: "violet",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 backdrop-blur-sm"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center text-${feature.color}-400 text-lg mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES SECTION */}
      <section id="templates" className="relative z-10 px-6 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Choose your template
          </h2>
          <p className="text-gray-400 text-lg">Three unique designs. All optimized for hiring managers and ATS.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Modern", desc: "Bold, contemporary", accent: "blue" },
            { name: "Minimal", desc: "Clean, distraction-free", accent: "indigo" },
            { name: "Professional", desc: "Classic, corporate", accent: "violet" },
          ].map((t) => (
            <div key={t.name} className="group cursor-pointer">
              <div className="relative bg-white/[0.03] border border-white/10 group-hover:border-blue-500/30 rounded-2xl overflow-hidden aspect-[3/4] mb-4 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col p-6">
                  <div className={`w-8 h-8 rounded-full bg-${t.accent}-500/30 mb-4`} />
                  <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-white/10 rounded w-1/2 mb-6" />
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="mb-4">
                      <div className={`h-2 bg-${t.accent}-500/40 rounded w-1/3 mb-2`} />
                      <div className="h-1.5 bg-white/10 rounded mb-1" />
                      <div className="h-1.5 bg-white/10 rounded w-4/5" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-gray-500 text-sm">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "Syne, sans-serif" }}>
            Ready to land your dream job?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of professionals who use {brand.appName} to tell their career story.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 text-lg"
          >
            Start Building — It's Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} {brand.companyName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href={`mailto:${brand.supportEmail}`} className="hover:text-gray-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
