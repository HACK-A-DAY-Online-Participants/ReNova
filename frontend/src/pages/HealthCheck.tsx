import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Battery, HardDrive, Zap, Loader2 } from "lucide-react";

interface HealthData {
  overall_health: number;
  battery_health: number;
  performance_score: number;
  storage_health: number;
  recommendations: string[];
  details: {
    battery: {
      health_percent: number | null;
      device_type: string;
    };
    cpu: any;
    memory: any;
    disk: any;
  };
}

const HealthCheck = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [batteryHealth, setBatteryHealth] = useState(0);
  const [storageHealth, setStorageHealth] = useState(0);
  const [performanceScore, setPerformanceScore] = useState(0);

  const handleScan = async () => {
    setIsScanning(true);
    setScanComplete(false);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/health/full');
      
      if (!response.ok) {
        throw new Error('Failed to fetch health data');
      }

      const data: HealthData = await response.json();
      setHealthData(data);

      // Set individual scores
      const battery = Math.round(data.battery_health);
      const storage = Math.round(data.storage_health);
      const performance = Math.round(data.performance_score);
      const overall = Math.round(data.overall_health);

      setBatteryHealth(battery);
      setStorageHealth(storage);
      setPerformanceScore(performance);
      
      setIsScanning(false);
      setScanComplete(true);
      
      // Animate score counting after scan completes
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setHealthScore(current);
        if (current >= overall) {
          clearInterval(interval);
        }
      }, 20);

    } catch (error) {
      console.error('Health scan error:', error);
      setIsScanning(false);
      
      // Fallback to demo data
      const battery = Math.floor(Math.random() * 30) + 70;
      const storage = Math.floor(Math.random() * 20) + 75;
      const performance = Math.floor(Math.random() * 25) + 70;
      const overall = Math.floor((battery + storage + performance) / 3);

      setBatteryHealth(battery);
      setStorageHealth(storage);
      setPerformanceScore(performance);
      setScanComplete(true);
      
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setHealthScore(current);
        if (current >= overall) clearInterval(interval);
      }, 20);
    }
  };

  const recommendations = healthData?.recommendations || [
    batteryHealth < 80 && "Consider battery replacement or calibration for optimal performance",
    storageHealth < 80 && "Free up storage space by removing unnecessary files and applications",
    performanceScore < 75 && "Close background applications and restart your device for better performance",
    healthScore > 85 && "Your device is in excellent condition! Keep up the good maintenance.",
    healthScore < 70 && "Your device may benefit from professional servicing or component upgrades",
  ].filter(Boolean);

  return (
    <div className="min-h-screen p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
            animate={{
              x: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
              y: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--accent)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Scan Lines Effect */}
        <motion.div
          className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30"
          animate={{
            y: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Device Health Check</h1>
          <p className="text-muted-foreground">Comprehensive diagnostics for your device</p>
        </motion.div>

        {/* Info Cards */}
        {!scanComplete && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-panel rounded-xl p-6 space-y-3 glow-soft">
              <Battery className="w-10 h-10 text-accent animate-pulse" />
              <h3 className="text-lg font-semibold gradient-text-accent">Battery Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Checks battery capacity, charge cycles, and overall health to ensure optimal power performance.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 space-y-3 glow-soft">
              <HardDrive className="w-10 h-10 text-primary animate-pulse" />
              <h3 className="text-lg font-semibold gradient-text">Storage Diagnostics</h3>
              <p className="text-sm text-muted-foreground">
                Analyzes storage utilization, read/write speeds, and potential disk errors for data integrity.
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 space-y-3 glow-soft">
              <Zap className="w-10 h-10 text-accent animate-pulse" />
              <h3 className="text-lg font-semibold gradient-text-accent">Performance Tests</h3>
              <p className="text-sm text-muted-foreground">
                Evaluates CPU, RAM, and system responsiveness to identify bottlenecks and optimization opportunities.
              </p>
            </div>
          </motion.div>
        )}

        {/* Scan Button with Pulsing Ring */}
        {!scanComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12 relative"
          >
            {/* Pulsing Ring Effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <div className="w-48 h-16 rounded-full border-2 border-primary" />
            </motion.div>
            
            <Button
              onClick={handleScan}
              disabled={isScanning}
              size="lg"
              className="px-12 py-6 text-lg bg-primary hover:bg-primary/90 glow-primary relative z-10"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="w-6 h-6 mr-2" />
                  Check My Device Health
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Scanning Animation - Enhanced */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel rounded-3xl p-12 text-center space-y-6 mb-12 glow-primary relative overflow-hidden"
            >
              {/* Multiple Scan Lines */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
                    animate={{ y: ["-100%", "2000%"] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.4 
                    }}
                  />
                ))}
              </div>
              
              {/* Rotating Hexagon */}
              <motion.div
                className="relative mx-auto w-32 h-32 mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.polygon
                    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                    fill="none"
                    stroke="url(#hexGradient)"
                    strokeWidth="2"
                    animate={{
                      strokeDasharray: ["0 400", "400 400", "0 400"],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <Activity className="w-12 h-12 text-accent mx-auto absolute inset-0 m-auto animate-pulse" />
              </motion.div>
              
              <h2 className="text-2xl font-bold gradient-text relative z-10">Analyzing Your Device</h2>
              <p className="text-muted-foreground relative z-10">Running comprehensive diagnostics...</p>
              
              {/* Particle Effect */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-accent"
                  initial={{ 
                    x: "50%", 
                    y: "50%",
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + Math.cos((i / 12) * Math.PI * 2) * 150}%`,
                    y: `${50 + Math.sin((i / 12) * Math.PI * 2) * 150}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {scanComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Overall Score - Circular Progress */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-panel rounded-3xl p-12 text-center glow-soft relative overflow-hidden"
              >
                {/* Radial Gradient Background */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                
                <div className="relative w-48 h-48 mx-auto mb-6">
                  {/* Outer Glow Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent/30"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#scoreGradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(healthScore / 100) * 552} 552`}
                      className="glow-accent"
                      style={{
                        transition: "stroke-dasharray 0.02s linear"
                      }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      className="text-5xl font-bold gradient-text"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      {healthScore}%
                    </motion.div>
                    <p className="text-muted-foreground mt-2">Overall Health</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {healthScore >= 85 ? "Excellent" : healthScore >= 70 ? "Good" : "Needs Attention"}
                </h2>
                <p className="text-muted-foreground">
                  Your device is performing {healthScore >= 85 ? "exceptionally well" : healthScore >= 70 ? "adequately" : "below optimal levels"}
                </p>
              </motion.div>

              {/* Individual Health Bars - Enhanced */}
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-panel rounded-xl p-6 space-y-3 relative overflow-hidden group hover:glow-soft transition-all"
                >
                  {/* Animated Background on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-center space-x-3 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Battery className="w-6 h-6 text-accent" />
                    </motion.div>
                    <h3 className="font-semibold">Battery Health</h3>
                  </div>
                  <Progress value={batteryHealth} className="h-3 relative z-10" />
                  <motion.p 
                    className="text-2xl font-bold gradient-text-accent relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  >
                    {batteryHealth}%
                  </motion.p>
                  {healthData?.details.battery.device_type && (
                    <p className="text-xs text-muted-foreground relative z-10">
                      Device: {healthData.details.battery.device_type}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-panel rounded-xl p-6 space-y-3 relative overflow-hidden group hover:glow-soft transition-all"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-center space-x-3 relative z-10">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <HardDrive className="w-6 h-6 text-accent" />
                    </motion.div>
                    <h3 className="font-semibold">Storage Health</h3>
                  </div>
                  <Progress value={storageHealth} className="h-3 relative z-10" />
                  <motion.p 
                    className="text-2xl font-bold gradient-text-accent relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  >
                    {storageHealth}%
                  </motion.p>
                  {healthData?.details.disk && (
                    <p className="text-xs text-muted-foreground relative z-10">
                      {healthData.details.disk.free_gb}GB free of {healthData.details.disk.total_gb}GB
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel rounded-xl p-6 space-y-3 relative overflow-hidden group hover:glow-soft transition-all"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-center space-x-3 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-6 h-6 text-accent" />
                    </motion.div>
                    <h3 className="font-semibold">Performance</h3>
                  </div>
                  <Progress value={performanceScore} className="h-3 relative z-10" />
                  <motion.p 
                    className="text-2xl font-bold gradient-text-accent relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  >
                    {performanceScore}%
                  </motion.p>
                  {healthData?.details.cpu && (
                    <p className="text-xs text-muted-foreground relative z-10">
                      CPU: {healthData.details.cpu.cpu_usage_percent}% used
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel rounded-2xl p-8 space-y-4"
              >
                <h3 className="text-xl font-semibold gradient-text">Recommended Actions</h3>
                <div className="max-h-64 overflow-auto space-y-3">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-3 p-4 glass-panel rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <p className="text-foreground/80">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Scan Again Button */}
              <div className="text-center">
                <Button
                  onClick={() => {
                    setScanComplete(false);
                    setHealthScore(0);
                    setHealthData(null);
                  }}
                  variant="outline"
                  className="border-accent/50 hover:bg-accent/10"
                >
                  Scan Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HealthCheck;