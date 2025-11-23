import { motion } from "framer-motion";

interface RobotMascotProps {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  expression?: "normal" | "happy";
}

const RobotMascot = ({ size = "md", animate = true, expression = "normal" }: RobotMascotProps) => {
  const sizes = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-64 h-64",
  };

  return (
    <motion.div
      className={`${sizes[size]} relative`}
      animate={animate ? { y: [0, -10, 0] } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Robot Body */}
        <motion.rect
          x="50"
          y="80"
          width="100"
          height="90"
          rx="20"
          fill="url(#bodyGradient)"
          stroke="url(#glowGradient)"
          strokeWidth="2"
          animate={animate ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Head */}
        <motion.rect
          x="60"
          y="40"
          width="80"
          height="60"
          rx="15"
          fill="url(#headGradient)"
          stroke="url(#glowGradient)"
          strokeWidth="2"
        />
        
        {/* Antenna */}
        <motion.line
          x1="100"
          y1="40"
          x2="100"
          y2="20"
          stroke="url(#glowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={animate ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: "100px 40px" }}
        />
        <motion.circle
          cx="100"
          cy="15"
          r="5"
          fill="#39B89A"
          className="glow-accent"
          animate={animate ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Eyes */}
        <motion.circle
          cx="80"
          cy="60"
          r="8"
          fill="#39B89A"
          className="glow-accent"
          animate={animate ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="120"
          cy="60"
          r="8"
          fill="#39B89A"
          className="glow-accent"
          animate={animate ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Smile */}
        <path
          d={expression === "happy" ? "M 80 75 Q 100 95 120 75" : "M 85 80 Q 100 90 115 80"}
          stroke="#39B89A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Arms */}
        <motion.rect
          x="35"
          y="90"
          width="15"
          height="50"
          rx="8"
          fill="url(#bodyGradient)"
          animate={animate ? { rotate: [0, -15, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "42px 90px" }}
        />
        <motion.rect
          x="150"
          y="90"
          width="15"
          height="50"
          rx="8"
          fill="url(#bodyGradient)"
          animate={animate ? { rotate: [0, 15, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "158px 90px" }}
        />
        
        {/* Chest Panel */}
        <rect x="75" y="100" width="50" height="40" rx="8" fill="#0A0A0A" opacity="0.3" />
        <circle cx="90" cy="115" r="3" fill="#39B89A" />
        <circle cx="110" cy="115" r="3" fill="#39B89A" />
        <rect x="85" y="125" width="30" height="2" fill="#5C2196" opacity="0.5" />
        <rect x="85" y="130" width="25" height="2" fill="#5C2196" opacity="0.5" />
        
        {/* Legs */}
        <rect x="65" y="170" width="20" height="30" rx="5" fill="url(#bodyGradient)" />
        <rect x="115" y="170" width="20" height="30" rx="5" fill="url(#bodyGradient)" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C2196" />
            <stop offset="100%" stopColor="#7C3DB6" />
          </linearGradient>
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6A2BA0" />
            <stop offset="100%" stopColor="#5C2196" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39B89A" />
            <stop offset="100%" stopColor="#5C2196" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default RobotMascot;
