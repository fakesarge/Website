
import { useInvoices } from '@/hooks/useInvoices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const InvoicesTable = () => {
  const { data: invoices, isLoading } = useInvoices();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  if (isLoading) {
    return (
      <Card className="glass border-white/10">
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading invoices...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Invoices</CardTitle>
        <CardDescription>
          Your billing history and payment status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices && invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-muted-foreground">Invoice #</TableHead>
                <TableHead className="text-muted-foreground">Order</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.orders?.order_name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-white">
                    ${Number(invoice.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.due_date 
                      ? format(new Date(invoice.due_date), 'MMM dd, yyyy')
                      : 'No due date'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No invoices found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoicesTable;
