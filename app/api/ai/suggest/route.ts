import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Authentication
        const cookieHeader = req.headers.get("cookie") || "";
        const supabase = createServerClient(cookieHeader);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Request
        const body = await req.json();
        const { prompt, type, context } = body;

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "OpenAI API key is missing from environment" }, { status: 500 });
        }

        // 3. Construct System Message based on type
        let systemMessage = "You are an expert resume writer and career coach. Write professional, impactful, and concise resume content. Focus on achievements and action verbs. Do not use Markdown formatting unless explicitly asked. Return ONLY the requested text, without any introductory or concluding remarks.";

        if (type === "summary") {
            systemMessage += " You are writing a Professional Summary. Keep it between 3-4 sentences. It should highlight core competencies, years of experience, and key professional traits.";
        } else if (type === "experience") {
            systemMessage += " You are writing a job description for a Work Experience section. Return 3-4 bullet points highlighting responsibilities and achievements. Do not use asterisks or dash prefixes, just separate each bullet by a new line.";
        }

        // 4. Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            return NextResponse.json({ error: "Failed to generate AI content" }, { status: response.status });
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content.trim();

        return NextResponse.json({ text: generatedText });

    } catch (err: any) {
        console.error("AI Route Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
