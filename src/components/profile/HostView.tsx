"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { routes } from "@/constants/routes";
import { useWalletContext } from "@/hooks/useWallet";
import { staykeApi } from "@/lib/staykeApi";
import type { Booking } from "@/types/api/booking";
import type { PropertyResponse } from "@/types/api/property";
import type { HostViewProps } from "@/types/profile";
import { HostActiveHostings } from "./HostActiveHostings";
import { HostActiveProperties } from "./HostActiveProperties";
import { HostPastHostings } from "./HostPastHostings";

export function HostView({ hostings, properties }: HostViewProps) {
  const router = useRouter();
  const { userProfile, userBackend, isLoadingUser } = useWalletContext();
  const [activeHostings, setActiveHostings] = useState<Booking[]>([]);
  const [pastHostings, setPastHostings] = useState<Booking[]>([]);
  const [activeProperties, setActiveProperties] = useState<PropertyResponse[]>(
    [],
  );
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (hostings !== undefined) {
      setLoadingBookings(false);
      return;
    }

    if (isLoadingUser) return;

    if (!userProfile?.address) {
      setActiveHostings([]);
      setPastHostings([]);
      setLoadingBookings(false);
      return;
    }

    setLoadingBookings(true);
    Promise.all([
      staykeApi.getBookings({
        host: userProfile.address,
        status: BookingStatus.Active,
        limit: 3,
      }),
      staykeApi.getBookings({
        host: userProfile.address,
        status: BookingStatus.Released,
        limit: 3,
      }),
    ])
      .then(([activeRes, releasedRes]) => {
        if (cancelled) return;
        setActiveHostings(
          activeRes.status && Array.isArray(activeRes.data)
            ? activeRes.data.slice(0, 3)
            : [],
        );
        setPastHostings(
          releasedRes.status && Array.isArray(releasedRes.data)
            ? releasedRes.data.slice(0, 3)
            : [],
        );
        setLoadingBookings(false);
      })
      .catch(() => {
        if (cancelled) return;
        setActiveHostings([]);
        setPastHostings([]);
        setLoadingBookings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userProfile?.address, isLoadingUser, hostings]);

  useEffect(() => {
    let cancelled = false;

    if (properties !== undefined) {
      setLoadingProperties(false);
      return;
    }

    if (isLoadingUser) return;

    const hostId = userBackend?.owner;
    if (!hostId) {
      setActiveProperties([]);
      setLoadingProperties(false);
      return;
    }

    setLoadingProperties(true);
    staykeApi
      .getProperties({
        hostId,
        isActive: true,
        limit: 3,
      })
      .then((result) => {
        if (cancelled) return;
        setActiveProperties(
          result.status && Array.isArray(result.data)
            ? result.data.slice(0, 3)
            : [],
        );
        setLoadingProperties(false);
      })
      .catch(() => {
        if (cancelled) return;
        setActiveProperties([]);
        setLoadingProperties(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userBackend?.owner, isLoadingUser, properties]);

  const handleCreateProperty = () => {
    router.push(routes.Profile.properties.create);
  };

  return (
    <div className="space-y-6">
      <HostActiveHostings
        bookings={activeHostings}
        loading={loadingBookings}
        onCreateProperty={handleCreateProperty}
      />
      <HostPastHostings
        bookings={pastHostings}
        loading={loadingBookings}
        onCreateProperty={handleCreateProperty}
      />
      <HostActiveProperties
        properties={activeProperties}
        loading={loadingProperties}
        onCreateProperty={handleCreateProperty}
      />
    </div>
  );
}
