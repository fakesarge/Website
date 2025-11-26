import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export const AdminOrders = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', search, statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const { data, error } = await supabase.functions.invoke('admin-orders', {
        body: { params: Object.fromEntries(params) },
      });

      if (error) {
        console.error('Admin orders fetch error:', error);
        throw error;
      }
      return data;
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (order: any) => {
      const { data, error } = await supabase.functions.invoke('admin-orders', {
        method: 'PUT',
        body: order,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order updated successfully' });
      setEditingOrder(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error updating order', description: error.message, variant: 'destructive' });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.functions.invoke('admin-orders', {
        method: 'DELETE',
        body: null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order deleted successfully' });
      setDeletingOrderId(null);
    },
    onError: (error: any) => {
      toast({ title: 'Error deleting order', description: error.message, variant: 'destructive' });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (order: any) => {
      const { data, error } = await supabase.functions.invoke('admin-orders', {
        method: 'POST',
        body: order,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order created successfully' });
      setIsCreateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: 'Error creating order', description: error.message, variant: 'destructive' });
    },
  });

  const getStatusBadge = (status: string) => {
    const colorClasses: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20',
      in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20',
    };
    return (
      <Badge variant="outline" className={colorClasses[status] || ''}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleSubmitEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      id: editingOrder.id,
      order_name: formData.get('order_name'),
      customer_name: formData.get('customer_name'),
      customer_email: formData.get('customer_email'),
      price: parseFloat(formData.get('price') as string),
      status: formData.get('status'),
      category: formData.get('category'),
      service: formData.get('service'),
      description: formData.get('description'),
      discord_id: formData.get('discord_id'),
    };
    updateOrderMutation.mutate(updates);
  };

  const handleSubmitCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder = {
      order_name: formData.get('order_name'),
      customer_name: formData.get('customer_name'),
      customer_email: formData.get('customer_email'),
      price: parseFloat(formData.get('price') as string),
      status: formData.get('status') || 'pending',
      category: formData.get('category'),
      service: formData.get('service'),
      description: formData.get('description'),
      discord_id: formData.get('discord_id'),
    };
    createOrderMutation.mutate(newOrder);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage all customer orders</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Add a new order to the system</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="create_order_name">Order Name</Label>
                    <Input id="create_order_name" name="order_name" required />
                  </div>
                  <div>
                    <Label htmlFor="create_price">Price</Label>
                    <Input id="create_price" name="price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <Label htmlFor="create_customer_name">Customer Name</Label>
                    <Input id="create_customer_name" name="customer_name" required />
                  </div>
                  <div>
                    <Label htmlFor="create_customer_email">Customer Email</Label>
                    <Input id="create_customer_email" name="customer_email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="create_category">Category</Label>
                    <Input id="create_category" name="category" required />
                  </div>
                  <div>
                    <Label htmlFor="create_service">Service</Label>
                    <Input id="create_service" name="service" required />
                  </div>
                  <div>
                    <Label htmlFor="create_discord_id">Discord ID</Label>
                    <Input id="create_discord_id" name="discord_id" required />
                  </div>
                  <div>
                    <Label htmlFor="create_status">Status</Label>
                    <Select name="status" defaultValue="pending">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="create_description">Description</Label>
                  <Textarea id="create_description" name="description" rows={3} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createOrderMutation.isPending}>
                    {createOrderMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Order
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, Discord ID, or order code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Discord ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData?.data?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.order_code}</TableCell>
                    <TableCell>
                      <div>{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                    </TableCell>
                    <TableCell>{order.service}</TableCell>
                    <TableCell>${order.price}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="font-mono text-sm">{order.discord_id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Order</DialogTitle>
                              <DialogDescription>Update order details</DialogDescription>
                            </DialogHeader>
                            {editingOrder && (
                              <form onSubmit={handleSubmitEdit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="order_name">Order Name</Label>
                                    <Input id="order_name" name="order_name" defaultValue={editingOrder.order_name} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" name="price" type="number" step="0.01" defaultValue={editingOrder.price} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="customer_name">Customer Name</Label>
                                    <Input id="customer_name" name="customer_name" defaultValue={editingOrder.customer_name} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="customer_email">Customer Email</Label>
                                    <Input id="customer_email" name="customer_email" type="email" defaultValue={editingOrder.customer_email} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" name="category" defaultValue={editingOrder.category} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="service">Service</Label>
                                    <Input id="service" name="service" defaultValue={editingOrder.service} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="discord_id">Discord ID</Label>
                                    <Input id="discord_id" name="discord_id" defaultValue={editingOrder.discord_id} required />
                                  </div>
                                  <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" defaultValue={editingOrder.status}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea id="description" name="description" defaultValue={editingOrder.description || ''} rows={3} />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button type="submit" disabled={updateOrderMutation.isPending}>
                                    {updateOrderMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Save Changes
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingOrderId(order.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {ordersData?.count > 20 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= ordersData.count}
            >
              Next
            </Button>
          </div>
        )}

        <AlertDialog open={!!deletingOrderId} onOpenChange={() => setDeletingOrderId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingOrderId && deleteOrderMutation.mutate(deletingOrderId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};