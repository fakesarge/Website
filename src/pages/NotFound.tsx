import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-red-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Glitch effect overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff0066' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Glitchy 404 */}
            <motion.div
              className="relative mb-8"
              animate={{
                filter: [
                  "hue-rotate(0deg)",
                  "hue-rotate(90deg)",
                  "hue-rotate(180deg)",
                  "hue-rotate(270deg)",
                  "hue-rotate(360deg)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 select-none">
                404
              </h1>
              
              {/* Glitch layers */}
              <motion.h1
                className="absolute inset-0 text-9xl md:text-[12rem] font-black text-red-500/30 select-none"
                animate={{ x: [-2, 2, -2], y: [-1, 1, -1] }}
                transition={{ duration: 0.1, repeat: Infinity }}
              >
                404
              </motion.h1>
              <motion.h1
                className="absolute inset-0 text-9xl md:text-[12rem] font-black text-cyan-500/30 select-none"
                animate={{ x: [2, -2, 2], y: [1, -1, 1] }}
                transition={{ duration: 0.15, repeat: Infinity }}
              >
                404
              </motion.h1>
            </motion.div>

            <Card className="glass border-red-500/20 mb-8">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <TextGenerateEffect words="PAGE NOT FOUND" className="text-gradient" />
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    The page you're looking for has been lost in the digital void. 
                    Even our best VFX artists can't render it back to existence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/')}
                      className="button-gradient text-lg px-8 py-3"
                    >
                      <Home className="mr-2 h-5 w-5" />
                      Return Home
                    </Button>
                    <Button 
                      onClick={() => navigate(-1)}
                      variant="outline" 
                      className="text-lg px-8 py-3"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Go Back
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              <p>Lost in space? Try these coordinates:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="text-primary hover:text-primary/80"
                >
                  Home
                </Button>
                <span className="text-muted-foreground/50">•</span>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/portfolio')}
                  className="text-primary hover:text-primary/80"
                >
                  Portfolio
                </Button>
                <span className="text-muted-foreground/50">•</span>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/orders')}
                  className="text-primary hover:text-primary/80"
                >
                  Orders
                </Button>
                <span className="text-muted-foreground/50">•</span>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/partners')}
                  className="text-primary hover:text-primary/80"
                >
                  Partners
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;