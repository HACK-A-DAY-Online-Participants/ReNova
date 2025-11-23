import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Trash2, Activity, Recycle } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/data-wiping", label: "Data Wiping", icon: Trash2 },
  { to: "/health-check", label: "Device Health", icon: Activity },
  { to: "/recycle", label: "Recycle", icon: Recycle },
];

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Vertical Navigation Menu */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-20 lg:w-64 glass-panel border-r border-border/50 flex flex-col items-center lg:items-start p-4 space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary glow-primary flex items-center justify-center">
            <Recycle className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="hidden lg:block text-xl font-bold gradient-text">ReNova</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 w-full space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary glow-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="hidden lg:block w-full p-4 glass-panel rounded-lg text-xs text-muted-foreground">
          <p className="gradient-text-accent font-semibold mb-1">Eco-Friendly Tech</p>
          <p>Recycling made smart</p>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
