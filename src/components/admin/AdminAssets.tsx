import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Crown } from 'lucide-react';

const CATEGORIES = ['blender', 'vfx', 'fivem', 'luts', 'tutorials', 'other'];

interface AssetForm {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  preview_url: string;
  file_url: string;
  video_url: string;
  is_premium: boolean;
}

const empty: AssetForm = { title: '', description: '', category: 'blender', tags: '', preview_url: '', file_url: '', video_url: '', is_premium: true };

export const AdminAssets = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AssetForm>(empty);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['admin-assets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assets' as any).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

  const save = useMutation({
    mutationFn: async (f: AssetForm) => {
      const payload = {
        title: f.title,
        description: f.description || null,
        category: f.category,
        tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
        preview_url: f.preview_url || null,
        file_url: f.file_url || null,
        video_url: f.video_url || null,
        is_premium: f.is_premium,
      };
      if (f.id) {
        const { error } = await supabase.from('assets' as any).update(payload).eq('id', f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('assets' as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-assets'] });
      qc.invalidateQueries({ queryKey: ['assets-list'] });
      toast({ title: 'Asset saved' });
      setOpen(false);
      setForm(empty);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('assets' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-assets'] });
      qc.invalidateQueries({ queryKey: ['assets-list'] });
      toast({ title: 'Asset deleted' });
    },
  });

  const openNew = () => { setForm(empty); setOpen(true); };
  const openEdit = (a: any) => {
    setForm({
      id: a.id, title: a.title, description: a.description ?? '', category: a.category,
      tags: (a.tags ?? []).join(', '), preview_url: a.preview_url ?? '', file_url: a.file_url ?? '',
      video_url: a.video_url ?? '', is_premium: a.is_premium,
    });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /> VIP Library Assets</CardTitle>
          <CardDescription>Manage assets, tutorials, and downloads shown in /vip.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> New asset</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{form.id ? 'Edit asset' : 'New asset'}</DialogTitle>
              <DialogDescription>Use external file URLs (Drive, Mega, Dropbox, etc.).</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="blender, hdri, 4k" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Preview image URL</Label>
                <Input value={form.preview_url} onChange={(e) => setForm({ ...form, preview_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid gap-2">
                <Label>File / download URL</Label>
                <Input value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} placeholder="https://drive.google.com/..." />
              </div>
              <div className="grid gap-2">
                <Label>Video embed URL (optional)</Label>
                <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
                <div>
                  <Label className="text-sm">VIP only</Label>
                  <p className="text-xs text-muted-foreground">Lock this asset behind VIP membership.</p>
                </div>
                <Switch checked={form.is_premium} onCheckedChange={(v) => setForm({ ...form, is_premium: v })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => save.mutate(form)} disabled={save.isPending || !form.title}>
                {save.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {a.preview_url && <img src={a.preview_url} alt="" className="w-12 h-12 rounded object-cover" />}
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{a.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{a.category}</TableCell>
                    <TableCell>
                      {a.is_premium ? (
                        <Badge className="bg-primary/10 text-primary border-primary/30 gap-1"><Crown className="w-3 h-3" /> VIP</Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => del.mutate(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {assets.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No assets yet. Add one above.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
