"use client";

import { useFormik } from "formik";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { sileo } from "sileo";

import { HostPropertyConfirmDialog } from "@/components/profile/properties/listProperties/HostPropertyConfirmDialog";
import { HostPropertyFilters } from "@/components/profile/properties/listProperties/HostPropertyFilters";
import { HostPropertyList } from "@/components/profile/properties/listProperties/HostPropertyList";
import { hostPropertiesMock } from "@/components/profile/properties/listProperties/mockHostProperties";
import { routes } from "@/constants/routes";
import type { HostProperty } from "@/types/property/hostProperty";
import type { PropertyFilters } from "@/types/property/propertyFilters";
import { PROPERTY_FILTERS_DEFAULTS } from "@/types/property/propertyFilters";

interface ConfirmState {
  open: boolean;
  property: HostProperty | null;
}

export function HostProperties() {
  const router = useRouter();
  const [properties, setProperties] =
    useState<HostProperty[]>(hostPropertiesMock);
  const [dialog, setDialog] = useState<ConfirmState>({
    open: false,
    property: null,
  });

  const { values, setFieldValue, resetForm } = useFormik<PropertyFilters>({
    initialValues: PROPERTY_FILTERS_DEFAULTS,
    onSubmit: () => {
      /* filtra de forma reactiva; no hay envío */
    },
  });

  const filtered = useMemo(() => {
    const term = (value: string) => value.trim().toLowerCase();
    return properties.filter((property) => {
      if (
        values.name &&
        !property.name.toLowerCase().includes(term(values.name))
      )
        return false;
      if (
        values.address &&
        !property.address.toLowerCase().includes(term(values.address))
      )
        return false;
      if (values.reviewsFrom > 0 && property.reviews < values.reviewsFrom)
        return false;
      if (values.priceUpTo > 0 && property.pricePerNight > values.priceUpTo)
        return false;
      if (values.status === "active" && !property.active) return false;
      if (values.status === "inactive" && property.active) return false;
      return true;
    });
  }, [properties, values]);

  const handleChange = useCallback(
    <K extends keyof PropertyFilters>(field: K, value: PropertyFilters[K]) => {
      setFieldValue(field, value);
    },
    [setFieldValue],
  );

  const handleCreate = useCallback(() => {
    router.push(routes.ProfilePropertiesCreate);
  }, [router]);

  const handleEdit = useCallback(() => {
    sileo.info({
      title: "La edición de propiedades estará disponible pronto",
    });
  }, []);

  const handleToggleActive = useCallback((property: HostProperty) => {
    setDialog({ open: true, property });
  }, []);

  const confirmToggle = useCallback(() => {
    if (!dialog.property) return;
    const target = dialog.property;
    const activating = !target.active;
    setProperties((current) =>
      current.map((p) =>
        p.id === target.id ? { ...p, active: activating } : p,
      ),
    );
    sileo.success({
      title: activating ? "Propiedad activada" : "Propiedad desactivada",
    });
    setDialog({ open: false, property: null });
  }, [dialog.property]);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-plus-jakarta text-[13px] text-[#a0a5b5]">
          <li>
            <Link
              href={routes.Profile}
              className="transition-colors hover:text-[#434654]"
            >
              Perfil
            </Link>
          </li>
          <li aria-hidden="true" className="select-none">
            /
          </li>
          <li className="text-[#434654]" aria-current="page">
            Propiedades
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
          Mis propiedades
        </h1>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3b007f] px-5 py-2.5 font-plus-jakarta text-[14px] font-semibold text-white transition-colors hover:bg-[#5307ad]"
        >
          <Plus className="size-4" />
          Crear propiedad
        </button>
      </div>

      <HostPropertyFilters
        values={values}
        onChange={handleChange}
        onReset={resetForm}
        resultCount={filtered.length}
        totalCount={properties.length}
      />

      <HostPropertyList
        properties={filtered}
        totalCount={properties.length}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onCreate={handleCreate}
        onClearFilters={resetForm}
      />

      <HostPropertyConfirmDialog
        open={dialog.open}
        property={dialog.property}
        onClose={() => setDialog({ open: false, property: null })}
        onConfirm={confirmToggle}
      />
    </div>
  );
}
