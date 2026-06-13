import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import AmbientBackground from '@/components/AmbientBackground';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Lock, ArrowLeft, Download, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VipAssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();

  const isVip = !!(profile?.vip || profile?.is_admin);

  const { data: asset, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('assets' as any).select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!id,
  });

  // Record view
  useEffect(() => {
    if (!user || !asset) return;
    supabase.from('asset_views' as any).insert({ user_id: user.id, asset_id: asset.id }).then(() => {});
  }, [user, asset]);

  const { data: fav } = useQuery({
    queryKey: ['asset-fav', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      const { data } = await supabase.from('asset_favorites' as any).select('asset_id').eq('user_id', user.id).eq('asset_id', id).maybeSingle();
      return !!data;
    },
    enabled: !!user && !!id,
  });

  const toggleFav = useMutation({
    mutationFn: async () => {
      if (!user || !id) return;
      if (fav) {
        await supabase.from('asset_favorites' as any).delete().eq('user_id', user.id).eq('asset_id', id);
      } else {
        await supabase.from('asset_favorites' as any).insert({ user_id: user.id, asset_id: id });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['asset-fav', id, user?.id] }),
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related-assets', asset?.category, id],
    queryFn: async () => {
      if (!asset) return [];
      const { data } = await supabase.from('assets' as any).select('*').eq('category', asset.category).neq('id', id).limit(4);
      return (data ?? []) as any[];
    },
    enabled: !!asset,
  });

  const handleDownload = () => {
    if (!asset?.file_url) {
      toast({ title: 'No download available', variant: 'destructive' });
      return;
    }
    if (asset.is_premium && !isVip) {
      toast({ title: 'VIP access required', variant: 'destructive' });
      return;
    }
    window.open(asset.file_url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-28 text-center">
          <p className="text-muted-foreground">Asset not found.</p>
          <Link to="/vip"><Button variant="link">Back to library</Button></Link>
        </div>
      </div>
    );
  }

  const locked = asset.is_premium && !isVip;

  return (
    <div className="min-h-screen bg-background">
      <AmbientBackground />
      <Navigation />

      <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/vip')} className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to library
        </Button>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {asset.video_url ? (
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe src={asset.video_url} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            ) : asset.preview_url ? (
              <img src={asset.preview_url} alt={asset.title} className="w-full rounded-xl border border-border/40" />
            ) : (
              <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10" />
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {asset.is_premium && (
                  <Badge className="bg-primary text-primary-foreground gap-1"><Crown className="w-3 h-3" /> VIP</Badge>
                )}
                <Badge variant="outline" className="capitalize">{asset.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{asset.title}</h1>
              <p className="text-muted-foreground whitespace-pre-wrap">{asset.description}</p>
            </div>

            <div className="flex flex-wrap gap-1">
              {(asset.tags ?? []).map((t: string) => (
                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleDownload} disabled={locked} className="flex-1 gap-2">
                {locked ? <><Lock className="w-4 h-4" /> VIP Only</> : <><Download className="w-4 h-4" /> Download</>}
              </Button>
              {user && (
                <Button variant="outline" size="icon" onClick={() => toggleFav.mutate()}>
                  <Heart className={fav ? 'fill-red-500 text-red-500' : ''} />
                </Button>
              )}
            </div>

            {locked && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4 text-sm text-center">
                  <p className="mb-3 text-muted-foreground">Unlock this asset and the full library.</p>
                  <a href="https://discord.gg/74hrs" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full">Join VIP on Discord</Button>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">Related assets</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r: any) => (
                <Link key={r.id} to={`/vip/${r.id}`}>
                  <Card className="overflow-hidden hover:border-primary/40 transition-all">
                    <div className="aspect-video bg-muted">
                      {r.preview_url && <img src={r.preview_url} alt={r.title} className="w-full h-full object-cover" loading="lazy" />}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-sm font-medium line-clamp-1">{r.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VipAssetDetail;
