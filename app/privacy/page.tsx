export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>CHAOS ("we" or "us" or "our") operates the app.chaosmind.dev website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Types of Data Collected:</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Personal Data:</strong> Email address, name, workspace information</li>
              <li><strong>Usage Data:</strong> Browser type, pages visited, time spent, IP address</li>
              <li><strong>Memory Data:</strong> Content you create and store in your workspace</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Security</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies</h2>
            <p>We use httpOnly cookies to maintain your session and authenticate your account. These cookies cannot be accessed by JavaScript and are secure against XSS attacks. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <p>We will retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your personal data to the extent necessary to comply with our legal obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Workspace Data Isolation</h2>
            <p>All data you create in your workspace is stored in an isolated database that is separate from other users. We maintain strict data isolation between workspaces to ensure your data privacy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
            <p>Our Service may contain links to other websites that are not operated by us. This Privacy Policy applies only to our website. We have no control over third-party websites and are not responsible for their privacy practices.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at support@chaosmind.dev</p>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: February 4, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
