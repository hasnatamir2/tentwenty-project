"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { HeroSlides } from "@/lib/data";

gsap.registerPlugin(useGSAP);

const SLICE_COUNT = 2;

export default function HeroSlider() {
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const nextTimeout = useRef<NodeJS.Timeout | null>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const controls = useAnimation();

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
            setIndex((prev) => (prev + 1) % HeroSlides.length);
        }, 6000);

        // Reset animation
        controls.set({
            width: 0,
            height: 0,
        });

        // Animate borders sequentially
        const run = async () => {
            await controls.start({
                width: "100%",
                transition: { duration: 1.5, ease: "linear" },
            });
            await controls.start({
                height: "100%",
                transition: { duration: 1.5, ease: "linear" },
            });
            await controls.start({
                width: "100%",
                transition: { duration: 1.5, ease: "linear" },
            });
            await controls.start({
                height: "100%",
                transition: { duration: 1.5, ease: "linear" },
            });
        };
        run();
        return () => {
            if (nextTimeout.current) clearInterval(nextTimeout.current);
        };
    }, [controls, index]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            const curr = HeroSlides[index];
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

    const currentSlide = HeroSlides[index];
    const prevSlide = prevIndex !== null ? HeroSlides[prevIndex] : null;

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
                <div className='text-white'>
                    <p className='text-sm md:text-base capitalize mb-2'>
                        Welcome To TenTwenty
                    </p>
                    <h1 className='text-[46px] md:text-6xl font-normal leading-tight font-sans'>
                        Tentwenty
                    </h1>
                </div>

                {/* Thumbnail indicators with circular timer */}
                <div className='absolute bottom-10 left-8 z-[6] flex items-center space-x-4'>
                    {HeroSlides.length > 1 && (
                        <button
                            onClick={() => {
                                if (nextTimeout.current)
                                    clearInterval(nextTimeout.current);
                                setPrevIndex(index);
                                setIndex((index + 1) % HeroSlides.length);
                            }}
                            className='group relative md:w-[138px] md:h-[138px] h-[115px] w-[115px] overflow-hidden'
                        >
                            {/* Next slide thumbnail */}

                            <Image
                                width={93}
                                height={93}
                                src={
                                    HeroSlides[(index + 1) % HeroSlides.length]
                                        .image
                                }
                                alt='Next slide'
                                className='md:w-[93px] md:h-[93px] w-[77.5px] h-[77.5px] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            />

                            <div className='absolute inset-0 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 cursor-pointer'>
                                <span className='text-white text-sm md:text-base'>
                                    Next
                                </span>
                            </div>

                            {/* Animated border timer */}
                            <div className='absolute inset-0'>
                                <motion.span
                                    className='absolute top-0 left-0 h-2 w-0 bg-white'
                                    key={`top-${index}`}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "linear",
                                    }}
                                />
                                <motion.span
                                    className='absolute top-0 right-0 w-2 h-0 bg-white'
                                    key={`right-${index}`}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "linear",
                                        delay: 1.5,
                                    }}
                                />
                                <motion.span
                                    className='absolute bottom-0 right-0 h-2 w-0 bg-white'
                                    key={`bottom-${index}`}
                                    animate={{ width: "100%" }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "linear",
                                        delay: 3,
                                    }}
                                />
                                <motion.span
                                    className='absolute bottom-0 left-0 w-2 h-0 bg-white'
                                    key={`left-${index}`}
                                    animate={{ height: "100%" }}
                                    transition={{
                                        duration: 1.5,
                                        ease: "linear",
                                        delay: 4.5,
                                    }}
                                />
                            </div>
                        </button>
                    )}
                    <div className='flex items-center text-white font-mono text-lg md:text-xl space-x-2'>
                        <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }} // enters from bottom
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }} // exits to top
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className='font-bold'
                        >
                            {String(index + 1).padStart(2, "0")}
                        </motion.div>

                        <span className='mx-2'>-----</span>

                        <span className='opacity-50'>
                            {String(HeroSlides.length).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
