import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPlaceholderProps {
  label: string;
  format?: string;
  className?: string;
}

const MediaPlaceholder = ({ label, format = "16:9", className }: MediaPlaceholderProps) => (
  <div
    className={cn(
      "group relative flex min-h-40 items-center justify-center overflow-hidden border border-dashed border-foreground/25 bg-secondary/60",
      className,
    )}
  >
    <div className="absolute inset-0 creative-grid opacity-30" />
    <div className="relative z-10 flex flex-col items-center gap-3 text-center">
      <span className="flex h-11 w-11 items-center justify-center border border-foreground/20 bg-background/70 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <ImagePlus className="h-5 w-5 text-foreground" />
      </span>
      <div>
        <p className="font-display text-xs font-bold uppercase text-foreground">{label}</p>
        <p className="mt-1 font-mono text-[9px] uppercase text-muted-foreground">Replace image · {format}</p>
      </div>
    </div>
  </div>
);

export default MediaPlaceholder;