import { useState, useEffect } from "react"
import { motion, type Transition, type TargetAndTransition, type VariantLabels } from "framer-motion"

interface RotatingTextProps {
  texts: string[]
  mainClassName?: string
  staggerFrom?: "first" | "last" | "center"
  initial?: boolean | TargetAndTransition | VariantLabels
  animate?: boolean | TargetAndTransition | VariantLabels
  exit?: TargetAndTransition | VariantLabels
  staggerDuration?: number
  splitLevelClassName?: string
  transition?: Transition
  rotationInterval?: number
}

const RotatingText = ({
  texts,
  mainClassName = "",
  staggerFrom = "last",
  initial = { y: "100%" },
  animate = { y: 0 },
  exit = { y: "-120%" },
  staggerDuration = 0.025,
  splitLevelClassName = "",
  transition = { type: "spring", damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}: RotatingTextProps) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, rotationInterval)

    return () => clearInterval(interval)
  }, [texts.length, rotationInterval])

  const currentText = texts[index]
  const characters = currentText.split("")

  const getStaggerDelay = (i: number) => {
    if (staggerFrom === "first") {
      return i * staggerDuration
    }
    if (staggerFrom === "last") {
      return (characters.length - 1 - i) * staggerDuration
    }
    const middle = Math.floor(characters.length / 2)
    return Math.abs(middle - i) * staggerDuration
  }

  return (
    <div className={mainClassName}>
      <div className="flex">
        {characters.map((char, i) => (
          <div key={`${index}-${i}`} className={splitLevelClassName}>
            <motion.span
              initial={initial}
              animate={animate}
              exit={exit}
              transition={{
                ...transition,
                delay: getStaggerDelay(i),
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RotatingText
