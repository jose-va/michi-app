"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/shadcn/components/button";
import { ImageOff } from "lucide-react";
import { needsHeicConversion } from "@/common/utils/product-image";

interface ProductPhotoInputProps {
  existingSrc: string | null;
  existingAlt: string;
  file: File | null;
  error: string | null;
  onSelect: (file: File | null) => void;
  existingRemoved?: boolean;
  onRemoveExisting?: () => void;
  onRestoreExisting?: () => void;
}

export default function ProductPhotoInput({
  existingSrc,
  existingAlt,
  file,
  error,
  onSelect,
  existingRemoved = false,
  onRemoveExisting,
  onRestoreExisting,
}: ProductPhotoInputProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemove = () => {
    if (inputRef.current) inputRef.current.value = "";
    onSelect(null);
  };

  const previewUrl = useMemo(() => {
    if (!file || needsHeicConversion(file.name)) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const showExisting = Boolean(
    !file && !existingRemoved && existingSrc && failedSrc !== existingSrc,
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Foto del producto</span>
      {existingRemoved && !file ? (
        <div
          className="flex h-44 w-full items-center justify-center rounded-md bg-black/60"
          aria-hidden="true"
        >
          <ImageOff className="h-10 w-10" />
        </div>
      ) : previewUrl && file ? (
        <img
          src={previewUrl}
          alt={`Vista previa de ${file.name}`}
          className="h-44 w-full rounded-md object-cover"
        />
      ) : file && needsHeicConversion(file.name) ? (
        <div className="flex h-44 w-full flex-col items-center justify-center gap-1 rounded-md bg-black/60 px-4 text-center">
          <p className="text-sm font-medium text-white">{file.name}</p>
          <p className="text-xs text-white/80">
            La imagen se convertirá a WebP al guardar.
          </p>
        </div>
      ) : showExisting ? (
        <img
          src={existingSrc ?? ""}
          alt={existingAlt}
          className="h-44 w-full rounded-md object-cover"
          onError={() => setFailedSrc(existingSrc)}
        />
      ) : (
        <div
          className="flex h-44 w-full items-center justify-center rounded-md bg-black/60"
          aria-hidden="true"
        >
          <ImageOff className="h-10 w-10" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          Seleccionar foto
        </Button>
        <span
          className="min-w-0 flex-1 truncate text-sm text-white/70"
          aria-live="polite"
        >
          {file ? file.name : existingRemoved ? "Imagen eliminada. Se borrará al guardar." : "Ningún archivo seleccionado"}
        </span>
        {file && (
          <Button type="button" variant="outline" onClick={handleRemove}>
            Quitar
          </Button>
        )}
        {showExisting && onRemoveExisting && (
          <Button type="button" variant="outline" onClick={onRemoveExisting}>
            Eliminar imagen
          </Button>
        )}
        {existingRemoved && !file && onRestoreExisting && (
          <Button type="button" variant="outline" onClick={onRestoreExisting}>
            Restaurar
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          aria-label="Adjuntar foto del producto"
          onChange={(e) => {
            onSelect(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
