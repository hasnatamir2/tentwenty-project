"use client";
import { motion } from "framer-motion";

const FollowCursor = ({ x, y }: { x: number; y: number }) => {
    return (
        <motion.div
            className='fixed top-0 left-0 w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-2xl pointer-events-none z-50 mix-blend-difference'
            style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
        >
            {"< >"}
        </motion.div>
    );
};

export default FollowCursor;
