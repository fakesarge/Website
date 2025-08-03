import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Home, Briefcase, ShoppingCart, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationLogo from "./navigation/NavigationLogo";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home, onClick: () => navigate("/") },
    { name: "Portfolio", path: "/portfolio", icon: Briefcase, onClick: () => navigate("/portfolio") },
    { name: "Orders", path: "/orders", icon: ShoppingCart, onClick: () => navigate("/orders") },
    { name: "Partners", path: "/partners", icon: Users, onClick: () => navigate("/partners") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Background Particles */}
      <div className="fixed top-0 left-0 w-full h-20 pointer-events-none z-40 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${isScrolled 
            ? 'glass backdrop-blur-xl border-b border-white/10 shadow-lg shadow-primary/5' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <NavigationLogo />
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={item.onClick}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
                    ${location.pathname === item.path
                      ? 'text-primary glass shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:text-primary hover:glass-hover'
                    }
                  `}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeDesktopTab"
                      className="absolute inset-0 glass border border-primary/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <span className="relative z-10">{item.name}</span>
                  
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary rounded-full"
                    whileHover={{ 
                      width: "80%", 
                      x: "-50%",
                      transition: { duration: 0.3 }
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl glass hover:glass-hover transition-all duration-300 cursor-pointer group"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Menu className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                opacity: { duration: 0.2 }
              }}
              className="fixed right-0 top-0 h-full w-80 glass backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              {/* Background Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                      x: [0, Math.random() * 50 - 25],
                      y: [0, Math.random() * 50 - 25],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="p-8 pt-24 space-y-6 relative z-10">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gradient">Navigation</h2>
                </motion.div>

                {/* Navigation Items */}
                <div className="space-y-4">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      onClick={() => { item.onClick(); setIsMobileMenuOpen(false); }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.4 }}
                      whileHover={{ 
                        scale: 1.02,
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
                        ${location.pathname === item.path
                          ? 'glass shadow-lg shadow-primary/20 text-primary border border-primary/20' 
                          : 'hover:glass-hover text-gray-300 hover:text-primary'
                        }
                      `}
                    >
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeMobileTab"
                          className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}

                      <motion.div
                        animate={location.pathname === item.path ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: location.pathname === item.path ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      >
                        <item.icon className="w-6 h-6" />
                      </motion.div>
                      
                      <span className="font-medium text-lg">{item.name}</span>

                      <motion.div
                        className="absolute inset-0 bg-primary/5 rounded-xl opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  ))}
                </div>

                {/* Footer decoration */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 pt-8 border-t border-white/10 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Premium VFX Studio
                  </p>
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-2"
                    animate={{
                      scaleX: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;