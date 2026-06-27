import evolveSigil from "../assets/evolve-sigil.png"

function Footer() {
  return (
    <footer className="w-full px-6 pt-16 pb-10 flex flex-col items-center text-center gap-[0.8rem]">

      {/* Sigil */}
      <img
        src={evolveSigil}
        alt="Cole Burket logo"
        className="w-32 h-32 object-contain -mb-6"
      />

      {/* Name */}
      <p
        className="text-3xl font-light tracking-tight text-slate-600"
        style={{ fontFamily: "'Lobster', cursive" }}
      >
        Cole Burket
      </p>

      {/* Quote */}
      <p
        className="italic text-slate-400 max-w-xs leading-relaxed mt-0.5"
        style={{ fontFamily: "'Lobster', cursive", fontSize: "1.2rem" }}
      >
        "Automation is the companion of curiosity."
      </p>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/cole-burket-9a0207413/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="mt-1.5 w-[30px] h-[30px] rounded-full border border-slate-500 text-slate-500 flex items-center justify-center hover:bg-slate-700 hover:border-slate-700 hover:text-orange-200 transition-all duration-200"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z"/>
        </svg>
      </a>

      {/* Copyright */}
      <p className="mt-2 font-mono text-xs tracking-widest uppercase text-rose-900/50">
        © 2026 Cole Burket / Bendot Labs
      </p>

    </footer>
  )
}

export default Footer