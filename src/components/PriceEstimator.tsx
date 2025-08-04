import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowRight, X } from 'lucide-react';

interface PriceEstimatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const PriceEstimator = ({ isOpen, onClose }: PriceEstimatorProps) => {
  const [serviceType, setServiceType] = useState<'VFX' | 'GFX' | 'OTHER' | null>(null);
  const [vfxType, setVfxType] = useState<'Custom' | 'Premade' | null>(null);
  const [customCharacter, setCustomCharacter] = useState<boolean | null>(null);
  const [fps, setFps] = useState<number | null>(null);
  const [scenes, setScenes] = useState<number>(1);
  const [gfxServices, setGfxServices] = useState<string[]>([]);
  const [additionalEffects, setAdditionalEffects] = useState<string[]>([]);

  const calculatePrice = () => {
    if (!serviceType) return 0;
    
    if (serviceType === 'OTHER') return 0;
    
    let basePrice = 0;
    
    if (serviceType === 'VFX') {
      if (vfxType === 'Custom') {
        basePrice = 150;
        if (customCharacter) basePrice += 75;
        if (fps && fps > 60) basePrice += 50;
        if (fps && fps > 100) basePrice += 25;
        basePrice += scenes * 25;
        basePrice += additionalEffects.length * 30;
      } else if (vfxType === 'Premade') {
        basePrice = 35;
      }
    } else if (serviceType === 'GFX') {
      if (gfxServices.includes('Logo')) basePrice += 45;
      if (gfxServices.includes('Banner')) basePrice += 35;
      if (gfxServices.includes('Animation')) basePrice += 65;
    }
    
    return basePrice;
  };

  const resetForm = () => {
    setServiceType(null);
    setVfxType(null);
    setCustomCharacter(null);
    setFps(null);
    setScenes(1);
    setGfxServices([]);
    setAdditionalEffects([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDiscordJoin = () => {
    window.open('https://discord.gg/VFX', '_blank');
  };

  const handleGfxServiceToggle = (service: string) => {
    setGfxServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleEffectToggle = (effect: string) => {
    setAdditionalEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Price Estimator</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Service Type Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Select Service Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {['VFX', 'GFX', 'OTHER'].map((type) => (
                  <Button
                    key={type}
                    variant={serviceType === type ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setServiceType(type as any)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* VFX Options */}
            {serviceType === 'VFX' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-medium mb-2">VFX Type</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['Custom', 'Premade'].map((type) => (
                      <Button
                        key={type}
                        variant={vfxType === type ? "default" : "outline"}
                        onClick={() => setVfxType(type as any)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {vfxType === 'Custom' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h4 className="font-medium mb-2">Custom Character?</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[true, false].map((value) => (
                          <Button
                            key={value.toString()}
                            variant={customCharacter === value ? "default" : "outline"}
                            onClick={() => setCustomCharacter(value)}
                          >
                            {value ? 'Yes' : 'No'}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Frame Rate (FPS)</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[25, 30, 60, 120].map((fpsValue) => (
                          <Button
                            key={fpsValue}
                            variant={fps === fpsValue ? "default" : "outline"}
                            onClick={() => setFps(fpsValue)}
                          >
                            {fpsValue}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Number of Scenes: {scenes}</h4>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={scenes}
                        onChange={(e) => setScenes(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Additional Effects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Particle Effects', 'Advanced Lighting', 'Sound Design', 'Motion Graphics'].map((effect) => (
                          <Button
                            key={effect}
                            variant={additionalEffects.includes(effect) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleEffectToggle(effect)}
                          >
                            {effect}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* GFX Options */}
            {serviceType === 'GFX' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-medium mb-2">Select Services</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {['Logo', 'Banner', 'Animation'].map((service) => (
                      <Button
                        key={service}
                        variant={gfxServices.includes(service) ? "default" : "outline"}
                        onClick={() => handleGfxServiceToggle(service)}
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* OTHER Service */}
            {serviceType === 'OTHER' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-2">Custom Project Request</h3>
                  <p className="text-muted-foreground mb-4">
                    For custom projects and special requests, please join our Discord and open a support ticket.
                  </p>
                  <Button className="button-gradient" onClick={handleDiscordJoin}>
                    Join Discord
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Price Display */}
            {serviceType && serviceType !== 'OTHER' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-white/10 pt-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Estimated Price:</span>
                  <Badge variant="secondary" className="text-xl px-4 py-2">
                    ${calculatePrice()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Final price may vary based on complexity and specific requirements.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            {serviceType && calculatePrice() > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <Button className="button-gradient flex-1" onClick={handleDiscordJoin}>
                  Order Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PriceEstimator;
