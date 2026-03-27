import { motion } from 'framer-motion';

interface FloatingOrbProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  delay?: number;
  duration?: number;
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({ 
  color = 'bg-primary/20', 
  size = 300, 
  top = '10%', 
  left = '20%', 
  delay = 0,
  duration = 10
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
        x: [0, 50, -50, 0],
        y: [0, -50, 50, 0],
      }}
      transition={{ 
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay
      }}
      className={`absolute rounded-full pointer-events-none blur-3xl ${color} z-0`}
      style={{
        width: size,
        height: size,
        top: top,
        left: left,
      }}
    />
  );
};
