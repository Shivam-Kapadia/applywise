import type { ChatMessage } from "./openrouter";

export interface KitContext {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
  candidateName?: string | null;
}

const SYSTEM = `You are a careful, concrete career assistant helping a job seeker apply.
Rules you must follow:
- Ground everything strictly in the candidate's resume and the job description provided.
- Never invent employers, titles, dates, degrees, or metrics the resume does not support.
- Write in clear, natural, professional English. No fluff, no clichés, no emojis.
- Return plain text only (light markdown like bullet points is fine). No preamble like "Sure, here is...".`;

function context(ctx: KitContext): string {
  return `JOB TITLE: ${ctx.jobTitle || "(unknown)"}
COMPANY: ${ctx.company || "(unknown)"}
${ctx.candidateName ? `CANDIDATE NAME: ${ctx.candidateName}\n` : ""}
--- JOB DESCRIPTION ---
${ctx.jobDescription || "(none provided)"}

--- CANDIDATE RESUME ---
${ctx.resumeText || "(no resume on file — say so where relevant and keep claims generic)"}`;
}

function msg(instruction: string, ctx: KitContext): ChatMessage[] {
  return [
    { role: "system", content: SYSTEM },
    { role: "user", content: `${instruction}\n\n${context(ctx)}` },
  ];
}

export const KIT_PROMPTS = {
  coverLetter: (ctx: KitContext) =>
    msg(
      `Write a tailored cover letter (250-350 words) for this role. Open with a specific hook tied to the company/role, map 2-3 of the candidate's most relevant experiences to the job's needs, and close with a confident call to action. Use the candidate's name in the sign-off if provided. Do not fabricate experience.`,
      ctx
    ),

  resumeBullets: (ctx: KitContext) =>
    msg(
      `Rewrite the candidate's most relevant resume bullets to target this specific job. Produce 6-8 punchy, results-oriented bullets that start with strong verbs and reflect the keywords and priorities in the job description — but only using accomplishments supported by the resume. Output as a markdown bullet list.`,
      ctx
    ),

  interviewQuestions: (ctx: KitContext) =>
    msg(
      `List the 5 most likely interview questions for this specific role and candidate. For each, add a one-sentence tip on what the interviewer is really probing for. Number them 1-5.`,
      ctx
    ),

  companyBrief: (ctx: KitContext) =>
    msg(
      `Write a concise one-page company brief to help the candidate prepare. Cover: what the company does, likely products/market, why this role matters to them, and 3 smart questions the candidate could ask. If you are not certain about a fact, clearly hedge it. Begin with a one-line note that this is AI-generated and should be verified. Use short markdown sections.`,
      ctx
    ),
} as const;
