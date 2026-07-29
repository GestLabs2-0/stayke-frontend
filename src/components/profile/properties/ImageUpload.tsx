"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

import { ImageIcon } from "@/icons/ImageIcon";
import { XIcon } from "@/icons/XIcon";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGES,
} from "@/types/property/createProperty";
import type { ImageUploadProps } from "@/types/property/ImageUpload";

export function ImageUpload({
  images,
  onChange,
  maxImages = MAX_IMAGES,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = maxImages - images.length;
  const isFull = remaining <= 0;

  const imageUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );

  // useEffect(() => {
  //   return () => {
  //     imageUrls.forEach((url) => URL.revokeObjectURL(url));
  //   };
  // }, [imageUrls]);

  const validateAndAdd = useCallback(
    (files: FileList) => {
      setError(null);
      const valid: File[] = [];

      for (const file of Array.from(files)) {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setError(
            `Formato no soportado: "${file.name}". Usá JPG, PNG o WebP.`,
          );
          return;
        }
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
          setError(`"${file.name}" supera los ${MAX_IMAGE_SIZE_MB}MB.`);
          return;
        }
        valid.push(file);
      }

      const combined = [...images, ...valid].slice(0, maxImages);
      onChange(combined);
    },
    [images, maxImages, onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.dataTransfer.files.length) return;
      setIsAdding(true);
      setTimeout(() => {
        validateAndAdd(e.dataTransfer.files);
        setIsAdding(false);
      }, 0);
    },
    [validateAndAdd],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;
      setIsAdding(true);
      setTimeout(() => {
        validateAndAdd(files);
        setIsAdding(false);
      }, 0);
      if (inputRef.current) inputRef.current.value = "";
    },
    [validateAndAdd],
  );

  const removeImage = useCallback(
    (index: number) => {
      const url = imageUrls[index];
      if (url) URL.revokeObjectURL(url);
      const next = images.filter((_, i) => i !== index);
      onChange(next);
    },
    [images, imageUrls, onChange],
  );

  const skeletonCount = Math.min(remaining, 4);

  return (
    <div className="space-y-4">
      {!isFull && (
        // biome-ignore lint/a11y/noStaticElementInteractions: is allowed
        // biome-ignore lint/a11y/useKeyWithClickEvents: this is allowed
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-[#c3c6d6] bg-white px-6 py-10 text-center transition-colors hover:border-[#3b007f] hover:bg-[#3b007f]/5"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={handleInputChange}
          />

          <ImageIcon className="mx-auto mb-4" />

          <p className="font-plus-jakarta text-[14px] font-semibold text-[#434654]">
            Arrastra tus fotos aquí o haz clic para subir (máx. {maxImages})
          </p>
          <p className="mt-1 font-plus-jakarta text-[13px] text-[#a0a5b5]">
            JPG, PNG o WebP &middot; hasta {MAX_IMAGE_SIZE_MB}MB c/u
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 font-plus-jakarta text-[14px] font-medium text-red-600">
          {error}
        </div>
      )}

      {isAdding && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: skeletonCount }, () => crypto.randomUUID()).map(
            (id) => (
              <div
                key={id}
                className="aspect-4/3 animate-pulse rounded-xl bg-[#ebe7e7]"
              />
            ),
          )}
        </div>
      )}

      {images.length > 0 && !isAdding && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {imageUrls.map((url, i) => (
            <div key={url} className="group relative">
              <Image
                width={50}
                height={50}
                src={url}
                alt={`Foto ${i + 1}`}
                className="aspect-4/3 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Eliminar foto ${i + 1}`}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
