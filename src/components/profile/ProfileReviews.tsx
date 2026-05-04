import { MessageSquare } from "lucide-react";
import { ReviewCard } from "../Reviews";
import { MockReviews } from "@/src/app/profile/page";

export const ProfileReviews = ({ reviews }: { reviews: MockReviews[] }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 ">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
          Reviews
        </h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};
