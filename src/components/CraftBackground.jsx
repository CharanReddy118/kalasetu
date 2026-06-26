// A faint, repeating block-print textile pattern — like hand-printed fabric.
function Flower({ x, y, color }) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <g
      transform={`translate(${x},${y})`}
      stroke={color}
      strokeWidth="1.1"
      fill="none"
    >
      {petals.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0,0 C -6,-10 -6,-20 0,-26 C 6,-20 6,-10 0,0 Z"
        />
      ))}
      <circle r="3" />
    </g>
  );
}

function Sprig({ x, y, color }) {
  return (
    <g transform={`translate(${x},${y})`} stroke={color} strokeWidth="1" fill="none">
      <circle r="2.5" />
      <path d="M0,-4 C 5,-9 9,-5 4,0" />
      <path d="M0,4 C -5,9 -9,5 -4,0" />
    </g>
  );
}

function CraftBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-kala-cream pointer-events-none">
      {/* soft warm glow for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 18%, rgba(200,107,42,0.10), transparent 20%), radial-gradient(circle at 85% 95%, rgba(46,107,78,0.07), transparent 50%)",
        }}
      />

      {/* the repeating textile motif — change opacity (0.07) to tune strength */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
        <defs>
          <pattern
            id="blockprint"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <Flower x={35} y={35} color="#C86B2A" />
            <Flower x={105} y={105} color="#C86B2A" />
            <Sprig x={105} y={35} color="#2E6B4E" />
            <Sprig x={35} y={105} color="#2E6B4E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blockprint)" />
      </svg>
    </div>
  );
}

export default CraftBackground;