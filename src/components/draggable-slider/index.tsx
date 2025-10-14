"use client";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, MouseEvent } from "react";
import FollowCursor from "./follow-cursor";
import useMediaQuery from "@/hooks/use-media-query";

const testimonials = [
    {
        quote: "Started in 2017",
        name: "Flora Delight",
        title: "Theres always something happening at Flower Exchange!",
        image: "/images/image1.png",
    },
    {
        quote: "Started in 2018",
        name: "Urban Bloom",
        title: "The citys finest floral arrangements.",
        image: "/images/image2.png",
    },
    {
        quote: "Started in 2019",
        name: "Petal Pushers",
        title: "Creating beautiful moments with every bouquet.",
        image: "/images/image3.png",
    },
    {
        quote: "Started in 2020",
        name: "The Orchidaceae",
        title: "Exotic flowers for every occasion.",
        image: "/images/image4.png",
    },
    {
        quote: "Started in 2021",
        name: "The Rose Garden",
        title: "A curated collection of the worlds most beautiful roses.",
        image: "/images/image5.png",
    },
];

const DraggableSlider = () => {
    const [position, setPosition] = useState(0);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const cardWidth = isMobile ? 233 : 435;
    const cardHeight = isMobile ? 330 : 620;
    const translateX = isMobile ? 280 : 650;

    const next = () => {
        setPosition(position === testimonials.length - 1 ? 0 : position + 1);
    };

    const prev = () => {
        setPosition(position === 0 ? testimonials.length - 1 : position - 1);
    };

    const onDragEnd = (_: unknown, info: PanInfo) => {
        const swipePower = Math.abs(info.offset.x);
        if (swipePower > 100) {
            if (info.offset.x > 0) {
                prev();
            } else {
                next();
            }
        }
    };

    const handleMouseMove = (
        e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
    ) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const textContainerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
            },
        },
    };

    return (
        <div
            className='flex flex-col items-center justify-center h-screen overflow-hidden md:mb-28'
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {isHovering && !isMobile && (
                <FollowCursor x={cursorPosition.x} y={cursorPosition.y} />
            )}
            <div
                className='relative w-full'
                style={{ height: isMobile ? "400px" : "670px" }}
            >
                <motion.div
                    className='flex items-center justify-center h-full'
                    drag='x'
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={onDragEnd}
                >
                    {testimonials.map((testimonial, index) => {
                        const isActive = index === position;
                        const isPrev =
                            index ===
                            (position - 1 + testimonials.length) %
                                testimonials.length;
                        const isNext =
                            index === (position + 1) % testimonials.length;

                        let transform = "scale(0.8) rotate(0deg)";
                        let zIndex = 1;
                        let opacity = 0;

                        if (isActive) {
                            transform = "scale(1) rotate(0deg)";
                            zIndex = 3;
                            opacity = 1;
                        } else if (isPrev) {
                            transform = `scale(0.9) rotate(-10deg) translateX(-${translateX}px)`;
                            zIndex = 2;
                            opacity = 1;
                        } else if (isNext) {
                            transform = `scale(0.9) rotate(10deg) translateX(${translateX}px)`;
                            zIndex = 2;
                            opacity = 1;
                        }

                        return (
                            <motion.div
                                key={index}
                                className='absolute bg-white overflow-hidden'
                                initial={{ transform, opacity, zIndex }}
                                animate={{ transform, opacity, zIndex }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    width: `${cardWidth}px`,
                                    height: `${cardHeight}px`,
                                    backgroundImage: `url(${testimonial.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                        );
                    })}
                </motion.div>
            </div>
            <div className='mt-8 text-center w-full relative flex flex-col items-center'>
                <div className='w-full h-32 flex items-center justify-center'>
                    <AnimatePresence>
                        <motion.div
                            key={position}
                            variants={textContainerVariants}
                            initial={{ opacity: 0, y: 34 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -34 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className='text-center w-full absolute'
                        >
                            <motion.p
                                className='text-[#7A7777] mb-2 text-sm md:text-base'
                            >
                                {testimonials[position].quote}
                            </motion.p>
                            <motion.h3
                                className='text-xl md:text-4xl'
                            >
                                {testimonials[position].name}
                            </motion.h3>
                            <motion.p
                                className='text-[#7A7777] text-sm md:text-2xl font-base'
                            >
                                {testimonials[position].title}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DraggableSlider;
