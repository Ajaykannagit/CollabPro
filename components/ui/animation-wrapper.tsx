import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimationProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
}

/**
 * Staggered list container
 */
export const StaggerContainer = ({ children, delay = 0 }: AnimationProps) => (
    <motion.div
        initial="initial"
        animate="animate"
        variants={{
            animate: {
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: delay,
                },
            },
        }}
    >
        {children}
    </motion.div>
);

/**
 * Fade and slide up entry (perfect for cards)
 */
export const FadeInUp = ({ children, delay = 0, ...props }: AnimationProps) => (
    <motion.div
        variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
        }}
        transition={{
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98], // Custom spring-like easing
            delay,
        }}
        {...props}
    >
        {children}
    </motion.div>
);

/**
 * Spring-based scale interaction (for buttons/clickable cards)
 */
export const SpringPress = ({ children, ...props }: AnimationProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
    >
        {children}
    </motion.div>
);

/**
 * Smooth height/layout transition wrapper
 */
export const LayoutTransition = ({ children }: { children: ReactNode }) => (
    <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
            layout: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }}
    >
        {children}
    </motion.div>
);
