"use client";

import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { sileo } from "sileo";

import { useWalletContext } from "@/hooks/useWallet";
import { staykeApi } from "@/lib/staykeApi";
import type { ProfileAvatarProps } from "@/types/profile";
import { ImagePlaceholder } from "../shared/ImagePlaceholder";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export function ProfileAvatar({
  avatar,
  name,
  lastName,
  editable = true,
}: ProfileAvatarProps) {
  const { refetchAccounts } = useWalletContext();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset file input so selecting the same file again triggers change
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      sileo.error({
        title: "Formato no válido",
        description:
          "Por favor selecciona una imagen en formato PNG, JPG o WEBP.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      sileo.error({
        title: "Archivo demasiado grande",
        description: "El tamaño máximo permitido para la imagen es de 5 MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await staykeApi.uploadAvatar(file);

      if (response.status) {
        sileo.success({
          title: "Foto de perfil actualizada",
          description: "Tu imagen de perfil se ha guardado correctamente.",
        });
        await refetchAccounts();
      } else {
        const message =
          Array.isArray(response.errors) && response.errors.length > 0
            ? response.errors.join(", ")
            : response.message;
        sileo.error({
          title: "Error al actualizar",
          description: message || "No se pudo actualizar la foto de perfil.",
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      sileo.error({
        title: "Error al actualizar",
        description: "Ocurrió un error inesperado al subir la imagen.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative size-20 shrink-0 sm:size-24">
      <div className="size-full overflow-hidden rounded-full border-2 border-[#ebe7e7] bg-[#f8f9fa]">
        {avatar ? (
          <Image
            src={avatar}
            alt={`${name} ${lastName}`.trim() || "Avatar de usuario"}
            width={96}
            height={96}
            className="size-full object-cover"
            unoptimized
          />
        ) : (
          <ImagePlaceholder lastName={lastName} name={name} />
        )}
      </div>

      {editable && (
        <>
          <input
            type="file"
            id="avatar-image-upload"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="sr-only"
            disabled={isUploading}
            onChange={handleFileChange}
          />
          <label
            htmlFor="avatar-image-upload"
            className={`absolute bottom-0 right-0 flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-accent-warm text-white shadow-sm transition-all hover:bg-accent-warm-hover sm:size-8 ${
              isUploading ? "cursor-not-allowed opacity-80" : ""
            }`}
            title="Cambiar foto de perfil"
            aria-label="Cambiar foto de perfil"
          >
            {isUploading ? (
              <Loader2 className="size-3.5 animate-spin sm:size-4" />
            ) : (
              <Camera className="size-3.5 sm:size-4" />
            )}
          </label>
        </>
      )}
    </div>
  );
}
