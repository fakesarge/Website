import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
  isLocked?: boolean;
}

export const GameCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  onClick,
  isLocked = false 
}: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer group ${
          isLocked ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={!isLocked ? onClick : undefined}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
        <div className="relative p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Icon className="w-12 h-12 text-primary" />
            {isLocked && (
              <div className="text-xs bg-muted px-2 py-1 rounded">Locked</div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 border-2 border-primary rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};
