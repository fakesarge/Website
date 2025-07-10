
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import OrdersTable from '@/components/dashboard/OrdersTable';
import InvoicesTable from '@/components/dashboard/InvoicesTable';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      <Navigation />
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Overview</h2>
            <p className="text-muted-foreground">
              Track your orders, invoices, and account activity
            </p>
          </div>

          <StatsCards />

          <div className="grid gap-8">
            <OrdersTable />
            <InvoicesTable />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
