export const STORAGE_KEY = "resumeforge_data_v2";
export const LIBRARY_KEY = "resumeforge_library_v1";
export const ACTIVE_RESUME_KEY = "resumeforge_active_resume";

export const EMPTY_RESUME = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  education: "",
  skills: "",
  experience: "",
  projects: "",
  certifications: "",
};

export const DEMO_RESUME = {
  name: "Shreyas Bhandari",
  title: "Software Engineer",
  email: "shreyas.bhandari@gmail.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  links: "linkedin.com/in/shreyasbhandari | github.com/shreyasb | shreyasbhandari.dev",
  summary:
    "Results-driven software engineer with 3+ years of experience building high-performance web applications and scalable backend systems. Proficient in React, Node.js, and cloud technologies. Passionate about clean architecture, developer experience, and shipping products that delight users.",
  education:
    "Indian Institute of Technology, Mumbai - B.Tech Computer Science | 2019-2023\nRelevant Coursework: Data Structures, Algorithms, System Design, Operating Systems, DBMS",
  skills:
    "JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, AWS, Git, GraphQL, REST APIs, CI/CD, Kubernetes",
  experience: `Infosys Ltd - Senior Software Engineer | Jan 2023 - Present
- Architected a React-based dashboard serving 80K+ daily active users across 12 countries.
- Reduced API response time by 55% through Redis caching and query optimization.
- Led a team of 5 engineers to deliver a microservices migration on schedule.

TCS - Software Engineer | Jun 2021 - Dec 2022
- Built end-to-end features for a fintech SaaS platform using the MERN stack.
- Designed RESTful APIs consumed by 3 mobile and 2 web clients.
- Implemented CI/CD pipelines reducing deployment time from 2 hours to 8 minutes.`,
  projects: `Smart Resume Analyzer | React, Node.js, OpenAI API
- Built an AI-powered tool that analyzes resumes and suggests ATS-friendly improvements.
- Achieved 4.8/5 rating from 500+ beta users in first month.

E-Commerce Platform | Next.js, Stripe, PostgreSQL
- Handles 15K+ monthly transactions with 99.9% uptime.
- Implemented real-time inventory and order tracking with WebSockets.`,
  certifications:
    "AWS Certified Developer - Associate (2024)\nGoogle Professional Cloud Developer (2023)\nMeta Front-End Developer Certificate (2022)",
};

export const ACCENT_COLORS = [
  { id: "black", value: "#111827", label: "Black" },
  { id: "indigo", value: "#4f46e5", label: "Indigo" },
  { id: "blue", value: "#2563eb", label: "Blue" },
  { id: "teal", value: "#0f766e", label: "Teal" },
  { id: "emerald", value: "#047857", label: "Emerald" },
  { id: "rose", value: "#be123c", label: "Rose" },
  { id: "slate", value: "#334155", label: "Slate" },
];

export const DEFAULT_TYPOGRAPHY = {
  fontFamily: "inter",
  bodySize: 13,
  headingSize: 11,
  nameSize: 30,
  lineHeight: 1.7,
  sectionSpacing: 24,
  pageMargin: 52,
};

export const FONT_PRESETS = {
  inter: {
    label: "Inter",
    stack: "'Inter', system-ui, -apple-system, sans-serif",
    category: "Modern",
  },
  dm: {
    label: "DM Sans",
    stack: "'DM Sans', 'Inter', system-ui, sans-serif",
    category: "ATS safe",
  },
  georgia: {
    label: "Georgia",
    stack: "Georgia, 'Times New Roman', serif",
    category: "Traditional",
  },
};

export const splitLines = (txt = "") =>
  txt.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

export const skillsToArray = (txt = "") =>
  txt.split(",").map((skill) => skill.trim()).filter(Boolean);

export function parseExperience(raw = "") {
  const lines = splitLines(raw);
  const items = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (current) current.bullets.push(line.replace(/^- /, "").trim());
    } else {
      if (current) items.push(current);
      const [left, right = ""] = line.split("|").map((part) => part.trim());
      const parts = left.split(/—|–|-/).map((part) => part.trim()).filter(Boolean);
      current = {
        company: parts[0] || left,
        role: parts.slice(1).join(" - ") || "",
        dates: right,
        bullets: [],
      };
    }
  }

  if (current) items.push(current);
  return items;
}

