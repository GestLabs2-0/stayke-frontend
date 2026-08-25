import Image from "next/image";

import { ImageIcon } from "@/icons";

interface PropertyGalleryProps {
  images?: string[];
  title: string;
  fallbackLabel: string;
}

export function PropertyGallery({
  images = [],
  title,
  fallbackLabel,
}: PropertyGalleryProps) {
  const validImages = [
    ...new Set(images.filter((image) => image.trim().length > 0)),
  ];

  if (validImages.length === 0) {
    return (
      <div
        role="img"
        aria-label={`${title} — ${fallbackLabel}`}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 text-center md:aspect-video"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-white text-muted">
          <ImageIcon className="size-7" />
        </span>
        <p className="text-sm font-medium text-zinc-500">{fallbackLabel}</p>
      </div>
    );
  }

  const [heroImage, ...remainingImages] = validImages;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface md:aspect-video">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>

      {remainingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {remainingImages.map((image, index) => (
            <div
              key={image}
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface"
            >
              <Image
                src={image}
                alt={`${title} — imagen ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
