import { Stars } from "@/components/home/Testimonios/Stars";
import type { PropertyReview } from "@/types/api/propertyDetail";

interface ReviewsSectionProps {
  reviews: PropertyReview[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="card-white">
      <h2 className="text-xl font-semibold text-zinc-900">Reseñas</h2>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          Aún no hay reseñas de esta propiedad.
        </p>
      ) : (
        <ul className="mt-4 space-y-5">
          {reviews.map((review) => (
            <li key={review.id} className="border-t border-border pt-5">
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
                <Stars count={Math.round(review.rating)} />
              </div>

              <p className="mt-2 text-sm text-zinc-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
