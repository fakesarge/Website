import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Shield, ShieldOff, Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);

      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { params: Object.fromEntries(params) },
      });

      if (error) {
        console.error('Admin users fetch error:', error);
        throw error;
      }
      return data;
    },
  });

  const roleManageMutation = useMutation({
    mutationFn: async ({ user_id, role, action }: { user_id: string; role: string; action: 'add' | 'remove' }) => {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        method: 'POST',
        body: { user_id, role, action },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User role updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error updating user role', description: error.message, variant: 'destructive' });
    },
  });

  const handleRoleChange = (userId: string, currentRoles: any[], newRole: string) => {
    const hasRole = currentRoles.some((r: any) => r.role === newRole);
    roleManageMutation.mutate({
      user_id: userId,
      role: newRole,
      action: hasRole ? 'remove' : 'add',
    });
  };

  const getRoleBadges = (userRoles: any[]) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-red-500/10 text-red-500 border-red-500/20',
      moderator: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      vip: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      user: 'bg-green-500/10 text-green-500 border-green-500/20',
    };

    return userRoles.map((role: any, idx: number) => (
      <Badge key={idx} className={roleColors[role.role] || ''} variant="outline">
        {role.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
        {role.role}
      </Badge>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>View and manage user accounts and roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by username, Discord ID, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
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
                  <TableHead>User</TableHead>
                  <TableHead>Discord ID</TableHead>
                  <TableHead className="font-semibold">Signup IP</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.data?.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.username || 'Unknown'}</span>
                            {user.user_roles?.some((r: any) => r.role === 'admin') && (
                              <Shield className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground font-mono">{user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.discord_id || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs bg-muted/50">
                          {user.signup_ip || 'N/A'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {user.user_roles?.length > 0 ? getRoleBadges(user.user_roles) : (
                          <Badge variant="outline">No roles</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Select
                        onValueChange={(role) => handleRoleChange(user.id, user.user_roles || [], role)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Manage role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">
                            <div className="flex items-center gap-2">
                              {user.user_roles?.some((r: any) => r.role === 'admin') ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                              {user.user_roles?.some((r: any) => r.role === 'admin') ? 'Remove' : 'Make'} Admin
                            </div>
                          </SelectItem>
                          <SelectItem value="moderator">
                            <div className="flex items-center gap-2">
                              {user.user_roles?.some((r: any) => r.role === 'moderator') ? 'Remove' : 'Make'} Moderator
                            </div>
                          </SelectItem>
                          <SelectItem value="vip">
                            <div className="flex items-center gap-2">
                              {user.user_roles?.some((r: any) => r.role === 'vip') ? 'Remove' : 'Make'} VIP
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {usersData?.count > 20 && (
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
              disabled={page * 20 >= usersData.count}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};