export function parseProjects(raw = "") {
  const lines = splitLines(raw);
  const items = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (current) current.bullets.push(line.replace(/^- /, "").trim());
    } else {
      if (current) items.push(current);
      const [title, tech = ""] = line.split("|").map((part) => part.trim());
      current = { title, tech, bullets: [] };
    }
  }

  if (current) items.push(current);
  return items;
}

export function normalizeResume(data) {
  return {
    ...data,
    educationLines: splitLines(data.education),
    skillList: skillsToArray(data.skills),
    experienceItems: parseExperience(data.experience),
    projectItems: parseProjects(data.projects),
    certificationLines: splitLines(data.certifications),
    linkList: data.links
      ? data.links.split(/[|•,]/).map((link) => link.trim()).filter(Boolean)
      : [],
  };
}

export function createResumeRecord(data = EMPTY_RESUME, overrides = {}) {
  const now = new Date().toISOString();
  const title = data.title?.trim() || "Untitled Resume";
  return {
    id: overrides.id || `resume-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: overrides.name || title,
    version: overrides.version || "General",
    archived: false,
    createdAt: overrides.createdAt || now,
    updatedAt: now,
    data: { ...EMPTY_RESUME, ...data },
    template: overrides.template || "classic",
    accentColor: overrides.accentColor || "#111827",
    typography: { ...DEFAULT_TYPOGRAPHY, ...(overrides.typography || {}) },
  };
}

const ACTION_VERBS = [
  "achieved", "architected", "built", "created", "delivered", "designed",
  "developed", "improved", "implemented", "launched", "led", "optimized",
  "reduced", "shipped", "streamlined",
];

const weakPhrases = ["responsible for", "worked on", "helped with", "participated in"];
const metricPattern = /\b(\d+(\.\d+)?%?|\d+\+|[0-9]+k\+?|[0-9]+m\+?|hours?|minutes?|users?|clients?|countries?|revenue|cost|latency|uptime)\b/i;

function hasActionVerb(text) {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
  return ACTION_VERBS.includes(firstWord);
}

function scoreFromChecks(checks) {
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

export function analyzeResume(data) {
  const resume = normalizeResume(data);
  const bullets = [
    ...resume.experienceItems.flatMap((item) => item.bullets),
    ...resume.projectItems.flatMap((item) => item.bullets),
  ];
  const metricBullets = bullets.filter((bullet) => metricPattern.test(bullet));
  const actionBullets = bullets.filter(hasActionVerb);
  const weakBullets = bullets.filter((bullet) =>
    weakPhrases.some((phrase) => bullet.toLowerCase().includes(phrase))
  );

  const content = scoreFromChecks([
    data.name.trim(),
    data.title.trim(),
    data.email.trim(),
    data.summary.trim().length >= 80,
    resume.experienceItems.length || resume.projectItems.length,
    resume.skillList.length >= 6,
    resume.educationLines.length,
  ]);

  const structure = scoreFromChecks([
    resume.experienceItems.length || resume.projectItems.length,
    bullets.length >= 3,
    resume.skillList.length > 0,
    resume.educationLines.length > 0,
    resume.certificationLines.length > 0 || resume.projectItems.length > 0,
  ]);

  const impact = bullets.length
    ? Math.round(((metricBullets.length / bullets.length) * 55) + ((actionBullets.length / bullets.length) * 45))
    : 0;

  const ats = scoreFromChecks([
    data.email.includes("@"),
    resume.skillList.length >= 6,
    resume.experienceItems.every((item) => item.company && item.role),
    bullets.every((bullet) => !/[★✓→]/.test(bullet)),
    data.links.length < 180,
  ]);

  const readability = scoreFromChecks([
    data.summary.length <= 520,
    bullets.every((bullet) => bullet.length <= 180),
    weakBullets.length === 0,
    resume.skillList.length <= 24,
    splitLines(data.experience).length <= 32,
  ]);

  const scores = { content, structure, impact, ats, readability };
  const overall = Math.round(
    content * 0.22 + structure * 0.18 + impact * 0.24 + ats * 0.2 + readability * 0.16
  );

  const recommendations = [];
  if (!data.summary.trim()) recommendations.push("Add a focused 2-3 sentence summary based on your real role, strengths, and target.");
  if (resume.skillList.length < 6) recommendations.push("Add 6-12 relevant skills so recruiters and ATS systems can understand your fit quickly.");
  if (bullets.length && metricBullets.length < Math.ceil(bullets.length / 3)) {
    recommendations.push("Add measurable results where you know them. Do not invent numbers; use plain impact when metrics are unavailable.");
  }
  if (weakBullets.length) recommendations.push("Replace weak phrasing such as 'responsible for' or 'worked on' with direct action verbs.");
  if (!resume.projectItems.length) recommendations.push("Add at least one project if it provides stronger evidence than your work history alone.");
  if (resume.experienceItems.some((item) => !item.role || !item.dates)) {
    recommendations.push("Use a consistent experience format: Company - Role | Dates, followed by achievement bullets.");
  }

  return {
    scores,
    overall,
    stats: {
      bullets: bullets.length,
      metricBullets: metricBullets.length,
      actionBullets: actionBullets.length,
      skills: resume.skillList.length,
      sections: [
        data.summary,
        data.experience,
        data.education,
        data.skills,
        data.projects,
        data.certifications,
      ].filter((value) => value.trim()).length,
    },
    recommendations: recommendations.slice(0, 5),
  };
}

const STOP_WORDS = new Set([
  "and", "the", "for", "with", "that", "this", "from", "are", "you", "your",
  "will", "our", "their", "have", "has", "using", "into", "within", "across",
  "responsibilities", "requirements", "experience", "candidate", "role",
  "hiring", "seeking", "looking", "preferred", "required",
]);

export function extractKeywords(text = "") {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim().replace(/^\W+|\W+$/g, ""))
    .map((word) => word.endsWith(".") ? word.slice(0, -1) : word)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));

  const counts = new Map();
  normalized.forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 28)
    .map(([word, count]) => ({ word, count }));
}

export function analyzeJobMatch(data, jobDescription = "") {
  const resumeText = Object.values(data).join(" ").toLowerCase();
  const keywords = extractKeywords(jobDescription);
  const matched = keywords.filter(({ word }) => resumeText.includes(word));
  const missing = keywords.filter(({ word }) => !resumeText.includes(word));
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;

  return {
    score,
    keywords,
    matched: matched.slice(0, 12),
    missing: missing.slice(0, 12),
    recommendations: [
      missing.length
        ? `If truthful, add evidence for ${missing.slice(0, 3).map((item) => item.word).join(", ")}.`
        : "The resume already covers the highest-frequency terms in this job description.",
      matched.length
        ? `Strong existing evidence: ${matched.slice(0, 4).map((item) => item.word).join(", ")}.`
        : "Paste a job description to compare it against your current resume.",
      "Only add skills or responsibilities you can honestly support in an interview.",
    ],
  };
}

export function createBulletSuggestion({ situation, task, action, result, impact, tools }) {
  const actionText = action.trim();
  const target = task.trim();
  const context = situation.trim();
  const outcome = result.trim();
  const value = impact.trim();
  const toolText = tools.trim();

  if (!actionText && !target && !context) {
    return {
      suggestion: "",
      why: "Add the action you took first. ResumeForge will not invent work you did not provide.",
    };
  }

  const parts = [];
  const actionStart = actionText || target || context;
  parts.push(actionStart.replace(/\.$/, ""));
  if (toolText) parts.push(`using ${toolText}`);
  if (outcome) parts.push(`to ${outcome.replace(/\.$/, "")}`);
  if (value) parts.push(`, ${value.replace(/\.$/, "")}`);

  const sentence = parts.join(" ").replace(/\s+,/g, ",");
  return {
    suggestion: `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`,
    why: value
      ? "This keeps the claim grounded in details you provided and connects action to impact."
      : "This is truthful but would be stronger with a measurable result if you have one.",
  };
}
