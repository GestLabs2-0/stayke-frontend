"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelLeft, ShieldCheck, X } from "lucide-react";
import { SidebarContent } from "./AdminSidebarContent";
import { NAV_ITEMS } from "./AdminConfig";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop: sidebar fija */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border-low bg-card flex-col min-h-screen sticky top-0 h-screen pt-4">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile: botón flotante con animaciones */}
      <AnimatePresence>
        {!mobileOpen && (
          <motion.button
            key="fab"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
            // Entrada desde la izquierda
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: { type: "spring", stiffness: 300, damping: 24 },
            }}
            className="lg:hidden fixed left-0 top-26 -translate-y-1/2 z-40
              bg-card border border-l-0 border-border-low
              rounded-r-xl px-1.5 py-3
              text-muted-foreground hover:text-primary
              shadow-card"
          >
            {/* Indicador de pulso detrás del botón */}
            <motion.span
              className="absolute inset-0 rounded-r-xl bg-primary/10"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            >
              <PanelLeft className="h-4 w-4 relative z-10" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile: drawer + overlay con AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay animado */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer deslizante */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card border-r border-border-low flex flex-col lg:hidden shadow-card"
            >
              <motion.button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-cream transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>

              {/* Items del nav con stagger */}
              <div className="flex flex-col h-full">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-6 py-5 border-b border-border-low flex items-center gap-2"
                >
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold tracking-tight">
                    Stayke{" "}
                    <span className="text-gradient font-bold">Admin</span>
                  </span>
                </motion.div>

                <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                  {NAV_ITEMS.map(({ label, href, icon: Icon, soon }, i) => {
                    const active = pathname === href;
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + i * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        }}
                      >
                        <Link
                          href={soon ? "#" : href}
                          onClick={
                            !soon ? () => setMobileOpen(false) : undefined
                          }
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative
                            ${
                              active
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-cream hover:text-foreground"
                            }
                            ${soon ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{label}</span>
                          {soon && (
                            <span className="ml-auto text-[10px] font-medium border border-border-low rounded px-1.5 py-0.5 text-muted-foreground">
                              Soon
                            </span>
                          )}
                          {active && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="px-6 py-4 border-t border-border-low"
                >
                  <p className="text-xs text-muted-foreground">
                    Stayke v0.1 · Admin
                  </p>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
