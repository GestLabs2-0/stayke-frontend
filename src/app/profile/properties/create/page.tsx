"use client";

import Link from "next/link";

import { CreatePropertyForm } from "@/components/profile/properties/CreatePropertyForm";
import { routes } from "@/constants/routes";

export default function CreatePropertyPage() {
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 font-plus-jakarta text-[13px] text-muted">
          <li>
            <Link
              href={routes.Profile}
              className="transition-colors hover:text-secondary"
            >
              Perfil
            </Link>
          </li>
          <li aria-hidden="true" className="select-none">
            /
          </li>
          <li className="text-secondary" aria-current="page">
            Crear propiedad
          </li>
        </ol>
      </nav>

      <CreatePropertyForm />
    </>
  );
}
