import DOMPurify from "isomorphic-dompurify";

// ============================================================
// INPUT SANITIZATION
// ============================================================

export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== "string") return "";
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "br", "p", "ul", "li", "ol"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export function sanitizeUrl(url: string): string {
  if (!url) return "";
  const cleaned = url.trim();
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    return `https://${cleaned}`;
  }
  return cleaned;
}

// ============================================================
// VALIDATION
// ============================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters required");
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  return { valid: errors.length === 0, errors };
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (username.length < 3) return { valid: false, error: "Username must be at least 3 characters" };
  if (username.length > 30) return { valid: false, error: "Username must be 30 characters or less" };
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  return { valid: true };
}

// ============================================================
// SANITIZE RESUME DATA (recursive)
// ============================================================

export function sanitizeResumeData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "object" && item !== null
          ? sanitizeResumeData(item as Record<string, unknown>)
          : typeof item === "string"
            ? sanitizeText(item)
            : item
      );
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeResumeData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// ============================================================
// DATE HELPERS
// ============================================================

export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  } catch {
    return dateString;
  }
}

export function formatDateRange(start?: string, end?: string, isCurrent?: boolean): string {
  const startStr = formatDate(start);
  const endStr = isCurrent ? "Present" : formatDate(end);
  if (!startStr) return endStr || "";
  if (!endStr) return startStr;
  return `${startStr} — ${endStr}`;
}
