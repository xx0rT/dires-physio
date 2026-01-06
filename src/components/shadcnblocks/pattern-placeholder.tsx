export const PatternPlaceholder = () => {
  return (
    <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-muted-foreground/10 [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={40}
          height={40}
          patternUnits="userSpaceOnUse"
          x="50%"
          y={-1}
        >
          <path d="M.5 40V.5H40" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
    </svg>
  );
};
