import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { prompt, context } = await request.json();

        if (!prompt?.trim()) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const fullPrompt = `You are an expert resume writer and career coach. Help write compelling, ATS-optimized resume content using strong action verbs and quantifiable achievements.

User context: ${context ? JSON.stringify(context) : "Not provided"}

Request: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const suggestion = result.response.text();

        return NextResponse.json({ suggestion });
    } catch (error) {
        console.error("AI suggestion error:", error);
        return NextResponse.json(
            { error: "Failed to generate suggestion" },
            { status: 500 }
        );
    }
}