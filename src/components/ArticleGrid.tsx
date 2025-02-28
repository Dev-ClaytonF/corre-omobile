// components/ArticleGrid.tsx
"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { IMAGES } from '../config/images';

interface ArticleCardProps {
  title: string;
  href: string;
  description: string;
  image: keyof typeof IMAGES.articles;
  isInternalLink?: boolean;
}

function ArticleCard({ title, href, description, image, isInternalLink }: ArticleCardProps) {
  return isInternalLink ? (
    <Link
      to={href}
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2 text-center text-white">{title}</h2>
        <img src={IMAGES.articles[image]} alt={title} className="mx-auto mb-2" style={{ width: '200px' }} />
        <p className="text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: description }}></p>
      </article>
    </Link>
  ) : (
    <a
      href={href + "?utm_source=next-template"}
      target="_blank"
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2 text-center text-white">{title}</h2>
        <img src={IMAGES.articles[image]} alt={title} className="mx-auto mb-2" style={{ width: '200px' }} />
        <p className="text-sm text-zinc-400" dangerouslySetInnerHTML={{ __html: description }}></p>
      </article>
    </a>
  );
}

const ArticleGrid: React.FC = () => {
  const articles: ArticleCardProps[] = [
    {
      title: "Tokenization",
      href: "/tokenization",
      description: `Tokenize real world assets. No borders, no limits... <span style="background: linear-gradient(to right, purple, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">Click to learn more</span>`,
      image: "a1",
      isInternalLink: true
    },
    {
      title: "AI NEO",
      href: "/aix",
      description: `This AI assistant is here to fuel your creativity and productivity... <span style="background: linear-gradient(to right, purple, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">Click to learn more</span>`,
      image: "a2",
      isInternalLink: true
    },
    {
      title: "Financial Core",
      href: "/financial-core",
      description: `Decentralized financial freedom, global reach... <span style="background: linear-gradient(to right, purple, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">Click to learn more</span>`,
      image: "a3",
      isInternalLink: true
    },
    {
      title: "Trade Munehisa AI",
      href: "/aix",
      description: `The Ideal Platform for Crypto Traders...<span style="background: linear-gradient(to right, purple, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">Click to learn more</span>`,
      image: "a4",
      isInternalLink: true
    }
  ];
  return (
    <div className="py-20">
         <h2 className="text-3xl font-bold mb-8 text-center text-white">Our products</h2>
      <div className="grid gap-4 lg:grid-cols-4 justify-center">
        {articles.map((article, index) => (
          <ArticleCard key={index} {...article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;