import { useState } from 'react';
import { Link } from 'react-router-dom';
import thumbnailPt from '../assets/video-thumbnail-pt.jpg';
import thumbnailEn from '../assets/video-thumbnail-en.jpg';

const Tokenization = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'pt' | 'en' | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Substitua estes IDs pelos IDs reais dos seus vídeos no YouTube
  const videoIds = {
    pt: 'mPoGXEGvzb0',
    en: '-iWd-iaElDE'
  };

  const handleVideoSelect = (language: 'pt' | 'en') => {
    setSelectedLanguage(language);
  };

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <div className="min-h-screen bg-black pt-20 px-4 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
            Tokenization
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Transform real assets into digital tokens, increasing liquidity and accessibility through blockchain technology.
          </p>
        </div>

        {/* Video Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 backdrop-blur-sm border border-purple-500/20 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">Understanding Tokenization</h2>
            <p className="text-gray-400 text-sm md:text-base">
              Watch our explanatory video and discover how tokenization is revolutionizing the financial market, 
              creating new investment opportunities and democratizing access to exclusive assets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => handleVideoSelect('pt')}
              className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 ${selectedLanguage === 'pt' ? 'ring-2 ring-purple-400' : ''}`}
            >
              <span>Português</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
              </svg>
            </button>
            
            <button 
              onClick={() => handleVideoSelect('en')}
              className={`w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 ${selectedLanguage === 'en' ? 'ring-2 ring-purple-400' : ''}`}
            >
              <span>English</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {selectedLanguage && (
            <div className="relative aspect-video mt-8 transform transition-all duration-500 ease-in-out">
              <img
                src={selectedLanguage === 'pt' ? thumbnailPt : thumbnailEn}
                alt="Video Thumbnail"
                className="w-full h-full object-cover rounded-xl"
              />
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                onClick={handlePlayVideo}
              >
                <div className="bg-purple-500 hover:bg-pink-500 rounded-full w-16 h-16 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-32">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Security</h3>
            <p className="text-gray-400 text-sm">Advanced blockchain and cryptography ensuring the security of your assets.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Liquidity</h3>
            <p className="text-gray-400 text-sm">Tokenization enables 24/7 fractional trading of your assets.</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-1">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Efficiency</h3>
            <p className="text-gray-400 text-sm">Automated processes reducing operational costs and time.</p>
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
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
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

      {/* Video Modal */}
      {showVideo && selectedLanguage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-white hover:text-purple-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${videoIds[selectedLanguage]}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tokenization; 