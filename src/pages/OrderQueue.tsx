import { motion } from 'framer-motion';
import { Package, Clock, Zap, Activity, Hourglass } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOrders, useRealtimeOrders } from '@/hooks/useOrderTracking';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const statusMeta = (status: string) => {
  switch (status) {
    case 'in-progress':
      return { label: 'In Progress', dot: 'bg-blue-400', text: 'text-blue-400', ring: 'border-blue-500/30 bg-blue-500/10' };
    case 'pending':
      return { label: 'Pending', dot: 'bg-yellow-400', text: 'text-yellow-400', ring: 'border-yellow-500/30 bg-yellow-500/10' };
    default:
      return { label: status, dot: 'bg-muted-foreground', text: 'text-muted-foreground', ring: 'border-border/40 bg-card/40' };
  }
};

const formatWaiting = (createdAt: string) => {
  const ms = Date.now() - new Date(createdAt).getTime();
  const h = Math.floor(ms / 3_600_000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h`;
  const m = Math.max(1, Math.floor(ms / 60_000));
  return `${m}m`;
};

const OrderQueue = () => {
  const { data: orders, isLoading } = useOrders();
  useRealtimeOrders();

  // Hide completed orders from the public queue
  const active = (orders || []).filter((o) => o.status !== 'completed');
  const queued = active.slice().sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const inProgress = queued.filter((o) => o.status === 'in-progress').length;
  const pending = queued.filter((o) => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navigation />

      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], opacity: [0.06, 0.14, 0.05, 0.06] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[12%] left-[18%] h-[560px] w-[560px] rounded-full blur-[200px]"
          style={{ background: 'hsl(var(--accent-glow) / 0.45)' }}
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 40, -30, 0], opacity: [0.04, 0.1, 0.03, 0.04] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[12%] h-[460px] w-[460px] rounded-full bg-primary blur-[180px]"
        />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="container px-4 pt-10 pb-14">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1 mb-6 backdrop-blur-md"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                Live · Realtime feed
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-7xl font-bold tracking-tight"
            >
              Order <span className="text-gradient">Queue</span>
            </motion.h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
              A live look at every order currently in production. Completed work is moved to the archive.
            </p>
          </div>
        </section>

        {/* Stats strip */}
        <section className="container px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: Activity, label: 'Active in queue', value: queued.length },
              { icon: Zap, label: 'In progress', value: inProgress },
              { icon: Hourglass, label: 'Pending', value: pending },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-5"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-glow)/0.4)] to-transparent" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="h-4 w-4 text-[hsl(var(--accent-glow))]" />
                </div>
                <p className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Queue list */}
        <section className="container px-4 pt-14">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
                <CardContent className="py-16 text-center">
                  <Package className="w-10 h-10 mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Loading queue…</p>
                </CardContent>
              </Card>
            ) : queued.length === 0 ? (
              <Card className="border-border/40 bg-card/40 backdrop-blur-xl">
                <CardContent className="py-20 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background/40">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">The queue is clear</h3>
                  <p className="text-muted-foreground">No active orders right now. Be the first in line.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden">
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-glow)/0.5)] to-transparent" />

                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground border-b border-border/40">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Order</div>
                  <div className="col-span-2">Service</div>
                  <div className="col-span-2">Waiting</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Value</div>
                </div>

                {queued.map((order, index) => {
                  const meta = statusMeta(order.status);
                  const position = index + 1;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4), ease: [0.25, 0.46, 0.45, 0.94] }}
                      whileHover={{ backgroundColor: 'hsl(var(--accent) / 0.35)' }}
                      className="relative grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-border/25 last:border-0 group transition-colors"
                    >
                      {/* Subtle active highlight for #1 */}
                      {position === 1 && (
                        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-[hsl(var(--accent-glow))] shadow-[0_0_12px_hsl(var(--accent-glow))]" />
                      )}

                      <div className="col-span-2 md:col-span-1 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden md:inline">No.</span>
                        <span className="text-xl font-bold tabular-nums text-foreground">
                          {String(position).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="col-span-10 md:col-span-4 min-w-0">
                        <div className="font-semibold text-sm truncate text-foreground">{order.order_name}</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                          {order.order_code}
                          {order.customer_name && (
                            <span className="ml-2 normal-case text-muted-foreground/80">· {order.customer_name}</span>
                          )}
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 text-xs text-muted-foreground truncate">
                        {order.service}
                      </div>

                      <div className="col-span-6 md:col-span-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="tabular-nums">{formatWaiting(order.created_at)}</span>
                      </div>

                      <div className="col-span-6 md:col-span-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${meta.ring} ${meta.text}`}>
                          <span className={`relative flex h-1.5 w-1.5`}>
                            {order.status === 'in-progress' && (
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${meta.dot}`} />
                            )}
                            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          </span>
                          {meta.label}
                        </span>
                      </div>

                      <div className="col-span-6 md:col-span-1 text-right font-semibold text-sm tabular-nums text-foreground">
                        ${order.price}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OrderQueue;
