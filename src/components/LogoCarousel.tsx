import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const totalUsers = "1,250,000+";
const totalCommunities = "60+";

const communities = [
  {
    name: "Rety Designs",
    members: "2,097 members",
    avatar:
      "https://cdn.discordapp.com/icons/1162965611626893342/542307fab84286f76937863a23a0d570.webp?size=1024",
    verified: true,
  },
  {
    name: "Yugiogg",
    members: "76,456 members",
    avatar:
      "https://cdn.discordapp.com/icons/1370141394051661876/a_9b62e9c92cbb18a15f3bf72c9b21cac0.webp?size=1024&animated=true",
    verified: true,
  },
  {
    name: "Club44",
    members: "7,347 members",
    avatar:
      "https://cdn.discordapp.com/icons/1394826649249382561/3ee6c90f169bcc5a783c153aeefbbfe4.webp?size=1024",
    verified: true,
  },
  {
    name: "Inspire RP",
    members: "65,105 members",
    avatar:
      "https://cdn.discordapp.com/icons/967948524702552125/cae60ca62f856ddfa1d3bf1a43d5cf27.webp?size=1024",
    verified: true,
  },
  {
    name: "Hone",
    members: "62,221 members",
    avatar:
      "https://cdn.discordapp.com/icons/753315331564371999/a_41ad6dd6851a63efb81b82461e8e99db.webp?size=60",
    verified: true,
  },
  {
    name: "420 Services",
    members: "72,940 members",
    avatar:
      "https://cdn.discordapp.com/icons/1432531313591582802/8e5f62696bafe4e007f41352f1be5ae2.webp?size=1024",
    verified: false,
  },
  {
    name: "Crosshair GG",
    members: "3,000 members",
    avatar:
      "https://cdn.discordapp.com/icons/1508074493137125396/19549d53ea227c5581bc4687a8f10d46.webp?size=1024",
    verified: true,
  },
];

const extendedCommunities = [
  ...communities,
  ...communities,
  ...communities,
];

const LogoCarousel = () => {
  return (
    <div className="w-full py-24 mt-24 relative">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="text-center text-base md:text-lg text-muted-foreground mb-12"
      >
        Enhancing visuals for{" "}
        <span className="font-semibold text-foreground">
          {totalUsers}
        </span>{" "}
        users across{" "}
        <span className="font-semibold text-foreground">
          {totalCommunities}
        </span>{" "}
        communities
      </motion.p>

      <div className="w-full overflow-hidden relative">
        {/* Strong blurred edges */}
        <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-background via-background/95 to-transparent z-30 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-background via-background/95 to-transparent z-30 pointer-events-none" />

        <div className="absolute left-0 top-0 bottom-0 w-40 backdrop-blur-3xl z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 backdrop-blur-3xl z-20 pointer-events-none" />

        <motion.div
          className="flex items-center"
          initial={{ x: "0%" }}
          animate={{ x: "-33.3333%" }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: "fit-content" }}
        >
          {extendedCommunities.map((c, index) => (
            <div
              key={`community-${index}`}
              className="flex items-center gap-4 px-8 py-4 mx-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md shadow-lg shrink-0"
            >
              <Avatar className="h-16 w-16 ring-2 ring-white/10">
                <AvatarImage
                  src={c.avatar}
                  className="object-cover"
                />
                <AvatarFallback>
                  {c.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base md:text-lg font-semibold text-foreground whitespace-nowrap">
                    {c.name}
                  </span>

                  {c.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#23a55a] shrink-0" />
                  )}
                </div>

                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {c.members}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LogoCarousel;

