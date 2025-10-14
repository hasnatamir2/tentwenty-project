"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

const slides = [
    {
        image: "/images/image1.png",
        heading: "From Our Farms",
        subheading: "To Your Hands",
    },
    {
        image: "/images/image5.png",
        heading: "Sustainably Grown",
        subheading: "With Care and Passion",
    },
    {
        image: "/images/image4.png",
        heading: "Fresh. Local. Natural.",
        subheading: "Quality You Can Taste",
    },
];

const SLICE_COUNT = 2;

export default function HeroSlider() {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nextTimeout = useRef<NodeJS.Timeout | null>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    function preloadImage(src: string) {
        return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = src;
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // resolve even on error to avoid blocking
        });
    }

    // Handle autoplay
    useEffect(() => {
        nextTimeout.current = setInterval(() => {
            setPrevIndex(index);
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => {
            if (nextTimeout.current) clearInterval(nextTimeout.current);
        };
    }, [index]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            const curr = slides[index];
            const el = containerRef.current;
            if (!el) return;

            // preload incoming image
            await preloadImage(curr.image);
            if (cancelled) return;

            // select elements
            const prevEl = el.querySelector<HTMLElement>(".prev-slide");
            const slices = el.querySelectorAll<HTMLElement>(".slice");

            // kill prior timeline
            if (tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }

            // ensure initial styles so nothing flashes
            gsap.set(slices, {
                height: 0,
                top: "50%",
                opacity: 1,
                overflow: "hidden",
                willChange: "top, height, opacity",
            });

            // ensure slice-bg fills area and doesn't scale
            el.querySelectorAll<HTMLElement>(".slice-bg").forEach((bgEl) => {
                gsap.set(bgEl, {
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    backgroundSize: `100% ${SLICE_COUNT * 100}%`,
                    backgroundRepeat: "no-repeat",
                    willChange: "transform",
                });
            });

            // build timeline: reveal slices from center, then fade prev slide slightly after reveal starts
            const tl = gsap.timeline();

            // reveal top and bottom simultaneously (tiny stagger)
            tl.to(
                slices[0],
                {
                    height: "50%",
                    top: "0%",
                    duration: 0.95,
                    ease: "power4.inOut",
                },
                0
            );
            tl.to(
                slices[1],
                {
                    height: "50%",
                    top: "50%",
                    duration: 0.95,
                    ease: "power4.inOut",
                },
                0.05
            );

            // start fading prev after reveal has started — overlap to avoid any gap
            if (prevEl) {
                tl.to(
                    prevEl,
                    { opacity: 0, duration: 0.7, ease: "power2.out" },
                    0.25
                );
            }

            // small settle
            tl.to([slices[0], slices[1]], { opacity: 1, duration: 0.12 }, 0.95);

            tlRef.current = tl;
        }

        run();

        return () => {
            cancelled = true;
            if (tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }
        };
        // run whenever index changes
    }, [index, prevIndex]);

    const currentSlide = slides[index];
    const prevSlide = prevIndex !== null ? slides[prevIndex] : null;

    return (
        <div
            ref={containerRef}
            className='relative w-full h-screen overflow-hidden bg-black'
        >
            {/* previous slide (keeps visible until new reveal covers) */}
            {prevSlide && (
                <div
                    className='prev-slide absolute inset-0 z-[1] bg-center bg-cover'
                    style={{
                        backgroundImage: `url(${prevSlide.image})`,
                        willChange: "opacity, transform",
                    }}
                />
            )}

            {/* slices for incoming image */}
            <div className='absolute inset-0 z-[2] pointer-events-none'>
                {/* top slice */}
                <div
                    className='slice slice-top absolute left-0 w-full overflow-hidden'
                    style={{
                        height: 0,
                        top: "50%",
                        zIndex: 2,
                    }}
                >
                    <div
                        className='slice-bg'
                        style={{
                            backgroundImage: `url(${currentSlide.image})`,
                            backgroundPosition: "center 0%",
                        }}
                    />
                </div>

                {/* bottom slice */}
                <div
                    className='slice slice-bottom absolute left-0 w-full overflow-hidden'
                    style={{
                        height: 0,
                        top: "50%",
                        zIndex: 2,
                    }}
                >
                    <div
                        className='slice-bg'
                        style={{
                            backgroundImage: `url(${currentSlide.image})`,
                            backgroundPosition: "center 100%",
                        }}
                    />
                </div>
            </div>

            {/* overlay */}
            <div className='absolute inset-0 z-[3] bg-black/30' />

            {/* text content */}
            <div className='relative z-[5] flex flex-col items-start justify-center h-full px-8 md:px-16'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentSlide.heading}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.85, ease: "easeOut" }}
                        className='text-white max-w-3xl'
                    >
                        <p className='text-sm md:text-lg uppercase tracking-wider mb-2 font-light'>
                            Welcome To TenTwenty Farms
                        </p>
                        <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold leading-tight font-sans'>
                            {currentSlide.heading}
                            <br />
                            {currentSlide.subheading}
                        </h1>
                    </motion.div>
                </AnimatePresence>

                {/* Thumbnail indicators with circular timer */}
                <div className='absolute bottom-10 left-8 z-[6]'>
                    {slides.length > 1 && (
                        <button
                            onClick={() => {
                                if (nextTimeout.current)
                                    clearInterval(nextTimeout.current);
                                setPrevIndex(index);
                                setIndex((index + 1) % slides.length);
                            }}
                            className='group relative w-[138px] h-[138px] overflow-hidden hover:scale-105 transition-transform duration-300'
                        >
                            {/* Next slide thumbnail */}
                            
                                <Image
                                    width={93}
                                    height={93}
                                    src={
                                        slides[(index + 1) % slides.length]
                                            .image
                                    }
                                    alt='Next slide'
                                    className='w-[93px] h-[93px] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                                />

                            {/* Animated border timer */}
                            <div className='absolute inset-0'>
                                <span className='absolute top-0 left-0 w-0 h-2 bg-white animate-border-timer'></span>
                                <span className='absolute top-0 right-0 w-2 h-0 bg-white animate-border-timer-delay'></span>
                                <span className='absolute bottom-0 right-0 w-0 h-2 bg-white animate-border-timer-delay2'></span>
                                <span className='absolute bottom-0 left-0 w-2 h-0 bg-white animate-border-timer-delay3'></span>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
