import * as React from "react"
import { cn } from "@/lib/utils"

const FieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
))
FieldSet.displayName = "FieldSet"

const FieldLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
))
FieldLegend.displayName = "FieldLegend"

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative", className)}
    {...props}
  />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    hasDisabled?: boolean
    hasChecked?: boolean
  }
>(({ className, hasDisabled, hasChecked, ...props }, ref) => (
  <label
    ref={ref}
    data-disabled={hasDisabled}
    data-checked={hasChecked}
    className={cn(
      "[&:has(:disabled)]:opacity-50",
      "[&:has(:checked)]:has-checked",
      "[&:has(:disabled)]:has-disabled",
      className
    )}
    {...props}
  />
))
FieldLabel.displayName = "FieldLabel"

export { Field, FieldLabel, FieldLegend, FieldSet }
