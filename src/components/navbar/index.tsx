"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMediaQuery from "../../hooks/use-media-query";
import Link from "next/link";
import { NavLinks } from "@/lib/data";
import ArrowRight from "../../../public/icons/arrow-right.svg";
import Image from "next/image";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const mobileLinkVariants = {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 20, opacity: 0 },
    };

    const menuVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
        closed: {
            opacity: 0,
            y: "-100%",
        },
    };

    return (
        <header className='fixed md:top-4 top-0 md:left-4 left-0 md:right-4 right-0 z-40 bg-white/80 backdrop-blur-sm'>
            <nav className='container mx-auto px-6 py-4 flex justify-between items-center'>
                {isMobile ? (
                    <>
                        <Link
                            href='#'
                            className='px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors flex items-center'
                        >
                            Contact us
                            <Image
                                src={ArrowRight}
                                alt='arrow-right'
                                className=' ml-2'
                                width={16}
                                height={16}
                            />
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className='focus:outline-none'
                        >
                            <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d={
                                        isOpen
                                            ? "M6 18L18 6M6 6l12 12"
                                            : "M4 6h16M4 12h16m-7 6h7"
                                    }
                                ></path>
                            </svg>
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    variants={menuVariants}
                                    initial='closed'
                                    animate='open'
                                    exit='closed'
                                    className='absolute top-full left-0 w-full bg-white/90 backdrop-blur-sm shadow-lg'
                                >
                                    <div className='flex flex-col items-center py-4'>
                                        {NavLinks.map((link, index) => (
                                            <motion.div
                                                key={index}
                                                variants={mobileLinkVariants}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className='py-2 text-lg hover:text-gray-500 transition-colors'
                                                >
                                                    {link.name}
                                                </Link>
                                            </motion.div>
                                        ))}
                                        <motion.div
                                            variants={mobileLinkVariants}
                                        >
                                            <Link
                                                href='#'
                                                className='mt-4 px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors flex items-center'
                                            >
                                                Contact us
                                                <Image
                                                    src={ArrowRight}
                                                    alt='arrow-right'
                                                    className=' ml-2'
                                                    width={16}
                                                    height={16}
                                                />
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                ) : (
                    <>
                        <div className='flex items-center space-x-8'>
                            {NavLinks.map((link, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className='text-gray-600 hover:text-black transition-colors'
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Link
                                href='#'
                                className='px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors flex items-center'
                            >
                                Contact us
                                <svg
                                    className='w-4 h-4 ml-2'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                                    ></path>
                                </svg>
                            </Link>
                        </motion.div>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
