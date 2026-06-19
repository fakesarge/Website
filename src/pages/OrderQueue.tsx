import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Package, Flame, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders, useRealtimeOrders } from '@/hooks/useOrderTracking';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const rankStyles = [
  { icon: Crown, ring: "from-yellow-400/60 to-amber-600/30", glow: "shadow-[0_0_40px_hsl(45,100%,60%,0.35)]", text: "text-yellow-400", label: "Champion" },
  { icon: Trophy, ring: "from-slate-300/60 to-slate-500/30", glow: "shadow-[0_0_30px_hsl(0,0%,80%,0.25)]", text: "text-slate-300", label: "Runner-up" },
  { icon: Medal, ring: "from-amber-700/60 to-amber-900/30", glow: "shadow-[0_0_25px_hsl(30,60%,45%,0.25)]", text: "text-amber-600", label: "Third" },
];

const statusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'in-progress': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'pending': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

const OrderQueue = () => {
  const { data: orders, isLoading } = useOrders();
  useRealtimeOrders();

  const queued = orders?.slice().sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  ) || [];

  const podium = queued.slice(0, 3);
  const rest = queued.slice(3);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navigation />

      {/* Animated ambient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], opacity: [0.08, 0.18, 0.06, 0.08] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] h-[600px] w-[600px] rounded-full bg-primary blur-[200px]"
        />
        <motion.div
          animate={{ x: [0, -50, 60, 0], y: [0, 40, -30, 0], opacity: [0.05, 0.12, 0.04, 0.05] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[15%] h-[500px] w-[500px] rounded-full bg-primary blur-[180px]"
        />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6"
            >
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Live Leaderboard</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              Order <span className="text-gradient">Queue</span>
            </motion.h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The order rankings — first in line takes the crown.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Realtime
              </div>
              <span>·</span>
              <span>{queued.length} contenders</span>
            </div>
          </div>
        </section>

        {/* Podium */}
        {podium.length > 0 && (
          <section className="container px-4 py-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Reorder: 2nd, 1st, 3rd for podium feel on desktop */}
              {[1, 0, 2].map((rankIdx, displayIdx) => {
                const order = podium[rankIdx];
                if (!order) return <div key={rankIdx} />;
                const style = rankStyles[rankIdx];
                const Icon = style.icon;
                const heights = ["md:mt-12", "", "md:mt-20"];
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: displayIdx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`relative ${heights[displayIdx]}`}
                  >
                    <div className={`relative rounded-3xl border border-border/40 bg-gradient-to-b ${style.ring} p-[1px] ${style.glow}`}>
                      <div className="rounded-3xl bg-card/90 backdrop-blur-xl p-6 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-widest ${style.text}`}>
                            <Icon className="h-4 w-4" />
                            {style.label}
                          </span>
                          <span className={`text-3xl font-black ${style.text}`}>#{rankIdx + 1}</span>
                        </div>

                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3 + displayIdx, repeat: Infinity, ease: "easeInOut" }}
                          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${style.ring}`}
                        >
                          <Package className={`h-7 w-7 ${style.text}`} />
                        </motion.div>

                        <h3 className="text-lg font-bold text-center truncate">{order.order_name}</h3>
                        <p className="text-xs font-mono text-muted-foreground text-center mt-1">{order.order_code}</p>

                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{order.customer_name}</span>
                          <span className="font-semibold text-foreground">${order.price}</span>
                        </div>

                        <Badge className={`mt-4 w-full justify-center border ${statusColor(order.status)}`} variant="outline">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Rest of leaderboard */}
        <section className="container px-4 py-12">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <Card className="glass border-white/10">
                <CardContent className="py-12 text-center">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Loading rankings...</p>
                </CardContent>
              </Card>
            ) : queued.length === 0 ? (
              <Card className="glass border-white/10">
                <CardContent className="py-16 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Queue is Empty</h3>
                  <p className="text-muted-foreground">Be the first on the leaderboard.</p>
                </CardContent>
              </Card>
            ) : rest.length > 0 && (
              <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/30 bg-background/30">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">Order</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Service</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>
                {rest.map((order, index) => {
                  const rank = index + 4;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.04 }}
                      whileHover={{ x: 4, backgroundColor: "hsl(var(--accent) / 0.4)" }}
                      className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border/20 last:border-0 group cursor-default transition-colors"
                    >
                      <div className="col-span-1">
                        <span className="text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                          {rank}
                        </span>
                      </div>
                      <div className="col-span-4">
                        <div className="font-semibold text-sm truncate">{order.order_name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{order.order_code}</div>
                      </div>
                      <div className="col-span-3 text-sm text-foreground/85 truncate">{order.customer_name}</div>
                      <div className="col-span-2 text-xs text-muted-foreground truncate">{order.service}</div>
                      <div className="col-span-1 text-right font-semibold text-sm">${order.price}</div>
                      <div className="col-span-1 text-right">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase ${statusColor(order.status)}`}>
                          {order.status.slice(0, 4)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="container px-4 py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: TrendingUp, label: "Total Orders", value: queued.length, color: "text-primary" },
              { icon: Zap, label: "In Progress", value: queued.filter(o => o.status === 'in-progress').length, color: "text-blue-400" },
              { icon: Clock, label: "Pending", value: queued.filter(o => o.status === 'pending').length, color: "text-yellow-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-4xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderQueue;
