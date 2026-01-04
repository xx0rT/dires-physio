# Background Shapes

This file contains several SVG background components that can be used throughout the application to add visual interest and depth.

## Available Backgrounds

### 1. MinimalBackground (Default for Dashboard)
Subtle circular gradients in the corners with a very light grid pattern. Perfect for clean, professional interfaces.

```tsx
import { MinimalBackground } from '@/components/ui/background-shapes'

<MinimalBackground />
```

### 2. BlobBackground (Default for Marketing)
Organic blob shapes with vibrant gradients (blue, green, orange). Great for landing pages and marketing content.

```tsx
import { BlobBackground } from '@/components/ui/background-shapes'

<BlobBackground />
```

### 3. BackgroundShapes
Multiple circular shapes with various gradients positioned throughout the viewport. Medium visual impact.

```tsx
import { BackgroundShapes } from '@/components/ui/background-shapes'

<BackgroundShapes />
```

### 4. WaveBackground
Wave-like shapes at the top and bottom with a circular gradient on the side. Dynamic and flowing feel.

```tsx
import { WaveBackground } from '@/components/ui/background-shapes'

<WaveBackground />
```

## Usage

All backgrounds are positioned fixed with `z-index: -10` and are non-interactive (`pointer-events: none`), so they sit behind all content without interfering with user interactions.

### Example: Changing Dashboard Background

To change the dashboard background, edit `src/layouts/dashboard-layout.tsx`:

```tsx
// Instead of MinimalBackground
import { BlobBackground } from '@/components/ui/background-shapes'

// Replace in the component
<BlobBackground />
```

### Example: Changing Marketing Background

To change the marketing background, edit `src/layouts/marketing-layout.tsx`:

```tsx
// Instead of BlobBackground
import { WaveBackground } from '@/components/ui/background-shapes'

// Replace in the component
<WaveBackground />
```

## Customization

You can adjust the opacity, size, position, and colors of any background by:

1. Copying the component to a new file
2. Modifying the SVG properties
3. Adjusting the gradient stop colors
4. Changing opacity values (currently 0.10-0.30)

## Colors Used

- Blue: `#3b82f6`, `#0ea5e9`, `#06b6d4`
- Green: `#10b981`, `#14b8a6`
- Orange/Yellow: `#f97316`, `#fb923c`, `#fbbf24`

All colors are chosen to complement the application's theme and avoid purple/indigo hues.
