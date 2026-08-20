import { Stars } from "@/components/home/Testimonios/Stars";
import { StarIcon } from "@/icons";
import type { PropertyReview } from "@/types/api/propertyDetail";

interface ReviewsSectionProps {
  reviews: PropertyReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const average =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  return (
    <section className="card-white">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-montserrat text-xl font-bold text-zinc-900">
          Reseñas
        </h2>

        {average != null && (
          <div className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5">
            <span className="flex items-center [&>svg]:size-4">
              <StarIcon className="text-accent-warm" filled />
            </span>
            <span className="text-sm font-bold text-zinc-800">
              {average.toFixed(1)}
            </span>
            <span className="text-sm text-zinc-500">
              · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Aún no hay reseñas de esta propiedad.
        </p>
      ) : (
        <ul className="mt-5 space-y-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border-t border-border pt-5 transition-colors hover:bg-surface/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-zinc-600">
                  {review.author.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">
                    {review.author}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <Stars
                  count={Math.round(review.rating)}
                  className="text-accent-warm"
                />
              </div>

              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
