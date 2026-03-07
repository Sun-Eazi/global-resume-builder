"use client";

import { useState } from "react";
import Link from "next/link";
import brand from "@/config/brand";

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState("modern");

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] font-dm-sans">
      {/* NAV */}
      <nav className="custom-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">GRB</div>
            <span className="logo-name">Global Resume Builder</span>
          </Link>
          <div className="nav-btns">
            <Link href="/auth/login" className="cv-btn cv-btn-ghost">
              Sign In
            </Link>
            <Link href="/auth/signup" className="cv-btn cv-btn-primary">
              Try Builder →
            </Link>
          </div>
        </div>
      </nav>

      <div id="page-landing" className="page active">
        {/* Hero */}
        <div className="hero">
          <div className="hero-glow"></div>
          <div className="hero-glow2"></div>
          <div className="badge fade-up">
            <span className="dot"></span> Free to use · No credit card required
          </div>
          <h1 className="hero-title fade-up delay-1">
            Build Resumes That<br />
            <span className="gradient-text">Get You Hired</span>
          </h1>
          <p className="hero-sub fade-up delay-2">
            Create stunning, professional resumes in minutes. Choose from 3 beautiful templates, export as PDF, and share with a public link.
          </p>
          <div className="hero-btns fade-up delay-3">
            <Link href="/auth/signup" className="cv-btn cv-btn-primary cv-btn-large">
              Create Your Resume →
            </Link>
            <a href="#templates-section" className="btn-outline">
              View Templates
            </a>
          </div>
          <div className="stats fade-up delay-4">
            <div><div className="stat-val">50,000+</div><div className="stat-lbl">Resumes Created</div></div>
            <div><div className="stat-val">3</div><div className="stat-lbl">Beautiful Templates</div></div>
            <div><div className="stat-val">120+</div><div className="stat-lbl">Countries</div></div>
          </div>
        </div>

        {/* Templates section */}
        <div className="section" id="templates-section">
          <h2 className="section-title">Choose Your Template</h2>
          <p className="section-sub">Three professionally designed templates to match any style.</p>
          <div className="template-tabs">
            <button
              className={`tab-btn ${activeTemplate === "modern" ? "active" : ""}`}
              onClick={() => setActiveTemplate("modern")}
            >
              Modern
            </button>
            <button
              className={`tab-btn ${activeTemplate === "minimal" ? "active" : ""}`}
              onClick={() => setActiveTemplate("minimal")}
            >
              Minimal
            </button>
            <button
              className={`tab-btn ${activeTemplate === "professional" ? "active" : ""}`}
              onClick={() => setActiveTemplate("professional")}
            >
              Professional
            </button>
          </div>

          <div className="template-preview">
            <div className="glass-card-new">
              {/* MODERN */}
              {activeTemplate === "modern" && (
                <div id="tmpl-modern">
                  <div className="resume-card">
                    <div className="resume-modern-header">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div className="resume-name">Jane Doe</div>
                          <div className="resume-role">Senior Software Engineer</div>
                          <div className="resume-contact">
                            <span>✉ jane@example.com</span>
                            <span>☎ +1 555 0100</span>
                            <span>⊙ San Francisco, CA</span>
                            <span>in linkedin.com/in/jane</span>
                          </div>
                        </div>
                        <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg,#0A84FF,#70BFFF)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "18px", border: "3px solid rgba(255,255,255,.2)" }}>
                          JD
                        </div>
                      </div>
                    </div>
                    <div className="resume-body">
                      <div className="resume-sidebar">
                        <div style={{ marginBottom: "18px" }}>
                          <div className="r-section-title">Summary</div>
                          <p style={{ fontSize: "10px", color: "#475569", lineHeight: 1.7 }}>
                            Full-stack engineer with 6+ years building scalable SaaS products. Passionate about clean code and great UX.
                          </p>
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                          <div className="r-section-title">Skills</div>
                          <div>
                            <span className="r-skill-tag">React</span>
                            <span className="r-skill-tag">Next.js</span>
                            <span className="r-skill-tag">TypeScript</span>
                            <span className="r-skill-tag">Node.js</span>
                            <span className="r-skill-tag">PostgreSQL</span>
                            <span className="r-skill-tag">AWS</span>
                          </div>
                        </div>
                        <div style={{ marginBottom: "16px" }}>
                          <div className="r-section-title">Languages</div>
                          <div style={{ fontSize: "10px", color: "#1E293B", marginBottom: "4px" }}>
                            <strong>English</strong> <span style={{ color: "#64748B" }}>Native</span>
                          </div>
                          <div style={{ fontSize: "10px", color: "#1E293B" }}>
                            <strong>Spanish</strong> <span style={{ color: "#64748B" }}>Professional</span>
                          </div>
                        </div>
                        <div>
                          <div className="r-section-title">Certifications</div>
                          <div style={{ fontSize: "10px", color: "#1E293B", fontWeight: 600 }}>AWS Solutions Architect</div>
                          <div style={{ fontSize: "9px", color: "#64748B" }}>Amazon · Jan 2023</div>
                        </div>
                      </div>
                      <div className="resume-main">
                        <div className="r-main-section">
                          <div className="r-main-title">Work Experience</div>
                          <div className="r-job">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <div><div className="r-job-title">Staff Engineer</div><div className="r-job-company">Stripe</div></div>
                              <div style={{ textAlign: "right" }}><div className="r-job-date">Jan 2022 — Present</div><div style={{ fontSize: "9px", color: "#94A3B8" }}>San Francisco</div></div>
                            </div>
                            <div className="r-job-desc">Led the core payments infrastructure team, reducing latency by 40% and increasing reliability to 99.99% uptime.</div>
                          </div>
                          <div className="r-job">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <div><div className="r-job-title">Senior Engineer</div><div className="r-job-company">Airbnb</div></div>
                              <div style={{ textAlign: "right" }}><div className="r-job-date">Mar 2019 — Dec 2021</div></div>
                            </div>
                            <div className="r-job-desc">Built guest checkout flow, improving conversion by 18%. Mentored 4 junior engineers.</div>
                          </div>
                        </div>
                        <div className="r-divider"></div>
                        <div className="r-main-section">
                          <div className="r-main-title">Education</div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div><div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>B.Sc. Computer Science</div><div style={{ fontSize: "11px", color: "#0A84FF", fontWeight: 500 }}>MIT</div></div>
                            <div style={{ fontSize: "10px", color: "#64748B" }}>2015 — 2019<br />GPA 3.9</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MINIMAL */}
              {activeTemplate === "minimal" && (
                <div id="tmpl-minimal">
                  <div className="resume-minimal">
                    <div className="rm-header">
                      <div className="rm-name">Jane Doe</div>
                      <div className="rm-role">Senior Software Engineer</div>
                      <div className="rm-contact">
                        <span>jane@example.com</span><span>+1 555 0100</span><span>San Francisco, CA</span>
                      </div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.8, marginBottom: "22px" }}>
                      Full-stack engineer with 6+ years building scalable SaaS products. Passionate about clean architecture and user-centric design.
                    </p>
                    <div className="rm-section">
                      <div className="rm-stitle">Work Experience</div>
                      <div className="rm-row">
                        <div className="rm-date">Jan 2022<br />— Present</div>
                        <div>
                          <div className="rm-title">Staff Engineer</div>
                          <div className="rm-sub">Stripe</div>
                          <div className="rm-desc">Led payments infrastructure, reducing latency 40% and achieving 99.99% uptime.</div>
                        </div>
                      </div>
                      <div className="rm-row">
                        <div className="rm-date">Mar 2019<br />— Dec 2021</div>
                        <div>
                          <div className="rm-title">Senior Engineer</div>
                          <div className="rm-sub">Airbnb</div>
                          <div className="rm-desc">Built guest checkout flow improving conversion by 18%.</div>
                        </div>
                      </div>
                    </div>
                    <div className="rm-section">
                      <div className="rm-stitle">Education</div>
                      <div className="rm-row">
                        <div className="rm-date">2015 — 2019</div>
                        <div>
                          <div className="rm-title">MIT</div>
                          <div className="rm-sub">B.Sc. Computer Science · GPA 3.9</div>
                        </div>
                      </div>
                    </div>
                    <div className="rm-section">
                      <div className="rm-stitle">Skills</div>
                      <span className="rm-skill">React</span><span className="rm-skill">Next.js</span><span className="rm-skill">TypeScript</span><span className="rm-skill">Node.js</span><span className="rm-skill">PostgreSQL</span><span className="rm-skill">AWS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFESSIONAL */}
              {activeTemplate === "professional" && (
                <div id="tmpl-professional">
                  <div className="resume-professional">
                    <div className="rp-header">
                      <div className="rp-name">Jane Doe</div>
                      <div className="rp-role">Senior Software Engineer</div>
                      <div className="rp-contact">
                        <span>jane@example.com</span><span>+1 555 0100</span><span>San Francisco, CA</span><span>linkedin.com/in/jane</span>
                      </div>
                    </div>
                    <div className="rp-accent"></div>
                    <div className="rp-body">
                      <div className="rp-summary">
                        Full-stack engineer with 6+ years of experience building scalable SaaS products at high-growth startups and Fortune 500 companies.
                      </div>
                      <div className="rp-section">
                        <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">Work Experience</div><div className="rp-sline"></div></div>
                        <div className="rp-item">
                          <div className="rp-row"><div><span className="rp-job">Staff Engineer</span><span className="rp-co"> · Stripe</span></div><div className="rp-date">Jan 2022 – Present<br />San Francisco</div></div>
                          <div className="rp-desc">Led core payments infrastructure team. Reduced latency 40%, achieved 99.99% uptime SLA, onboarded 3 new payment providers.</div>
                        </div>
                        <div className="rp-item">
                          <div className="rp-row"><div><span className="rp-job">Senior Engineer</span><span className="rp-co"> · Airbnb</span></div><div className="rp-date">Mar 2019 – Dec 2021</div></div>
                          <div className="rp-desc">Built guest checkout, improving conversion 18%. Mentored 4 engineers, introduced TypeScript migration.</div>
                        </div>
                      </div>
                      <div className="rp-section">
                        <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">Education</div><div className="rp-sline"></div></div>
                        <div className="rp-item">
                          <div className="rp-row"><div><span className="rp-job">B.Sc. Computer Science, MIT</span></div><div className="rp-date">2015 – 2019<br />GPA 3.9</div></div>
                        </div>
                      </div>
                      <div className="rp-section">
                        <div className="rp-stitle"><div className="rp-bar"></div><div className="rp-sname">Skills</div><div className="rp-sline"></div></div>
                        <div className="rp-item" style={{ fontSize: "11px", color: "#374151" }}>
                          <strong>Frontend:</strong> React, Next.js, TypeScript, Tailwind &nbsp;|&nbsp; <strong>Backend:</strong> Node.js, PostgreSQL, Redis &nbsp;|&nbsp; <strong>Cloud:</strong> AWS, Docker
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/auth/signup" className="cv-btn cv-btn-primary">Use This Template →</Link>
          </div>
        </div>

        {/* Features */}
        <div className="section">
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-sub">Built for job seekers, freelancers, and professionals worldwide.</p>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon">✦</div><div className="feature-title">3 Stunning Templates</div><div className="feature-desc">Modern, Minimal, and Professional — all fully customizable and print-ready.</div></div>
            <div className="feature-card"><div className="feature-icon">⬇</div><div className="feature-title">One-Click PDF Export</div><div className="feature-desc">Download a pixel-perfect A4 PDF, formatted and ready to send.</div></div>
            <div className="feature-card"><div className="feature-icon">🔗</div><div className="feature-title">Public Resume Link</div><div className="feature-desc">Share your resume at yourdomain.com/resume/your-name with anyone.</div></div>
            <div className="feature-card"><div className="feature-icon">🤖</div><div className="feature-title">AI-Powered Writing</div><div className="feature-desc">OpenAI helps you write compelling bullet points and summaries.</div></div>
            <div className="feature-card"><div className="feature-icon">📱</div><div className="feature-title">Works Everywhere</div><div className="feature-desc">Fully responsive. Installable as a PWA. Works offline too.</div></div>
            <div className="feature-card"><div className="feature-icon">🔒</div><div className="feature-title">Bank-Level Security</div><div className="feature-desc">Supabase RLS, encrypted auth, DOMPurify sanitization. Your data is safe.</div></div>
          </div>
        </div>

        {/* CTA */}
        <div className="section" style={{ paddingBottom: "100px" }}>
          <div className="cta-box">
            <div className="cta-glow"></div>
            <div style={{ position: "relative" }}>
              <div className="cta-title">Ready to Land Your Dream Job?</div>
              <div className="cta-sub">Join thousands of professionals who trust Global Resume Builder.</div>
              <Link href="/auth/signup" className="cv-btn cv-btn-primary cv-btn-large">Start Building — It's Free</Link>
            </div>
          </div>
        </div>

        <footer className="custom-footer">
          <div className="footer-inner">
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Built by {brand.author}.
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href={`mailto:${brand.supportEmail}`} className="footer-link">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
