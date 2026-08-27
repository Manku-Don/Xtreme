export default function Logo({ className = "", markOnly = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden="true">
        <g stroke="var(--color-chalk)" strokeWidth="5" strokeLinecap="round">
          <line x1="14" y1="14" x2="50" y2="50" />
          <line x1="50" y1="14" x2="14" y2="50" />
        </g>
        <g fill="var(--color-plate-red)">
          <rect x="9" y="9" width="7" height="14" rx="2" transform="rotate(45 12.5 16)" />
          <rect x="48" y="41" width="7" height="14" rx="2" transform="rotate(45 51.5 48)" />
          <rect x="9" y="41" width="7" height="14" rx="2" transform="rotate(-45 12.5 48)" />
          <rect x="48" y="9" width="7" height="14" rx="2" transform="rotate(-45 51.5 16)" />
        </g>
      </svg>
      {!markOnly && (
        <span className="text-stencil text-lg font-bold leading-none text-chalk">
          Xtreme<span className="text-plate-red">.</span>
          <span className="block text-[0.6rem] font-medium tracking-[0.35em] text-steel">
            FITNESS GYM
          </span>
        </span>
      )}
    </div>
  );
}
