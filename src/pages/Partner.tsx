import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Partner = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 px-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
            Exclusive Tokenization Platform
          </h1>
          <p className="text-gray-400 text-lg mb-12">
          For selected high-value projects, we partner with established companies and 
          approved ventures to create meaningful tokenization solutions.
          </p>
        </div>

        {/* Single Gear Animation */}
        <div className="flex justify-center items-center mb-20">
          <div className="animate-spin-slow w-40 h-40">
            <svg className="w-full h-full text-purple-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.5,11h-2.3c-0.2-0.8-0.5-1.6-0.9-2.3l1.6-1.6c0.4-0.4,0.4-1,0-1.4l-1.6-1.6c-0.4-0.4-1-0.4-1.4,0l-1.6,1.6 c-0.7-0.4-1.5-0.7-2.3-0.9V2.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v2.3c-0.8,0.2-1.6,0.5-2.3,0.9L6.1,4.1c-0.4-0.4-1-0.4-1.4,0 L3.1,5.7c-0.4,0.4-0.4,1,0,1.4l1.6,1.6C4.3,9.4,4,10.2,3.8,11H1.5c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h2.3 c0.2,0.8,0.5,1.6,0.9,2.3l-1.6,1.6c-0.4,0.4-0.4,1,0,1.4l1.6,1.6c0.4,0.4,1,0.4,1.4,0l1.6-1.6c0.7,0.4,1.5,0.7,2.3,0.9v2.3 c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-2.3c0.8-0.2,1.6-0.5,2.3-0.9l1.6,1.6c0.4,0.4,1,0.4,1.4,0l1.6-1.6c0.4-0.4,0.4-1,0-1.4 l-1.6-1.6c0.4-0.7,0.7-1.5,0.9-2.3h2.3c0.6,0,1-0.4,1-1v-2C23.5,11.4,23.1,11,22.5,11z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4 s4,1.8,4,4S14.2,16,12,16z"/>
            </svg>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Selective Process</h3>
            <p className="text-gray-400">Rigorous evaluation process to ensure only high-quality projects are accepted for tokenization.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-400">Advanced security infrastructure designed for institutional-grade tokenization.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Expert Support</h3>
            <p className="text-gray-400">Dedicated team of specialists to guide partners through the tokenization process.</p>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Tokenized Partners</h2>
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-xl backdrop-blur-sm border border-purple-500/20">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-purple-500 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5,11h-2.3c-0.2-0.8-0.5-1.6-0.9-2.3l1.6-1.6c0.4-0.4,0.4-1,0-1.4l-1.6-1.6c-0.4-0.4-1-0.4-1.4,0l-1.6,1.6 c-0.7-0.4-1.5-0.7-2.3-0.9V2.5c0-0.6-0.4-1-1-1h-2c-0.6,0-1,0.4-1,1v2.3c-0.8,0.2-1.6,0.5-2.3,0.9L6.1,4.1c-0.4-0.4-1-0.4-1.4,0 L3.1,5.7c-0.4,0.4-0.4,1,0,1.4l1.6,1.6C4.3,9.4,4,10.2,3.8,11H1.5c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1h2.3 c0.2,0.8,0.5,1.6,0.9,2.3l-1.6,1.6c-0.4,0.4-0.4,1,0,1.4l1.6,1.6c0.4,0.4,1,0.4,1.4,0l1.6-1.6c0.7,0.4,1.5,0.7,2.3,0.9v2.3 c0,0.6,0.4,1,1,1h2c0.6,0,1-0.4,1-1v-2.3c0.8-0.2,1.6-0.5,2.3-0.9l1.6,1.6c0.4,0.4,1,0.4,1.4,0l1.6-1.6c0.4-0.4,0.4-1,0-1.4 l-1.6-1.6c0.4-0.7,0.7-1.5,0.9-2.3h2.3c0.6,0,1-0.4,1-1v-2C23.5,11.4,23.1,11,22.5,11z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4 s4,1.8,4,4S14.2,16,12,16z"/>
              </svg>
            </div>
            <p className="text-center text-gray-300 text-lg">
              We are currently migrating our partners' information to our new platform. 
              All historical data about our tokenized partners will be available soon with 
              enhanced features and detailed information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-12 pb-8 mt-20">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-purple-500 transition-colors">Home</Link></li>
                <li><Link to="/tokenization" className="text-gray-400 hover:text-purple-500 transition-colors">Tokenization</Link></li>
                <li><Link to="/aix" className="text-gray-400 hover:text-purple-500 transition-colors">AI</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link to="/financial-core" className="text-gray-400 hover:text-purple-500 transition-colors">XPay Wallet</Link></li>
                <li><Link to="/financial-core" className="text-gray-400 hover:text-purple-500 transition-colors">Crypto Bank</Link></li>
                <li><Link to="/financial-core" className="text-gray-400 hover:text-purple-500 transition-colors">Mastercard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-purple-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-purple-500 transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-purple-500 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://x.com/XSTP_StartUpX" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://t.me/XSTPToken" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">© 2025 Startupx Technology LLC. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Partner; 