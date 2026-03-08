import Link from "next/link";
import brand from "@/config/brand";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0B0E1A] pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto glass rounded-2xl p-8 md:p-12 border border-white/10">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 text-blue-400 hover:text-blue-300 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-syne), sans-serif" }}>
                    Terms of Service
                </h1>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing our app, {brand.appName}, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software) on {brand.appName}'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Modify or copy the materials.</li>
                            <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website.</li>
                            <li>Remove any copyright or other proprietary notations from the materials.</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                        </ul>
                        <p>All resumes generated using the free tier are subject to our fair usage policy. Premium users have unlimited access as defined in their subscription plan.</p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Disclaimer</h2>
                        <p>
                            The materials on {brand.appName}'s website are provided on an 'as is' basis. {brand.appName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Limitations</h2>
                        <p>
                            In no event shall {brand.appName} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {brand.appName}'s website, even if {brand.appName} or an authorized representative has been notified orally or in writing of the possibility of such damage.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with standard international law and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
