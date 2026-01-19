import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY; // Fallback for flexibility
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!genAI) {
            return NextResponse.json({
                role: 'assistant',
                content: "AI is not configured. Please add GOOGLE_API_KEY to .env.local."
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a helpful technician assistant. You troubleshoot hardware issues, suggest repairs, and provide technical advice. Keep responses concise and technical."
        });

        // Filter out system messages as Gemini handles them via systemInstruction or behaves differently
        // And convert to Gemini history format
        const validMessages = messages.filter((m: any) => m.role !== 'system');
        const lastMsg = validMessages[validMessages.length - 1];

        // Construct history from previous messages
        const history = validMessages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMsg.content);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: 'assistant', content: text });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
    }
}
