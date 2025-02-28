import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../config/images';
import ImageModal from '../components/ImageModal';

const FinancialCore = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedImage, setSelectedImage] = useState<{src: string; alt: string} | null>(null);

  return (
    <div className="min-h-screen bg-black pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Financial Core</h1>
        
        {/* XPay Wallet Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-6">XPay Wallet</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Experience the future of digital payments with XPay Wallet. Our cutting-edge wallet solution 
              allows you to seamlessly manage your cryptocurrencies and make instant transactions globally. 
              With advanced security features and an intuitive interface, XPay Wallet is your gateway to 
              the decentralized financial world.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Coming Soon
              </button>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative group cursor-pointer"
                 onClick={() => setSelectedImage({ src: IMAGES.wallet, alt: 'XPay Wallet' })}>
              <img 
                src={IMAGES.wallet}
                alt="XPay Wallet" 
                className="max-w-[585px] w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Bank Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div className="flex justify-center">
            <div className="relative group cursor-pointer"
                 onClick={() => setSelectedImage({ src: IMAGES.bank, alt: 'Crypto Bank' })}>
              <img 
                src={IMAGES.bank}
                alt="Crypto Bank" 
                className="max-w-[585px] w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Crypto Bank</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Welcome to the future of banking with our Crypto Bank solution. Our revolutionary platform 
              bridges the gap between traditional finance and cryptocurrency, offering a Mastercard-enabled 
              card that lets you spend your crypto assets anywhere Mastercard is accepted worldwide. 
              Enjoy the flexibility of using your cryptocurrencies for everyday purchases while maintaining 
              complete control over your digital assets.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Global Acceptance</h3>
              <p className="text-gray-300">Use your crypto assets anywhere Mastercard is accepted worldwide, ensuring maximum flexibility for your digital currency.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Instant Transactions</h3>
              <p className="text-gray-300">Experience lightning-fast transactions with minimal fees, making your crypto payments efficient and cost-effective.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Asset Control</h3>
              <p className="text-gray-300">Maintain complete control over your digital assets with our advanced security features and intuitive management tools.</p>
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
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">XPay Wallet</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">Crypto Bank</a></li>

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

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage?.src || ''}
          imageAlt={selectedImage?.alt || ''}
        />
      </div>
    </div>
  );
};

export default FinancialCore; 