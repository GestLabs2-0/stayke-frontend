import type { ReactNode } from "react";

export const metadata = {
  title: "Admin · Stayke",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {children}
    </div>
  );
}
