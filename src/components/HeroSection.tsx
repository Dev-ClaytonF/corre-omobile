// HeroSection.tsx
"use client";

import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="bg-black">
           <div className="bg-black pt-[40px] pb-24 sm:pb-32">
             <div className="mx-auto max-w-7xl px-6 lg:px-8">
               <div className="mx-auto max-w-2xl lg:text-center">
                  <h2 className="text-base/7 font-semibold text-white"></h2>
                  <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">Tokenize real world assets. No borders, no limits.</p>
                  <p className="mt-6 text-lg/8 text-white leading-tight">We tokenize real-world assets, break down barriers, democratize access to investment, and are creating a future where anything is possible.</p>
                  
                  <p className="mt-5 text-lg font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    Startupx native token
                  </p>

                  <div className="mt-5 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 justify-center">
                    <Link to="/presale">
                      <button
                        className="relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-md group bg-gradient-to-br from-purple-500 to-pink-500"
                        style={{ width: '200px', height: '45px', display: 'flex' }}
                      >
                        <span 
                          className="relative px-3 py-2 rounded-md bg-black text-white text-base"
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'  }}
                        >
                          Join Presale XSTP
                        </span>
                      </button>
                    </Link>
                    <Link to="/whitepaper">
                      <button
                        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-md group border border-purple-500"
                        style={{ width: '200px', height: '45px', display: 'flex' }}
                      >
                        <span 
                          className="relative px-3 py-2 rounded-md bg-black text-white text-base"
                          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Whitepaper
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
             </div>
           </div>
        </div>
    );
};

export default HeroSection;