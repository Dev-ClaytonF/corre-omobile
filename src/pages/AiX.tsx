import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import LoadingTransition from '../components/LoadingTransition';

const InfinityAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="relative w-full h-full">
        <div className="infinity-path">
          <div className="glowing-orb"></div>
        </div>
      </div>
    </div>
  );
};

const AiX = () => {
  const navigate = useNavigate();
  const [activeNeo, setActiveNeo] = useState(false);
  const [activeMunehisa, setActiveMunehisa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAiNeoClick = () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    navigate('/ai-neo');
  };

  return (
    <>
      {isLoading && <LoadingTransition onComplete={handleLoadingComplete} />}
      <div className="min-h-screen bg-black pt-20 px-4 relative overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <InfinityAnimation />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-6">
              AI Solutions
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Advanced artificial intelligence tools designed to enhance your financial and analytical capabilities
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-32">
            {/* AI NEO Card */}
            <div className="relative w-full md:w-[450px] group">
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl transition-all duration-500 group-hover:blur-3xl ${
                  activeNeo ? 'blur-3xl' : 'blur-xl'
                }`} 
              />
              
              <div 
                className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 backdrop-blur-sm p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setActiveNeo(true)}
                onMouseLeave={() => setActiveNeo(false)}
                onClick={handleAiNeoClick}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                    AI NEO
                  </h2>
                  <p className="text-gray-400 text-base mb-8">
                    Artificial intelligence to assist in research, analysis, content creation, and complex problem-solving
                  </p>
                  <span className="px-4 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium">BETA VERSION</span>
                </div>
              </div>
            </div>

            {/* AI Munehisa Card */}
            <div className="relative w-full md:w-[450px] group">
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl transition-all duration-500 group-hover:blur-3xl ${
                  activeMunehisa ? 'blur-3xl' : 'blur-xl'
                }`} 
              />
              
              <div 
                className="relative bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-xl border border-pink-500/20 backdrop-blur-sm p-8 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setActiveMunehisa(true)}
                onMouseLeave={() => setActiveMunehisa(false)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
                    AI Munehisa
                  </h2>
                  <p className="text-gray-400 text-base mb-8">
                    Specialized artificial intelligence for market analysis, identifying patterns and investment opportunities
                  </p>
                  <span className="px-4 py-1 bg-pink-500/20 rounded-full text-pink-400 text-sm font-medium">BETA VERSION</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-800 pt-12 pb-8">
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
    </>
  );
};

export default AiX; 