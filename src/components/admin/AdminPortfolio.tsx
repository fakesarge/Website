import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image as ImageIcon, Video } from "lucide-react";

type Kind = "gfx" | "vfx";

interface PortfolioItem {
  id: string;
  kind: Kind;
  title: string;
  slug: string | null;
  description: string | null;
  cover_url: string | null;
  media_url: string | null;
  attributes: any;
  featured: boolean;
  sort_order: number;
}

const emptyForm = {
  id: "",
  kind: "gfx" as Kind,
  title: "",
  slug: "",
  description: "",
  cover_url: "",
  media_url: "",
  attributesJson: '[\n  { "label": "Palette", "value": "Silver", "swatches": ["#9e9e9e"] }\n]',
  featured: false,
  sort_order: 0,
};

export const AdminPortfolio = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Kind>("gfx");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["portfolio_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PortfolioItem[];
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      let attributes: any = [];
      try {
        attributes = form.attributesJson.trim() ? JSON.parse(form.attributesJson) : [];
      } catch {
        throw new Error("Attributes JSON is invalid");
      }
      const payload: any = {
        kind: form.kind,
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        description: form.description || null,
        cover_url: form.cover_url || null,
        media_url: form.media_url || null,
        attributes,
        featured: form.featured,
        sort_order: form.sort_order,
      };
      if (form.id) payload.id = form.id;
      const { error } = await supabase
        .from("portfolio_items")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast({ title: "Saved" });
    },
    onError: (e: any) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portfolio_items"] });
      toast({ title: "Deleted" });
    },
  });

  const openEdit = (i: PortfolioItem) => {
    setForm({
      id: i.id,
      kind: i.kind,
      title: i.title,
      slug: i.slug || "",
      description: i.description || "",
      cover_url: i.cover_url || "",
      media_url: i.media_url || "",
      attributesJson: JSON.stringify(i.attributes ?? [], null, 2),
      featured: i.featured,
      sort_order: i.sort_order,
    });
    setDialogOpen(true);
  };

  const openNew = (kind: Kind) => {
    setForm({ ...emptyForm, kind });
    setDialogOpen(true);
  };

  const filtered = items.filter((i) => i.kind === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as Kind)}>
          <TabsList>
            <TabsTrigger value="gfx" className="gap-2">
              <ImageIcon className="h-4 w-4" /> GFX
            </TabsTrigger>
            <TabsTrigger value="vfx" className="gap-2">
              <Video className="h-4 w-4" /> VFX
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openNew(tab)} className="gap-2">
              <Plus className="h-4 w-4" /> New {tab.toUpperCase()}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit" : "New"} {form.kind.toUpperCase()} item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Kind</Label>
                  <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as Kind })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gfx">GFX</SelectItem>
                      <SelectItem value="vfx">VFX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sort order</Label>
                  <Input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>

              <div>
                <Label>Slug (optional)</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from title" />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <Label>{form.kind === "gfx" ? "Cover image URL" : "Cover / thumbnail URL"}</Label>
                <Input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://…" />
              </div>

              <div>
                <Label>{form.kind === "vfx" ? "YouTube ID or video URL" : "Media URL (optional)"}</Label>
                <Input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder={form.kind === "vfx" ? "e.g. tPed8y9NxnE" : ""} />
              </div>

              <div>
                <Label>Attributes (JSON)</Label>
                <Textarea
                  rows={6}
                  className="font-mono text-xs"
                  value={form.attributesJson}
                  onChange={(e) => setForm({ ...form, attributesJson: e.target.value })}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {form.kind === "gfx"
                    ? 'Array of { label, value, swatches? } — shown as floating chips.'
                    : 'Object like { "tagline": "…", "features": ["…"], "size": "wide" }.'}
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => upsert.mutate()} disabled={upsert.isPending || !form.title}>
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No {tab.toUpperCase()} items yet. Click "New {tab.toUpperCase()}" to add one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((i) => (
            <Card key={i.id} className="overflow-hidden">
              {i.cover_url && (
                <div className="aspect-video w-full overflow-hidden bg-secondary/40">
                  <img src={i.cover_url} alt={i.title} className="h-full w-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate">{i.title}</span>
                  {i.featured && <Badge variant="outline" className="text-[10px]">Featured</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-xs text-muted-foreground">{i.description}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => openEdit(i)}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => remove.mutate(i.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPortfolio;
