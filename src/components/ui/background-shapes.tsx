export function BackgroundShapes() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute -top-40 -right-40 w-[600px] h-[600px] opacity-30"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="300" fill="url(#gradient1)" />
      </svg>

      <svg
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-25"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="250" rx="250" ry="280" fill="url(#gradient2)" />
      </svg>

      <svg
        className="absolute top-1/4 -right-20 w-[300px] h-[300px] opacity-20"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="gradient3">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="150" r="150" fill="url(#gradient3)" />
      </svg>

      <svg
        className="absolute bottom-1/3 -left-20 w-[250px] h-[250px] opacity-15"
        viewBox="0 0 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <ellipse cx="125" cy="125" rx="125" ry="150" fill="url(#gradient4)" />
      </svg>
    </div>
  )
}

export function BlobBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blobGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <path
          d="M400,50 C550,50 650,150 700,300 C750,450 700,600 550,650 C400,700 250,650 200,500 C150,350 250,50 400,50 Z"
          fill="url(#blobGradient1)"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-[700px] h-[700px] opacity-20"
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blobGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path
          d="M350,650 C200,650 100,550 50,400 C0,250 50,100 200,50 C350,0 500,50 550,200 C600,350 500,650 350,650 Z"
          fill="url(#blobGradient2)"
        />
      </svg>

      <svg
        className="absolute top-1/3 left-1/4 w-[200px] h-[200px] opacity-10"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="100" fill="#3b82f6" />
      </svg>

      <svg
        className="absolute bottom-1/4 right-1/3 w-[150px] h-[150px] opacity-10"
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="75" cy="75" r="75" fill="#06b6d4" />
      </svg>
    </div>
  )
}

export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute top-0 left-0 w-full h-[400px] opacity-10"
        viewBox="0 0 1440 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C240,200 480,50 720,100 C960,150 1200,80 1440,120 L1440,0 L0,0 Z"
          fill="url(#waveGradient1)"
        />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-full h-[350px] opacity-10"
        viewBox="0 0 1440 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
        <path
          d="M0,250 C240,150 480,300 720,250 C960,200 1200,270 1440,230 L1440,350 L0,350 Z"
          fill="url(#waveGradient2)"
        />
      </svg>

      <svg
        className="absolute top-1/2 -right-40 w-[400px] h-[400px] opacity-15 transform -translate-y-1/2"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="circleGradient">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="200" fill="url(#circleGradient)" />
      </svg>
    </div>
  )
}

export function MinimalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-br from-background via-background to-muted/20">
      <svg
        className="absolute -top-60 -right-60 w-[700px] h-[700px] opacity-[0.15]"
        viewBox="0 0 700 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="minimalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="350" cy="350" r="350" fill="url(#minimalGrad1)" />
      </svg>

      <svg
        className="absolute -bottom-60 -left-60 w-[600px] h-[600px] opacity-[0.12]"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="minimalGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="300" cy="300" r="300" fill="url(#minimalGrad2)" />
      </svg>

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
    </div>
  )
}
