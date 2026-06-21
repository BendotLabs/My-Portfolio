function GameGridLogo() {
  return (
    <div className="w-full flex items-center justify-center" style={{ containerType: "inline-size" }}>
      <div className="flex flex-col items-center">
        <span
          className="text-slate-700"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(3.5rem, 11cqw, 6rem)",
            lineHeight: 1.15,
            letterSpacing: "0.02em",
          }}
        >
          GAME
        </span>
        <span
          className="text-orange-500"
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(3.5rem, 11cqw, 6rem)",
            lineHeight: 1.15,
            letterSpacing: "0.02em",
          }}
        >
          GRID
        </span>
      </div>
    </div>
  )
}

export default GameGridLogo