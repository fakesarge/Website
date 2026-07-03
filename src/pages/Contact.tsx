import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, MessageSquare, Globe, ArrowRight, ArrowLeft, Sparkles, Copy, CalendarIcon, Loader2 } from "lucide-react";
import { sendActivityWebhook } from "@/utils/activityWebhook";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

interface ServiceRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_min: number;
  price_max: number;
}

const Contact = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [channel, setChannel] = useState<"website" | "discord" | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ ticket: string; channel: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: svc } = await supabase
        .from("services")
        .select("id,name,category,description,price_min,price_max")
        .eq("is_active", true)
        .order("sort_order");
      setServices((svc as any) || []);

      const { data: blocks } = await supabase
        .from("calendar_days")
        .select("date,is_blocked")
        .eq("is_blocked", true);
      setBlockedDates(((blocks as any) || []).map((b: any) => b.date));
    })();
  }, []);

  const chosen = useMemo(
    () => services.filter((s) => selected.includes(s.id)),
    [services, selected]
  );
  const priceMin = chosen.reduce((a, s) => a + Number(s.price_min), 0);
  const priceMax = chosen.reduce((a, s) => a + Number(s.price_max), 0);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const isDateDisabled = (d: Date) => {
    if (d < new Date(new Date().setHours(0, 0, 0, 0))) return true;
    const key = format(d, "yyyy-MM-dd");
    return blockedDates.includes(key);
  };

  const submit = async (choice: "website" | "discord") => {
    if (!user) {
      toast({ title: "Please log in", description: "Login with Discord to book.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!date || chosen.length === 0) return;

    setChannel(choice);
    setSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        customer_name: profile?.username || "Unknown",
        customer_email: profile?.email || null,
        discord_handle: profile?.username || null,
        service: chosen.map((s) => s.name).join(", "),
        category: chosen[0]?.category || "custom",
        addons: chosen.map((s) => ({ id: s.id, name: s.name })),
        description,
        estimated_price_min: priceMin,
        estimated_price_max: priceMax,
        booking_date: format(date, "yyyy-MM-dd"),
        channel: choice,
        status: "pending" as const,
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert(payload as any)
        .select("ticket_code")
        .single();

      if (error) throw error;

      const ticket = (data as any).ticket_code as string;
      setConfirmation({ ticket, channel: choice });

      sendActivityWebhook("booking_created", {
        ticket,
        user: profile?.username,
        services: chosen.map((s) => s.name),
        date: format(date, "PPP"),
        channel: choice,
        estimate: `$${priceMin}–$${priceMax}`,
      });
    } catch (e: any) {
      toast({ title: "Booking failed", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const canNext =
    (step === 1 && chosen.length > 0) ||
    (step === 2 && !!date && description.trim().length > 5);

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <AmbientBackground />

      <main className="pt-32 pb-32 relative z-10">
        <section className="container mx-auto max-w-5xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-16"
          >
            <div className="mx-auto mb-6 h-[2px] w-12 bg-primary" />
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Book<span className="text-primary">.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Three steps. Pick your services, pick a day, pick how we chat.
            </p>
          </motion.div>

          {/* Stepper */}
          {!confirmation && (
            <div className="mx-auto mb-12 flex max-w-md items-center justify-between">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-1 items-center">
                  <div
                    className={`h-9 w-9 rounded-full border flex items-center justify-center text-xs font-semibold transition-all ${
                      step >= n
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {step > n ? <Check className="h-4 w-4" /> : n}
                  </div>
                  {n < 3 && (
                    <div className={`h-[2px] flex-1 mx-2 ${step > n ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {confirmation ? (
              <ConfirmationCard key="conf" data={confirmation} onReset={() => { setConfirmation(null); setStep(1); setSelected([]); setDate(undefined); setDescription(""); }} />
            ) : step === 1 ? (
              <StepPanel key="s1" title="What do you need?" subtitle="Select one or more services.">
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map((s) => {
                    const active = selected.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggle(s.id)}
                        className={`text-left rounded-2xl border p-5 transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-[0_0_28px_hsl(var(--accent-glow)/0.25)]"
                            : "border-border/60 bg-secondary/20 hover:border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
                          </div>
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                            {active && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                        </div>
                        <div className="mt-4 text-sm font-mono text-primary">
                          ${s.price_min} – ${s.price_max}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {chosen.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-border/60 bg-secondary/30 p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated range</div>
                      <div className="mt-1 text-2xl font-bold font-mono">
                        ${priceMin.toLocaleString()} – ${priceMax.toLocaleString()}
                      </div>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                )}
              </StepPanel>
            ) : step === 2 ? (
              <StepPanel key="s2" title="Pick a day" subtitle="Choose when you'd like the work slotted in.">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 pointer-events-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={isDateDisabled}
                      className="pointer-events-auto"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">
                        Selected date
                      </label>
                      <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm">
                          {date ? format(date, "PPP") : "No date selected"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground">
                        Project details
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your project, references, deadlines, brand vibe…"
                        rows={8}
                        maxLength={2000}
                        className="mt-2 resize-none bg-secondary/20"
                      />
                      <div className="mt-1 text-[10px] text-muted-foreground text-right">
                        {description.length}/2000
                      </div>
                    </div>
                  </div>
                </div>
              </StepPanel>
            ) : (
              <StepPanel key="s3" title="Where do we chat?" subtitle="Continue the conversation on the site or Discord.">
                <div className="grid gap-5 md:grid-cols-2">
                  <ChannelCard
                    icon={<Globe className="h-6 w-6" />}
                    title="Continue on Website"
                    desc="Get a private ticket inside your dashboard tied to your booking day."
                    onClick={() => submit("website")}
                    disabled={submitting}
                  />
                  <ChannelCard
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="Continue on Discord"
                    desc="Get a ticket code — send it in Discord and we'll pick up from there."
                    onClick={() => submit("discord")}
                    disabled={submitting}
                    accent
                  />
                </div>
                {submitting && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Locking your slot…
                  </div>
                )}
              </StepPanel>
            )}
          </AnimatePresence>

          {/* Nav */}
          {!confirmation && step < 3 && (
            <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext}
                className="gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

const StepPanel = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.5, ease }}
    className="mx-auto max-w-3xl"
  >
    <div className="mb-6 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
    {children}
  </motion.div>
);

const ChannelCard = ({
  icon,
  title,
  desc,
  onClick,
  disabled,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`text-left rounded-2xl border p-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
      accent
        ? "border-primary/50 bg-primary/5 hover:shadow-[0_0_32px_hsl(var(--accent-glow)/0.35)]"
        : "border-border/60 bg-secondary/20 hover:border-border"
    }`}
  >
    <div className="mb-4 h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div className="font-semibold text-lg">{title}</div>
    <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
  </button>
);

const ConfirmationCard = ({
  data,
  onReset,
}: {
  data: { ticket: string; channel: string };
  onReset: () => void;
}) => {
  const { toast } = useToast();
  const copy = () => {
    navigator.clipboard.writeText(data.ticket);
    toast({ title: "Copied", description: "Ticket code copied to clipboard." });
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease }}
      className="mx-auto max-w-xl rounded-3xl border border-primary/40 bg-secondary/20 p-10 text-center shadow-[0_0_48px_hsl(var(--accent-glow)/0.25)]"
    >
      <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center">
        <Check className="h-7 w-7 text-primary" />
      </div>
      <h2 className="text-3xl font-bold">Booking Locked In</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {data.channel === "discord"
          ? "Send this ticket code in Discord so we can find your booking."
          : "We'll follow up in your dashboard. Save this code just in case."}
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/60 px-5 py-4 font-mono text-lg">
        <span className="text-primary">{data.ticket}</span>
        <button onClick={copy} className="ml-2 text-muted-foreground hover:text-foreground">
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {data.channel === "discord" ? (
          <a
            href="https://discord.gg/74hrs"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto"
          >
            <Button className="w-full gap-2">
              <MessageSquare className="h-4 w-4" /> Open Discord
            </Button>
          </a>
        ) : (
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <Button variant="ghost" onClick={onReset}>
          Book another
        </Button>
      </div>
    </motion.div>
  );
};

export default Contact;
