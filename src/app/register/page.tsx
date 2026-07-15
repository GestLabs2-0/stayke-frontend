import Image from "next/image";

import { RegisterCard } from "@/components/auth/RegisterCard";

export default function RegisterPage() {
  return (
    <section className="relative min-h-[calc(100vh-2.5rem)]">
      {/* Background image - right side (desktop only) */}
      <div className="absolute inset-0 hidden lg:block overflow-hidden">
        <Image
          src="/images/registerBackground.webp"
          alt="Background image"
          fill
          className="object-cover scale-110 object-right"
          priority
          aria-hidden="true"
          sizes="100vw"
        />
      </div>

      {/* Purple gradient overlay - left half on desktop, full on mobile */}
      <div
        className="absolute inset-0 bg-linear-to-r from-[rgba(59,0,127,0.8)] to-[rgba(106,0,229,0.8)] lg:min-w-200 lg:inset-y-0 lg:left-0 lg:w-1/2"
        style={{
          WebkitBackdropFilter: "blur(25px)",
          backdropFilter: "blur(25px)",
        }}
      />

      {/* Content - positioned in the left half on desktop */}
      <div className="w-full max-w-150 xl:max-w-168.75 relative z-10 flex min-h-[calc(100vh-2.5rem)] items-center max-lg:mx-auto px-4 py-16 sm:px-8 lg:w-1/2 lg:pl-32.5 lg:pr-16 lg:min-w-200 xl:pl-45 2xl:pl-50">
        <RegisterCard />
      </div>
    </section>
  );
}
