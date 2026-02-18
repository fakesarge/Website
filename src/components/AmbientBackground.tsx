import { motion } from "framer-motion";

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 30, 0], opacity: [0.03, 0.06, 0.02, 0.03] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary rounded-full blur-[150px]"
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 40, -30, 0], opacity: [0.02, 0.05, 0.015, 0.02] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[55%] right-[10%] w-[400px] h-[400px] bg-primary rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0], opacity: [0.015, 0.04, 0.01, 0.015] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[75%] left-[40%] w-[350px] h-[350px] bg-primary rounded-full blur-[130px]"
      />
    </div>
  );
};

export default AmbientBackground;
