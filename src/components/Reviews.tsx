import { Star, User } from "lucide-react";

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-2.5">
        {/* Avatar placeholder */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-solana">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {review.author}
          </p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < review.rating ? "fill-primary text-primary" : "text-border"
            }`}
          />
        ))}
      </div>
    </div>

    <p className="text-sm text-muted-foreground leading-relaxed">
      {review.comment}
    </p>
  </div>
);
