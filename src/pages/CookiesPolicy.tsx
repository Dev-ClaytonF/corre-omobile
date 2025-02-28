const CookiesPolicy = () => {
  return (
    <div className="bg-black min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">Cookies Policy</h1>
        
        <div className="text-right italic text-gray-400 mb-8">
          Last Updated: Feb/2025
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">What are Cookies?</h2>
          <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide a better browsing experience, understand how you interact with our content, and offer more personalized services.</p>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Why Do We Use Cookies?</h2>
          <p className="mb-4">We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Keep you logged in during your session</li>
            <li>Remember your preferences and settings</li>
            <li>Enhance platform security</li>
            <li>Analyze how our website is used</li>
            <li>Personalize your platform experience</li>
          </ul>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Types of Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr>
                  <th className="bg-zinc-800 text-indigo-400 p-3 text-left border border-gray-700">Type</th>
                  <th className="bg-zinc-800 text-indigo-400 p-3 text-left border border-gray-700">Purpose</th>
                  <th className="bg-zinc-800 text-indigo-400 p-3 text-left border border-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-700">Essential</td>
                  <td className="p-3 border border-gray-700">Required for basic website functionality</td>
                  <td className="p-3 border border-gray-700">Session</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-700">Functional</td>
                  <td className="p-3 border border-gray-700">Improve usability and remember preferences</td>
                  <td className="p-3 border border-gray-700">1 year</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-700">Analytics</td>
                  <td className="p-3 border border-gray-700">Help us understand how you use the site</td>
                  <td className="p-3 border border-gray-700">2 years</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-700">Marketing</td>
                  <td className="p-3 border border-gray-700">Used to personalize advertisements</td>
                  <td className="p-3 border border-gray-700">30 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Essential Cookies</h2>
          <p className="mb-4">These are fundamental cookies for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account authentication and security</li>
            <li>Trading platform functionality</li>
            <li>Transaction processing</li>
            <li>Fraud protection</li>
          </ul>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Cookie Control</h2>
          <p className="mb-4">You can control and/or delete cookies as you wish. You can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Accept or reject cookies through the consent banner</li>
            <li>Configure your browser to block cookies</li>
            <li>Delete existing cookies through browser settings</li>
            <li>Opt out of tracking cookies</li>
          </ul>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Impact of Disabling Cookies</h2>
          <p className="mb-4">Disabling cookies may:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Affect the functionality of certain areas of the site</li>
            <li>Prevent the use of some of our services</li>
            <li>Result in a less personalized experience</li>
            <li>Require more frequent login to the platform</li>
          </ul>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Policy Updates</h2>
          <p className="mb-4">We may periodically update this policy to reflect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Changes in our practices</li>
            <li>New features and functionalities</li>
            <li>Regulatory changes</li>
            <li>User feedback</li>
          </ul>
        </div>

        <div className="bg-zinc-900/30 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-700 text-indigo-400">Contact</h2>
          <p className="mb-4">For questions about our cookies policy, contact us at:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: contact@startupxchain.com</li>
            <li>Florida - USA</li>
          </ul>
        </div>

        <div className="text-center border-t border-gray-700 pt-8 mt-12 text-gray-400">
          <p className="mb-2">© 2025 StartupX - All rights reserved</p>
          <p>This cookies policy is an integral part of our Terms of Use</p>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy; 