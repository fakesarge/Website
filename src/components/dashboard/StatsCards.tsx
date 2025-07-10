
import { useOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';

const StatsCards = () => {
  const { data: orders } = useOrders();
  const { data: invoices } = useInvoices();

  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + Number(order.price), 0) || 0;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'text-blue-400',
    },
    {
      title: 'Completed',
      value: completedOrders,
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Pending',
      value: pendingOrders,
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
