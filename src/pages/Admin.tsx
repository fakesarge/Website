import { useAuth } from '@/hooks/useAuth';
import { isOwner } from '@/config/admin';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, ArrowLeft } from 'lucide-react';
import AmbientBackground from '@/components/AmbientBackground';
import Navigation from '@/components/Navigation';

const premiumEase = [0.25, 0.46, 0.45, 0.94] as const;

const Admin = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isOwner(profile?.discord_id)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AmbientBackground />

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: premiumEase }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-muted-foreground gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Shield className="w-7 h-7 text-destructive" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
              Owner Access
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage orders, users, and system configuration
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: premiumEase }}
        >
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-secondary/50">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <AdminOrders />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
