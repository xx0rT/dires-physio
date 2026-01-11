import { Minus, Plus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QuantityInputProps {
  min?: number
  max?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  className?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

const QuantityInput = React.forwardRef<HTMLInputElement, QuantityInputProps>(
  (
    {
      min = 1,
      max = 99,
      defaultValue = 1,
      onValueChange,
      className,
      inputProps,
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleIncrement = () => {
      const newValue = Math.min(value + 1, max)
      setValue(newValue)
      onValueChange?.(newValue)
    }

    const handleDecrement = () => {
      const newValue = Math.max(value - 1, min)
      setValue(newValue)
      onValueChange?.(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) || min
      const clampedValue = Math.max(min, Math.min(max, newValue))
      setValue(clampedValue)
      onValueChange?.(clampedValue)
    }

    React.useEffect(() => {
      if (inputProps?.value !== undefined) {
        setValue(Number(inputProps.value))
      }
    }, [inputProps?.value])

    return (
      <div className={cn("flex items-center", className)}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-r-none"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleInputChange}
          className="h-10 w-16 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...inputProps}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-l-none"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
QuantityInput.displayName = "QuantityInput"

export default QuantityInput
