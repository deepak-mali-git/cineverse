
import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.6, ease: 'easeInOut' },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      initial={animations.initial}
      animate={animations.animate}
      exit={animations.exit}
      transition={animations.transition}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
