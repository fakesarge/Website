import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: roles, isLoading: rolesLoading } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!authLoading && !rolesLoading) {
      const hasAdminRole = roles?.includes('admin');
      
      if (!user || !hasAdminRole) {
        navigate('/');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, roles, authLoading, rolesLoading, navigate]);

  if (authLoading || rolesLoading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">
            Manage orders, users, and system configuration
          </p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
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
      </div>
    </div>
  );
};

export default Admin;