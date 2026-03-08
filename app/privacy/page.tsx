import Link from "next/link";
import brand from "@/config/brand";

export default function PrivacyPage() {
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
                    Privacy Policy
                </h1>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
                        <p>
                            When you use {brand.appName}, we collect information that you voluntarily provide to us when registering for an account, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.
                        </p>
                        <p>
                            The personal information that we collect depends on the context of your interactions with us and the App, the choices you make, and the products and features you use. The personal information we collect can include the following:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Names and Contact Data (Email addresses).</li>
                            <li>Credentials (Passwords and security information used for authentication).</li>
                            <li>Resume Data (Work experience, education, skills, and personal information you input into your resumes).</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
                        <p>We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>To facilitate account creation and logon process.</li>
                            <li>To provide the resume building services requested by you.</li>
                            <li>To send administrative information to you.</li>
                            <li>To improve user experience and app functionality.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Will Your Information Be Shared With Anyone?</h2>
                        <p>We only share and disclose your information in the following situations:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                            <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities.</li>
                            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. How Long Do We Keep Your Information?</h2>
                        <p>
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Contact Us</h2>
                        <p>If you have questions or comments about this policy, you may email us at {brand.supportEmail}.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
