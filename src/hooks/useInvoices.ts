
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock invoice data structure
interface MockInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  due_date: string;
  created_at: string;
  orders?: {
    order_name: string;
  };
}

export const useInvoices = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async (): Promise<MockInvoice[]> => {
      if (!user) return [];
      
      // Return mock data for now since invoices table doesn't exist in types yet
      const mockInvoices: MockInvoice[] = [
        {
          id: '1',
          invoice_number: 'INV-001',
          amount: 299.99,
          status: 'paid',
          due_date: '2024-01-15',
          created_at: '2024-01-01',
          orders: {
            order_name: 'Website Development'
          }
        },
        {
          id: '2',
          invoice_number: 'INV-002',
          amount: 199.99,
          status: 'unpaid',
          due_date: '2024-02-15',
          created_at: '2024-02-01',
          orders: {
            order_name: 'Logo Design'
          }
        }
      ];
      
      return mockInvoices;
    },
    enabled: !!user,
  });
};
