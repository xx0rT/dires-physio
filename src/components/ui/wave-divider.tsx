interface WaveDividerProps {
  variant?: 1 | 2
  flip?: boolean
  position?: 'top' | 'bottom'
  className?: string
}

export function WaveDivider({ variant = 1, flip = false, position = 'top', className = '' }: WaveDividerProps) {
  const waveSrc = variant === 1 ? '/wave-layer-1.svg' : '/wave-layer-2.svg'

  const positionClasses = position === 'top' ? 'top-0' : 'bottom-0'

  return (
    <div className={`pointer-events-none absolute left-0 w-full -z-10 ${positionClasses} ${className}`}>
      <div
        className={`w-full ${flip ? 'rotate-180' : ''}`}
        style={{
          aspectRatio: '960/300',
          backgroundImage: `url('${waveSrc}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
      <div
        className={`w-full ${flip ? '' : 'rotate-180'}`}
        style={{
          aspectRatio: '960/300',
          backgroundImage: `url('${waveSrc}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      />
    </div>
  )
}
