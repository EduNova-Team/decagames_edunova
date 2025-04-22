"use client";

import { useState } from "react";

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <footer className="border-t border-[var(--card-border)] py-4 text-sm text-[var(--foreground)] opacity-70">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p>© 2024 DECA Games. All rights reserved.</p>
            </div>
            <div className="mt-2 md:mt-0">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-[var(--accent)] transition-colors hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--card-bg)] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--card-border)] p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-[var(--foreground)] hover:text-[var(--accent)] p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 policy-content">
              <h3 className="text-lg font-semibold mb-2">
                Effective Date: April 22, 2025
              </h3>

              <p className="mb-4">
                Welcome to DECA Games (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;). Your privacy is important to us. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform to transform DECA
                practice tests into interactive learning games.
              </p>

              <p className="mb-4">
                By using DECA Games, you agree to the terms of this policy.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                1. Information We Collect
              </h4>

              <p className="mb-2">
                <strong>a. Uploaded Files</strong>
              </p>
              <p className="mb-4">
                When you upload DECA practice test PDFs, we process them using
                AI to extract questions, answers, and explanations. The contents
                of these files are only used to generate your interactive games.
              </p>

              <p className="mb-2">
                <strong>b. User Account Information</strong>
              </p>
              <p className="mb-4">
                If you create an account, we may collect your name, email
                address, and login credentials to manage your games and provide
                platform access.
              </p>

              <p className="mb-2">
                <strong>c. Usage Data</strong>
              </p>
              <p className="mb-4">
                We collect anonymized information about how you use our platform
                (e.g., game creation, page views) to improve functionality and
                user experience.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                2. How We Use Your Information
              </h4>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Process DECA test PDFs into interactive games</li>
                <li>Save and manage your personalized game library</li>
                <li>Improve the platform through usage analytics</li>
                <li>Provide support and communicate platform updates</li>
              </ul>

              <p className="mb-4">
                We do not use uploaded DECA PDFs or extracted content for
                commercial resale, advertising, or sharing without your
                permission.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                3. Data Sharing and Storage
              </h4>
              <p className="mb-4">
                We do not sell, rent, or trade your personal information. Your
                uploaded files and game data are stored securely and are only
                accessible to your account.
              </p>
              <p className="mb-4">
                We may share anonymized usage data with analytics providers to
                understand platform trends.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                4. Data Retention
              </h4>
              <p className="mb-4">
                We retain your uploaded files and games until you choose to
                delete them or your account. You may request data deletion at
                any time by contacting us at{" "}
                <a
                  href="mailto:support@decagames.app"
                  className="text-[var(--accent)] hover:underline"
                >
                  support@decagames.app
                </a>
                .
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">5. Security</h4>
              <p className="mb-4">
                We implement reasonable administrative, technical, and physical
                safeguards to protect your information. However, no online
                system is 100% secure, and we cannot guarantee absolute
                security.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                6. Your Rights
              </h4>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Access the data we store about you</li>
                <li>Request corrections or deletions</li>
                <li>Withdraw consent or delete your account at any time</li>
              </ul>
              <p className="mb-4">
                Contact us at{" "}
                <a
                  href="mailto:team@edunovagames.com"
                  className="text-[var(--accent)] hover:underline"
                >
                  team@edunovagames.com
                </a>{" "}
                for assistance.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">
                7. Changes to This Policy
              </h4>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. Changes
                will be posted here with a new effective date.
              </p>

              <h4 className="text-lg font-semibold mt-6 mb-2">8. Contact Us</h4>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, reach out
                to us at:
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:team@edunovagames.com"
                  className="text-[var(--accent)] hover:underline"
                >
                  team@edunovagames.com
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://www.decagames.org"
                  className="text-[var(--accent)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.decagames.org
                </a>
              </p>
            </div>

            <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-[var(--card-border)] p-4 text-center">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
