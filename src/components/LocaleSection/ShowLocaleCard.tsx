"use client";
import { listings as mockListings } from "../../constants";
import { ListingCard } from "./ListingCard";

export const ShowLocaleCards = () => {
  return (
    <>
      {mockListings.slice(0, 6).map((listing, i) => (
        <ListingCard key={listing.id} {...listing} index={i} />
      ))}
    </>
  );
};
