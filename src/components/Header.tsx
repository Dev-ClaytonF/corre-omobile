"use client";

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';
import { useActiveAccount } from 'thirdweb/react';
import { useSuperUser } from '../contexts/SuperUserContext';
import { IMAGES } from '../config/images';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeAccount = useActiveAccount();
  const { isSuperUser } = useSuperUser();

  useEffect(() => {
    if (!activeAccount) {
      // Dispara um evento customizado quando a wallet é desconectada
      const event = new CustomEvent('walletDisconnected');
      window.dispatchEvent(event);
    }
  }, [activeAccount]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderWalletLinks = () => {
    if (!activeAccount) return null;
    
    return (
      <>
        <Link to="/my-referrals" className="text-xs font-semibold text-white">My Referrals</Link>
        <Link to="/my-purchases" className="text-xs font-semibold text-white">My Purchases</Link>
        {isSuperUser && (
          <Link to="/core" className="text-xs text-purple-400 font-semibold">
            Core
          </Link>
        )}
      </>
    );
  };

  const renderMobileWalletLinks = () => {
    if (!activeAccount) return null;
    
    return (
      <>
        <Link to="/my-referrals" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">My Referrals</Link>
        <Link to="/my-purchases" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">My Purchases</Link>
        {isSuperUser && (
          <Link to="/core" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">
            Core
          </Link>
        )}
      </>
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black">
        <nav className="flex items-center justify-between p-2 lg:px-3" aria-label="Global">
          <div className="flex lg:w-32">
            <Link to="/" className="-m-1 p-1">
              <span className="sr-only">Your Company</span>
              <img className="h-6 w-auto" src={IMAGES.logo} alt="Startupx Logo" />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button type="button" className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-white" onClick={toggleMenu}>
              <span className="sr-only">Open main menu</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8 lg:justify-center flex-1">
            <Link to="/" className="text-xs font-semibold text-white">Home</Link>
            <Link to="/tokenization" className="text-xs font-semibold text-white">Tokenization</Link>
            <Link to="/aix" className="text-xs font-semibold text-white">AI</Link>
            <Link to="/financial-core" className="text-xs font-semibold text-white">Financial Core</Link>
            <Link to="/partner" className="text-xs font-semibold text-white">Launchpad</Link>
            <Link to="/tradingview" className="text-xs font-semibold text-white">Tradingview</Link>
            <Link to="/presale" className="text-xs font-semibold text-white">Presale XSTP</Link>
            {renderWalletLinks()}
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <ConnectWalletButton variant="header" />
          </div>
        </nav>
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" onClick={closeMenu}></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1 p-1">
                <span className="sr-only">Your Company</span>
                <img className="h-6 w-auto" src={IMAGES.logo} alt="Startupx Logo" />
              </Link>
              <button type="button" className="-m-2 rounded-md p-2 text-white" onClick={closeMenu}>
                <span className="sr-only">Close menu</span>
                <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link to="/" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Home</Link>
                  <Link to="/tokenization" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Tokenization</Link>
                  <Link to="/aix" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">AI</Link>
                  <Link to="/financial-core" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Financial Core</Link>
                  <Link to="/partner" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Launchpad</Link>
                  <Link to="/tradingview" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Tradingview</Link>
                  <Link to="/presale" onClick={closeMenu} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white">Presale XSTP</Link>
                  {renderMobileWalletLinks()}
                  <ConnectWalletButton variant="default" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;