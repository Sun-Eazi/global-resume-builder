"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Next.js App Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0B0E1A] text-white flex flex-col items-center justify-center p-8 text-center" style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
            <div className="max-w-2xl bg-red-500/10 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
                <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                    Oops! Something crashed.
                </h2>
                <p className="text-gray-400 mb-6">
                    We encountered an unexpected technical error while rendering this page. Please copy the error details below and send them to your assistant so they can fix the exact line of code.
                </p>

                <div className="text-left bg-black/50 p-4 rounded-xl border border-white/10 overflow-auto max-h-64 mb-8">
                    <p className="font-mono text-xs text-red-400 mb-2"><strong>Error:</strong> {error.message}</p>
                    <pre className="font-mono text-[10px] text-gray-500 whitespace-pre-wrap">{error.stack}</pre>
                </div>

                <button
                    onClick={() => reset()}
                    className="bg-red-500 hover:bg-red-400 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.href = "/dashboard"}
                    className="ml-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}
