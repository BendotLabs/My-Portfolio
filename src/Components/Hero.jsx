import evolveSigil from "../assets/evolve-sigil.png"

function Hero({ id }) {

  const sloganLines = [
    { text: "// Ideas deserve momentum",       color: "#334155", indent: "0em"   },
    { text: "// Complexity deserves clarity",  color: "#334155", indent: "1.5em" },
    { text: "// The future deserves builders", color: "#334155", indent: "3em"   },
    { text: "// You found yours",              color: "#881337", indent: "0em"   },
  ]

  return (
    <section
      id={id}
      className="min-h-screen flex flex-col px-4 md:px-10 lg:px-16 pt-16 pb-10"
    >
      {/* ── Main content ── */}
      <div className="flex-1 flex items-center">
        <div className="hero-grid w-full max-w-[1600px] mx-auto">

          {/* LEFT — Name */}
          <div className="hero-name flex flex-col items-center text-center">
            <h1
              className="leading-none tracking-tight text-slate-800"
              style={{
                fontFamily: "'Lobster', cursive",
                fontSize: "clamp(4.5rem, 10vw, 10rem)",
              }}
            >
              <span className="block">Cole</span>
              <span className="block">Burket</span>
            </h1>
            <p
              className="mt-5 uppercase tracking-widest text-rose-900 font-medium"
              style={{ fontSize: "clamp(0.6rem, 1.1vw, 0.9rem)" }}
            >
              Full-Stack Developer &amp; AI/ML Enthusiast
            </p>
          </div>

          {/* CENTER — Logo */}
          <div className="hero-logo-wrap flex justify-center items-center">
            <img
              src={evolveSigil}
              alt="Cole Burket logo"
              className="hero-logo"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* RIGHT — Slogan */}
          {/*
            Outer div centers the block horizontally in the column.
            Inner div is inline-block so it shrinks to fit its own content,
            letting the staircase indent look balanced rather than left-pinned.
          */}
          <div className="hero-slogan flex justify-center">
            <div className="slogan-inner">
              {sloganLines.map(({ text, color, indent }) => (
                <div
                  key={text}
                  className="slogan-line"
                  style={{ "--indent": indent, color }}
                >
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`

        /* ── Grid ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-areas: "name logo slogan";
          align-items: center;
          gap: 2rem;
        }
        .hero-name      { grid-area: name;   }
        .hero-logo-wrap { grid-area: logo;   }
        .hero-slogan    { grid-area: slogan; }

        /* ── Logo — bumped up ── */
        .hero-logo {
          width:     clamp(520px, 40vw, 640px);
          height:    clamp(520px, 40vw, 640px);
          max-width: 100%;
        }

        /* ── Slogan inner block ── */
        .slogan-inner {
          display: inline-block; /* shrink-wraps to content width */
        }

        /* ── Slogan lines ── */
        .slogan-line {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(1.15rem, 2.2vw, 2.1rem);
          font-weight: 500;
          letter-spacing: 0.03em;
          line-height: 3.1;
          white-space: nowrap;
          margin-left: var(--indent);
        }

        /* ── Mobile / tablet (below lg) ── */
        @media (max-width: 1200px) {
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "name"
              "logo"
              "slogan";
            gap: 2.5rem;
          }

          /* Logo: bump up on mobile too */
          .hero-logo {
            width:  clamp(280px, 80vw, 480px);
            height: clamp(280px, 80vw, 480px);
          }

          /* Slogan font scales down; em-based indents scale with it */
          .slogan-line {
            font-size: clamp(0.85rem, 4.6vw, 1.35rem);
            line-height: 2.4;
          }
        }

        /* ── Very small screens ── */
        @media (max-width: 480px) {
          .slogan-line {
            font-size: clamp(0.76rem, 4.2vw, 1.05rem);
            line-height: 2.2;
          }
        }
      `}</style>
    </section>
  )
}

export default Hero