import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Lock, Unlock, Trash2 } from "lucide-react";

interface CalendarDay {
  date: string;
  is_blocked: boolean;
  max_slots: number;
  note: string | null;
}

export const AdminCalendar = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState("");

  const { data: days = [] } = useQuery({
    queryKey: ["calendar_days"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calendar_days")
        .select("*")
        .order("date");
      if (error) throw error;
      return (data || []) as unknown as CalendarDay[];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings-cal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("id,ticket_code,customer_name,service,booking_date,channel,status,estimated_price_min,estimated_price_max")
        .order("booking_date");
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const key = selected ? format(selected, "yyyy-MM-dd") : "";
  const day = days.find((d) => d.date === key);
  const dayBookings = bookings.filter((b) => b.booking_date === key);

  const toggleBlock = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const payload = {
        date: key,
        is_blocked: !(day?.is_blocked ?? false),
        max_slots: day?.max_slots ?? 3,
        note: note || day?.note || null,
      };
      const { error } = await supabase
        .from("calendar_days")
        .upsert(payload as any, { onConflict: "date" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar_days"] });
      toast({ title: "Calendar updated" });
    },
    onError: (e: any) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const clearDay = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await supabase.from("calendar_days").delete().eq("date", key);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar_days"] });
      toast({ title: "Day reset" });
    },
  });

  const blockedDates = days.filter((d) => d.is_blocked).map((d) => new Date(d.date));

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ blocked: blockedDates }}
          modifiersClassNames={{ blocked: "bg-red-500/20 text-red-400 line-through" }}
          className="pointer-events-auto"
        />
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {selected ? format(selected, "PPPP") : "Pick a day"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={day?.is_blocked ? "destructive" : "outline"}>
                {day?.is_blocked ? "Blocked" : "Available"}
              </Badge>
              <Badge variant="outline">{dayBookings.length} booking(s)</Badge>
            </div>
            <Input
              placeholder="Optional note (e.g. 'On vacation')"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => toggleBlock.mutate()}
                variant={day?.is_blocked ? "outline" : "destructive"}
                className="gap-2"
              >
                {day?.is_blocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {day?.is_blocked ? "Unblock" : "Block"} this day
              </Button>
              {day && (
                <Button variant="ghost" onClick={() => clearDay.mutate()} className="gap-2">
                  <Trash2 className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings on this day</CardTitle>
          </CardHeader>
          <CardContent>
            {dayBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings scheduled.</p>
            ) : (
              <ul className="space-y-3">
                {dayBookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-secondary/20 px-4 py-3"
                  >
                    <div>
                      <div className="font-mono text-xs text-primary">{b.ticket_code}</div>
                      <div className="text-sm font-medium">{b.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{b.service}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {b.channel}
                      </Badge>
                      <Badge>{b.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendar;
