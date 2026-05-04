import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { StatsCard } from "@/src/components/admin/StatsCard";
import { DisputesPanel } from "@/src/components/admin/DisputePanel";

export default function AdminPage() {
  return (
    <>
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Top bar — en mobile queda debajo del topbar del sidebar */}
        <header
          className="sticky top-0 z-10 border-b border-border-low bg-background/80 backdrop-blur-sm px-4 md:px-8 py-4 flex items-center justify-between
          lg:top-0 max-lg:mt-[53px]"
        >
          <div className="relative top-1">
            <h1 className="text-base md:text-lg font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground border border-border-low rounded-full px-3 py-1.5 relative top-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline">Solana · </span>Mainnet
          </div>
        </header>

        <div className="px-4 md:px-8 py-6 md:py-8 flex flex-col gap-8 md:gap-10">
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 md:grid-cols-4">
            <StatsCard
              label="Total Disputes"
              value="24"
              sub="This month"
              accent
            />
            <StatsCard label="Pending Review" value="4" sub="Requires action" />
            <StatsCard
              label="Stake Locked"
              value="$12,480"
              sub="USDC in escrow"
            />
            <StatsCard label="Resolved Rate" value="87%" sub="Last 30 days" />
          </section>

          {/* Disputes */}
          <section>
            <DisputesPanel />
          </section>
        </div>
      </main>
    </>
  );
}
