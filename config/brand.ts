// ============================================================
// WHITE LABEL CONFIGURATION
// Change these values to rebrand the entire application
// ============================================================

export const brand = {
  // App Identity
  appName: "Global Resume Builder",
  appTagline: "Craft Your Career Story",
  appDescription: "Build stunning resumes that get you hired — in minutes.",
  companyName: "Global Resume Builder Inc.",
  companyWebsite: "https://globalresumebuilder.com",
  author: "Linus Lucas Rwechoka",

  // Logo (path to /public folder or external URL)
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",

  // Theme Colors (used throughout the app)
  theme: {
    primary: "#0A84FF",        // Main brand color (buttons, links, highlights)
    primaryDark: "#0060DF",    // Darker shade for hover/active states
    primaryLight: "#70BFFF",   // Lighter shade for backgrounds
    accent: "#FF6B35",         // Accent/contrast color (badges, notifications)
    background: "#0B0E1A",     // Main dark background
    surface: "#111827",        // Cards and panels
    surfaceLight: "#1F2937",   // Elevated surfaces
    border: "#1E293B",         // Border color
    textPrimary: "#F9FAFB",    // Primary text
    textSecondary: "#9CA3AF",  // Secondary/muted text
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },

  // Fonts (Google Fonts or system)
  fonts: {
    display: "Syne",           // Headings & display
    body: "DM Sans",           // Body text
    mono: "JetBrains Mono",    // Code/monospace
  },

  // Social Links (set to "" to hide)
  social: {
    twitter: "https://twitter.com/globalresumebuilder",
    linkedin: "https://linkedin.com/company/globalresumebuilder",
    github: "",
  },

  // Email Configuration
  supportEmail: "support@globalresumebuilder.com",
  noReplyEmail: "noreply@globalresumebuilder.com",

  // Feature Flags
  features: {
    publicResumes: true,       // Allow public shareable resume links
    pdfExport: true,           // Allow PDF download
    multipleResumes: true,     // Allow multiple resumes per user
    aiSuggestions: true,       // AI-powered content suggestions
    analytics: false,          // User analytics dashboard (future)
  },

  // Limits (for SaaS tiers)
  limits: {
    free: {
      maxResumes: 3,
      maxSections: 10,
      canDownloadPDF: true,
      canSharePublic: true,
    },
    pro: {
      maxResumes: -1,          // Unlimited
      maxSections: -1,         // Unlimited
      canDownloadPDF: true,
      canSharePublic: true,
    },
  },

  // SEO
  seo: {
    defaultTitle: "Global Resume Builder — Create Your Perfect Resume",
    titleTemplate: "%s | Global Resume Builder",
    defaultDescription:
      "Create professional resumes with our easy-to-use builder. Choose from beautiful templates and export as PDF.",
    keywords: [
      "resume builder",
      "CV maker",
      "professional resume",
      "job application",
      "career tools",
    ],
    ogImage: "/og-image.png",
  },
} as const;

export type Brand = typeof brand;
export default brand;
