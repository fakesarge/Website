import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AmbientBackground from '@/components/AmbientBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Lock, Search, Loader2, Heart, PlayCircle } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'blender', label: 'Blender Assets' },
  { value: 'vfx', label: 'VFX Packs' },
  { value: 'fivem', label: 'FiveM GFX' },
  { value: 'luts', label: 'LUTs / Shaders' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'other', label: 'Other' },
];

const VipLibrary = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const isVip = !!(profile?.vip || profile?.is_admin);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['assets-list', category],
    queryFn: async () => {
      let q = supabase.from('assets' as any).select('*').order('created_at', { ascending: false });
      if (category !== 'all') q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as any[];
    },
    enabled: !loading,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['asset-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from('asset_favorites' as any).select('asset_id').eq('user_id', user.id);
      return (data ?? []).map((r: any) => r.asset_id);
    },
    enabled: !!user,
  });

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return assets;
    return assets.filter((a: any) =>
      a.title?.toLowerCase().includes(s) ||
      a.description?.toLowerCase().includes(s) ||
      a.tags?.some((t: string) => t.toLowerCase().includes(s))
    );
  }, [assets, search]);

  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-primary">74hrs VIP Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Premium Assets & Tutorials</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Exclusive Blender files, VFX packs, GFX assets and tutorials for VIP members.
          </p>
        </div>

        {!loading && !user && (
          <Card className="max-w-xl mx-auto mb-10 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 text-center space-y-4">
              <Lock className="h-8 w-8 mx-auto text-primary" />
              <h2 className="text-xl font-semibold">Login Required</h2>
              <p className="text-sm text-muted-foreground">Sign in with Discord to access free previews and unlock VIP content.</p>
              <Button onClick={() => navigate('/login')}>Login with Discord</Button>
            </CardContent>
          </Card>
        )}

        {!loading && user && !isVip && (
          <Card className="max-w-xl mx-auto mb-10 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 text-center space-y-4">
              <Crown className="h-8 w-8 mx-auto text-primary" />
              <h2 className="text-xl font-semibold">VIP Access Required</h2>
              <p className="text-sm text-muted-foreground">
                Premium assets are locked. Join VIP on Discord to unlock the full library.
              </p>
              <a href="https://discord.gg/74hrs" target="_blank" rel="noopener noreferrer">
                <Button>Join VIP on Discord</Button>
              </a>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assets, tags, descriptions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="max-w-5xl mx-auto mb-8">
          <TabsList className="flex flex-wrap h-auto bg-transparent gap-2 justify-center">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.value} value={c.value} className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No assets in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((asset: any) => {
              const locked = asset.is_premium && !isVip;
              const fav = favorites.includes(asset.id);
              return (
                <Link key={asset.id} to={`/vip/${asset.id}`}>
                  <Card className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:border-primary/40 transition-all duration-300 h-full">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {asset.preview_url ? (
                        <img src={asset.preview_url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                      {asset.is_premium && (
                        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground gap-1">
                          <Crown className="w-3 h-3" /> VIP
                        </Badge>
                      )}
                      {locked && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
                          <Lock className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      {fav && (
                        <Heart className="absolute top-2 right-2 w-5 h-5 fill-red-500 text-red-500" />
                      )}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold leading-tight line-clamp-1">{asset.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{asset.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(asset.tags ?? []).slice(0, 3).map((t: string) => (
                          <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0">{t}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VipLibrary;
