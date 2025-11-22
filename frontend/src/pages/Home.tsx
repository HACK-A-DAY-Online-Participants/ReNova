import { motion } from "framer-motion";
import RobotMascot from "@/components/RobotMascot";
import { Sparkles, Target, Eye } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Side - Robot */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <RobotMascot size="lg" />
          </motion.div>

          {/* Right Side - Title & Tagline */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="gradient-text">ReNova</span>
            </h1>
            <p className="text-2xl md:text-3xl text-accent font-semibold">
              Recycling Made Smart
            </p>
            <p className="text-lg text-muted-foreground max-w-md">
              Your friendly AI companion for responsible e-waste management. 
              Secure data wiping, device health checks, and eco-friendly recycling options.
            </p>
            <div className="flex gap-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary glow-primary rounded-lg text-primary-foreground font-semibold cursor-pointer"
              >
                Get Started
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 glass-panel rounded-lg text-foreground font-semibold cursor-pointer"
              >
                Learn More
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="glass-panel rounded-3xl p-12 glow-soft">
            <div className="flex items-center space-x-4 mb-6">
              <Sparkles className="w-10 h-10 text-accent animate-glow-pulse" />
              <h2 className="text-4xl font-bold gradient-text">About Us</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl">
              ReNova is at the forefront of sustainable technology management. We believe that 
              every electronic device deserves a second chance, and every piece of data deserves 
              secure handling. Our platform combines cutting-edge technology with environmental 
              consciousness to create a seamless e-waste recycling experience.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl mt-4">
              With advanced data wiping standards, comprehensive device diagnostics, and a 
              network of trusted recycling partners, we make it easy for you to do the right 
              thing for both your privacy and the planet.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="glass-panel rounded-3xl p-12 glow-soft">
            <div className="flex items-center space-x-4 mb-6">
              <Eye className="w-10 h-10 text-accent animate-glow-pulse" />
              <h2 className="text-4xl font-bold gradient-text">Our Vision</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl">
              We envision a world where electronic waste is not a burden but an opportunity. 
              A world where technology disposal is secure, sustainable, and accessible to everyone. 
              Through innovation and education, we're building a future where every device is 
              responsibly recycled, every bit of data is properly destroyed, and every individual 
              has the tools they need to make environmentally conscious decisions.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-semibold gradient-text-accent mb-2">100%</h3>
                <p className="text-sm text-muted-foreground">Data Security</p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-semibold gradient-text-accent mb-2">Zero</h3>
                <p className="text-sm text-muted-foreground">Waste to Landfills</p>
              </div>
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-semibold gradient-text-accent mb-2">∞</h3>
                <p className="text-sm text-muted-foreground">Circular Economy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="min-h-screen flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="glass-panel rounded-3xl p-12 glow-soft">
            <div className="flex items-center space-x-4 mb-6">
              <Target className="w-10 h-10 text-accent animate-glow-pulse" />
              <h2 className="text-4xl font-bold gradient-text">Our Mission</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl mb-8">
              Our mission is threefold: Protect, Diagnose, and Recycle. We protect your sensitive 
              data with military-grade wiping standards. We diagnose your device's health to maximize 
              its lifespan and value. And we connect you with the best recycling options to ensure 
              your electronics are handled responsibly.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">What We Do</h3>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Military-grade data wiping using DoD 5220.22-M standards</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Comprehensive device health diagnostics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Connect with certified recycling centers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Support NGOs working towards e-waste reduction</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">Why Choose Us</h3>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>User-friendly interface with AI guidance</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Complete transparency in data handling</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Environmental impact tracking</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Free and accessible to everyone</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
