import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, MessageSquare, Globe } from "lucide-react";

export const AdminBookings = () => {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Updated" });
    },
  });

  return (
    <div className="space-y-4">
      {bookings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No bookings yet.
          </CardContent>
        </Card>
      )}
      {bookings.map((b) => (
        <Card key={b.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-base">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-primary">{b.ticket_code}</span>
                <span>{b.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  {b.channel === "discord" ? <MessageSquare className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                  {b.channel}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {b.booking_date ? format(new Date(b.booking_date), "PP") : "—"}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Service: </span>{b.service}
            </div>
            {b.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">{b.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-mono">
                ${Number(b.estimated_price_min || 0)}–${Number(b.estimated_price_max || 0)}
              </div>
              <Select
                value={b.status}
                onValueChange={(v) => updateStatus.mutate({ id: b.id, status: v })}
              >
                <SelectTrigger className="w-[160px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminBookings;
