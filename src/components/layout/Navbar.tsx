import { NetworkSelector } from "./NetworkSelector";

export const Navbar = () => {
  return (
    <nav className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Stayke
      </div>

      {/*
       TODO: DEINAS USA ESTE NETWORK SELECTOR EN TU NAVBAR CUANDO ESTEMOS EN DESARROLLO
      */}
      <div className="flex items-center gap-3">
        <NetworkSelector />
      </div>
    </nav>
  );
};
