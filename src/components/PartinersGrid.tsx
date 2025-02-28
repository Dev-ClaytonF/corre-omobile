"use client";

import React, { useRef, useEffect, useState } from 'react';
import { IMAGES } from '../config/images';

interface PartnersGridProps {
    images: (keyof typeof IMAGES.partners)[];
    animationSpeed?: number;
}

const PartnersGrid: React.FC<PartnersGridProps> = ({ images, animationSpeed = 1 }) => {
    const [duplicatedImages] = useState([...images, ...images]); // Duplica os itens
    const carouselRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carousel = carouselRef.current;
        const container = containerRef.current;
        if (!carousel || !container) return;

        let position = 0;
        let animationFrameId: number;

        const resetPosition = () => {
            if (position <= -carousel.offsetWidth / 2) {
                position = 0;
                carousel.style.transform = `translateX(0)`;
            }
        };

        const animate = () => {
            position -= animationSpeed;
            carousel.style.transform = `translateX(${position}px)`;
            resetPosition();
            animationFrameId = requestAnimationFrame(animate);
        };

        // Inicia a animação
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [animationSpeed]);

    return (
        <div 
            ref={containerRef}
            className="w-11/12 sm:w-10/12 lg:w-9/10 h-20 border border-zinc-800 rounded-lg bg-transparent overflow-hidden flex items-center pointer-events-none"
        >
            <div 
                ref={carouselRef}
                className="flex flex-nowrap"
                style={{ 
                    whiteSpace: 'nowrap',
                    willChange: 'transform'
                }}
            >
                {duplicatedImages.map((image, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-32 h-20 mr-8 flex items-center justify-center"
                    >
                        <img 
                            src={IMAGES.partners[image]} 
                            alt={`Partner ${index + 1}`} 
                            className="max-h-full max-w-full"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartnersGrid;