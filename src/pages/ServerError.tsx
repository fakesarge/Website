import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const ServerErrorPage = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-orange-500/5" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 10,0 L 10,20 M 0,10 L 20,10" stroke="#ff6600" strokeWidth="0.5" fill="none" opacity="0.3"/>
                <circle cx="10" cy="10" r="2" fill="#ff6600" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
      </div>

      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated 500 */}
            <motion.div
              className="relative mb-8"
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, 0.5, -0.5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 select-none">
                500
              </h1>
              
              {/* Warning overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-16 h-16 text-orange-500" />
              </motion.div>
            </motion.div>

            <Card className="glass border-orange-500/20 mb-8">
              <CardContent className="pt-8 pb-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <TextGenerateEffect words="SYSTEM MALFUNCTION DETECTED" className="text-gradient" />
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Our servers are experiencing some technical difficulties. 
                    Our engineers are working to restore the VFX magic as quickly as possible.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleRefresh}
                      className="button-gradient text-lg px-8 py-3"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={() => navigate('/')}
                      variant="outline" 
                      className="text-lg px-8 py-3"
                    >
                      <Home className="mr-2 h-5 w-5" />
                      Return Home
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                <span>Systems are being restored...</span>
              </div>
              
              <p className="text-xs text-muted-foreground/80">
                Error Code: VFX_SERVER_500 | 
                Contact: support@74hrs.store | 
                Status: <span className="text-orange-400">Under Maintenance</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;