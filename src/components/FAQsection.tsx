"use client";

import { Link } from 'react-router-dom';

const FAQSection = () => {
  const faqsData = [
    {
      title: 'What is StartUpX?',
      content:
        'StartUpX is an innovative platform that connects global investors to promising startups, utilizing blockchain technology to facilitate the tokenization of real-world assets. Our ecosystem offers tools to tokenize, invest in, and manage assets such as startups, real estate, and other valuable commodities, ensuring transparency and efficiency in all processes.',
    },
    {
      title: 'How can I start investing with Startupx?',
      content: (
        <>
          To start investing with Startupx, visit https://startupxtechain.com/presale
          <br />
        </>
      ),
    },
    {
      title: 'What is XSTP Token?',
      content: (
        <>
          XSTP is the official token of StartUpX, the core of the ecosystem, promoting financial inclusion, innovation, and valuable rewards.
          <br />
        </>
      ),
    },
    {
      title: 'How will I receive XSTP Tokens?',
      content: (
        <>
          XSTP tokens are transferred to your wallet in real-time upon purchase. To view the number of tokens in your wallet, add XSTP as a custom token in your wallet.
        </>
      ),
    },
    {
      title: 'How can I contact Startupx team?',
      content: (
        <>
          You can contact us via contact@startupxchain.com or through our social media channels: Twitter, Telegram, Instagram.
        </>
      ),
    },
    {
      title: 'Where can I sell my XSTP tokens?',
      content: (
        <>
         As we are currently in pre-sale, you cannot sell or transfer your tokens. Once XSTP is launched, users will be able to trade it freely. Stay connected with our community and stay informed about updates.
        </>
      ),
    },
  ];

  return (
    <>
      <div className="bg-[#000]">
        <section className="dark:bg-black">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-white">
              Frequently asked questions
            </h2>
            <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 border-gray-700 md:grid-cols-2">
              <div>
                {faqsData.slice(0, 4).map((faq, index) => (
                  <div key={index} className="mb-10">
                    <h3 className="flex items-center mb-4 text-lg font-medium text-white">
                      {faq.title}
                    </h3>
                    <p className="text-gray-400">
                      {faq.content}
                    </p>
                  </div>
                ))}
              </div>
              <div>
                {faqsData.slice(4).map((faq, index) => (
                  <div key={index} className="mb-10">
                    <h3 className="flex items-center mb-4 text-lg font-medium text-white">
                      {faq.title}
                    </h3>
                    <p className="text-gray-400">
                      {faq.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-black rounded-lg m-4 border-t border-gray-700">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-400 sm:text-center">© 2025 <a href="https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResultDetail?inquirytype=EntityName&directionType=Initial&searchNameOrder=STARTUPXTECHNOLOGY%20L250000795110&aggregateId=flal-l25000079511-a8ffddde-5677-494c-b4f0-75442f973712&searchTerm=StartupX%20Technology&listNameOrder=STARTUPXTECHNOLOGY%20L250000795110">Startupx Technology LLC ™</a> All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
              <li>
                <a href="#" className="me-4 md:me-6">Whitepaper</a>
              </li>
              <li>
                <a href="#" className="me-4 md:me-6">How To Buy</a>
              </li>
              <li>
                <Link to="/contact" className="me-4 md:me-6">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="me-4 md:me-6">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="me-4 md:me-6">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/cookies-policy">Cookies</Link>
              </li>
            </ul>
          </div>
        </footer>
          {/* Linha cinza extra (remove se não for desejada) */}
          <div className="border-b border-gray-700 w-full"></div>
      </div>
    </>
  );
};

export default FAQSection;