import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { gfxProjects } from "@/config/gfxData";
import Footer from "@/components/Footer";

/* ------------------------------------------------------------------ */
/* Boot loader — pixel wordmark, progress bar, VCR percentage counter  */
/* ------------------------------------------------------------------ */
const Boot = ({ onDone }: { onDone: () => void }) => {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let v = 0;
    const id = window.setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9));
      setPct(v);
      if (v >= 100) {
        window.clearInterval(id);
        setLeaving(true);
        window.setTimeout(onDone, 550);
      }
    }, 70);
    return () => window.clearInterval(id);
  }, [onDone]);

  return (
    <div className={`kif-boot ${leaving ? "is-done" : ""}`} role="status" aria-label="Loading">
      <div className="kif-boot__word">#74hrs</div>
      <div className="kif-boot__bar">
        <span style={{ right: `${100 - pct}%` }} />
      </div>
      <div className="kif-boot__pct">{String(pct).padStart(3, "0")}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Slow-spinning cut-out artwork                                       */
/* ------------------------------------------------------------------ */
const El = ({
  src,
  className,
  duration = 140,
  reverse = false,
}: {
  src: string;
  className?: string;
  duration?: number;
  reverse?: boolean;
}) => (
  <motion.img
    src={src}
    alt=""
    aria-hidden
    draggable={false}
    className={`kif-el ${className ?? ""}`}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  />
);

/* ------------------------------------------------------------------ */
/* Homepage                                                            */
/* ------------------------------------------------------------------ */
const KifHome = ({ booted }: { booted: boolean }) => {
  const works = gfxProjects.slice(0, 8);
  const [idx, setIdx] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const next = useCallback(() => setIdx((i) => (i + 1) % works.length), [works.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + works.length) % works.length), [works.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.35;
    if (music) a.play().catch(() => setMusic(false));
    else a.pause();
  }, [music]);

  const work = works[idx];

  return (
    <div className={`kif ${inverted ? "is-invert" : ""}`}>
      {booted && <Boot onDone={() => {}} />}
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="auto" />

      {/* fixed controls */}
      <div className="kif-ctl">
        <button className="kif-ctl__b" aria-pressed={inverted} onClick={() => setInverted((v) => !v)}>
          invert
        </button>
        <button className="kif-ctl__b" aria-pressed={music} onClick={() => setMusic((v) => !v)}>
          music on/off
        </button>
      </div>

      {/* 01 · FRONT */}
      <section className="kif-sec kif-hero">
        <El src="/images/kif/star-a.png" className="kif-el--star-a" duration={128} />
        <El src="/images/kif/star-b.png" className="kif-el--star-b" duration={173} reverse />
        <El src="/images/kif/dice.png" className="kif-el--dice" duration={220} />
        <h1 className="kif-lay kif-lay--big">74</h1>
        <p className="kif-lay kif-lay--small" aria-hidden>
          hrs.
        </p>
        <a className="kif-cue" href="#work" aria-label="Scroll to work">
          <i />
        </a>
      </section>

      {/* 02 · WORK */}
      <section className="kif-sec kif-work" id="work">
        <El src="/images/kif/flower.png" className="kif-el--flower" duration={190} reverse />
        <div className="kif-work__stage">
          <motion.img
            key={work.id}
            src={`/${work.image}`}
            alt={work.title}
            className="kif-work__img"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="kif-work__meta">
            <span className="kif-work__title">{work.title}</span>
            <span className="kif-work__tag">{work.tagline}</span>
          </div>
        </div>
        <div className="kif-rail" aria-live="polite">
          <button className="kif-rail__nav" onClick={prev} aria-label="Previous work">
            ←
          </button>
          <b>{String(idx + 1).padStart(2, "0")}</b>
          <i>/{String(works.length).padStart(2, "0")}</i>
          <button className="kif-rail__nav" onClick={next} aria-label="Next work">
            →
          </button>
          <Link className="kif-rail__open" to="/gfx" aria-label="Open portfolio">
            ↗
          </Link>
        </div>
        <div className="kif-keys" aria-hidden>
          <kbd>←</kbd>
          <kbd>→</kbd>
        </div>
      </section>

      {/* 03 · ABOUT */}
      <section className="kif-sec kif-about">
        <El src="/images/kif/cd-a.png" className="kif-el--cd-a" duration={150} />
        <El src="/images/kif/cd-b.png" className="kif-el--cd-b" duration={200} reverse />
        <h2 className="kif-lay kif-lay--abouth">About</h2>
        <p className="kif-lay kif-lay--aboutsub" aria-hidden>
          us.
        </p>
        <div className="kif-lay kif-bio">
          <p>
            We're 74hrs — a creative studio crafting premium Blender animations, loading screens and
            graphics for gaming communities.
          </p>
          <p>
            What started as a passion for motion design grew into a studio trusted by 2,400+
            creators. Every frame is built with intention — cinematic lighting, clean typography and
            branding that makes your community impossible to ignore.
          </p>
        </div>
      </section>

      {/* 04 · CONTACT */}
      <section className="kif-sec kif-contact">
        <El src="/images/kif/cards.png" className="kif-el--cards" duration={210} />
        <h2 className="kif-lay kif-lay--contact">work</h2>
        <p className="kif-lay kif-lay--contactsub" aria-hidden>
          with us.
        </p>
        <div className="kif-lay kif-links">
          <a href="https://discord.gg/74hrs" target="_blank" rel="noreferrer">
            discord ↗
          </a>
          <Link to="/shop">shop ↗</Link>
          <Link to="/queue">live queue ↗</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KifHome;
