"use client";

import { IMAGES } from '../config/images';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  title: string;
  description: string;
  imageSrc: keyof typeof IMAGES.products;
}

function ArticleCard({ title, description, imageSrc }: ArticleCardProps) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg transition-colors">
      <img
        src={IMAGES.products[imageSrc]}
        alt=""
        className="mb-2 w-full max-w-[80%] md:max-w-full h-auto object-contain rounded-lg"
      />
      <article className="text-center md:text-left w-full">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-zinc-400">{description}</p>
      </article>
    </div>
  );
}

interface XstpProps {}

export default function Xstp({}: XstpProps) {
  return (
    <div className="relative bg-black"> {/* REMOVED min-h-screen */}
      <main className="p-4 pb-10 flex items-center justify-center container max-w-screen-lg mx-auto">
        <div className="py-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ArticleCard
                title=""
                description=""
                imageSrc="xs1"
            />

            <ArticleCard
              title=""
              description=""
                imageSrc="xs3"
            />
          </div>

            <div className="mt-2 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-4">StartUpX native token</h2>
              <Link to="/presale" className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <span className="relative px-8 py-3 bg-black rounded-md text-white font-bold">
                LEARN MORE
                </span>
              </Link>
            </div>
        </div>
      </main>
    </div>
  );
}