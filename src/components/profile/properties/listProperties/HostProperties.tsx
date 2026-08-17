"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { sileo } from "sileo";

import { HostPropertyConfirmDialog } from "@/components/profile/properties/listProperties/HostPropertyConfirmDialog";
import { HostPropertyFilters } from "@/components/profile/properties/listProperties/HostPropertyFilters";
import { HostPropertyList } from "@/components/profile/properties/listProperties/HostPropertyList";
import { HostPropertyPagination } from "@/components/profile/properties/listProperties/HostPropertyPagination";
import { routes } from "@/constants/routes";
import { useWalletContext } from "@/hooks/useWallet";
import {
  fetchProperties,
  INITIAL_STATE_PROPERTIES,
  PROPERTIES_PAGE_SIZE,
  propertiesReducer,
  updatePropertieStatus,
} from "@/reducers/propertiesReducer";
import type { HostProperty } from "@/types/property/hostProperty";
import type { PropertyFilters } from "@/types/property/propertyFilters";
import { Breadcrumb } from "../../Breadcrumb";

export function HostProperties() {
  const [propertiesState, dispatchProperties] = useReducer(
    propertiesReducer,
    INITIAL_STATE_PROPERTIES,
  );
  const router = useRouter();
  const { userBackend } = useWalletContext();
  const owner = userBackend?.owner;

  const [dialog, setDialog] = useState<{
    open: boolean;
    property: HostProperty | null;
  }>({
    open: false,
    property: null,
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    if (!owner) return;
    // Ignorar resoluciones obsoletas cuando un fetch más reciente ya corrió.
    fetchProperties(propertiesState.filters, owner, (action) => {
      if (requestId === requestIdRef.current) dispatchProperties(action);
    });
  }, [propertiesState.filters, owner]);

  const handleChange = useCallback(
    <K extends keyof PropertyFilters>(field: K, value: PropertyFilters[K]) => {
      dispatchProperties({
        type: "update_filter",
        payload: { [field]: value },
      });
    },
    [],
  );

  const handleNextPage = useCallback(() => {
    dispatchProperties({ type: "increment_page_index" });
  }, []);

  const handlePreviousPage = useCallback(() => {
    dispatchProperties({ type: "reduce_page_index" });
  }, []);

  const resetForm = useCallback(() => {
    dispatchProperties({ type: "reset_filter" });
  }, []);

  const handleCreate = useCallback(() => {
    router.push(routes.Profile.properties.create);
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
    updatePropertieStatus(
      propertiesState.properties,
      dialog.property.id,
      dispatchProperties,
    );
    const activating = !dialog.property.isActive;

    sileo.success({
      title: activating ? "Propiedad activada" : "Propiedad desactivada",
    });
    setDialog({ open: false, property: null });
  }, [dialog.property, propertiesState.properties]);

  const startIndex = (propertiesState.pageIndex - 1) * PROPERTIES_PAGE_SIZE;
  const pageItems = propertiesState.properties.slice(
    startIndex,
    startIndex + PROPERTIES_PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-montserrat text-[22px] font-bold text-[#171717]">
          Mis propiedades
        </h1>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#3b007f] px-5 py-2.5 font-plus-jakarta text-[14px] font-semibold text-white transition-colors hover:bg-[#5307ad]"
        >
          <Plus className="size-4" />
          Crear propiedad
        </button>
      </div>

      <HostPropertyFilters
        values={propertiesState.filters}
        onChange={handleChange}
        onReset={resetForm}
      />

      <HostPropertyList
        properties={pageItems}
        totalCount={propertiesState.totalCount}
        loading={propertiesState.loading}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onCreate={handleCreate}
        onClearFilters={resetForm}
      />

      <HostPropertyPagination
        pageIndex={propertiesState.pageIndex}
        pages={propertiesState.pages}
        loading={propertiesState.loading}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
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
