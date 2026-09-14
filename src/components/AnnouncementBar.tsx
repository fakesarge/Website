const items = [
  "NEW · 74HRS STORE IS LIVE · GET 30% OFF YOUR FIRST ORDER",
  "PREMIUM 3D ASSETS · MOTION · WEB",
  "ONE-TIME PAYMENT · LIFETIME UPDATES",
  "TRUSTED BY 2,400+ CREATORS",
];

const AnnouncementBar = () => {
  const row = [...items, ...items, ...items];
  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] overflow-hidden border-b border-border/70 bg-foreground text-background"
    >
      <div className="flex animate-marquee whitespace-nowrap py-1.5 text-[10px] font-bold uppercase">
        {row.map((t, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-3">
            <span className="h-1 w-1 bg-background" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
