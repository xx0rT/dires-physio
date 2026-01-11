import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rate: number;
  max?: number;
  className?: string;
}

const Rating = ({ rate, max = 5, className }: RatingProps) => {
  const fullStars = Math.floor(rate);
  const hasHalfStar = rate % 1 !== 0;
  const emptyStars = max - Math.ceil(rate);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300" />
      ))}
    </div>
  );
};

export { Rating };
