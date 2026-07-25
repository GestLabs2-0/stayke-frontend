import type { ModeSwitchProps } from "@/types/profile";

export function ModeSwitch({ isHost, changeMode }: ModeSwitchProps) {
  return (
    <div className="flex items-center gap-2 md:ml-auto">
      <span
        className={`text-xs font-semibold transition-colors ${
          isHost ? "text-accent-warm" : "text-[#a0a5b5]"
        }`}
      >
        Anfitrión
      </span>
      <button
        onClick={() => changeMode(isHost ? "guest" : "host")}
        className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none ${
          isHost ? "bg-accent-warm" : "bg-[#c3c6d6]"
        }`}
        role="switch"
        type="button"
        aria-checked={isHost}
        aria-label="Cambiar modo"
      >
        <span
          className={`pointer-events-none translate-y-[-50%] absolute top-[50%] inline-block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
            isHost ? "translate-x-0" : "translate-x-4"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold transition-colors ${
          !isHost ? "text-accent-warm" : "text-[#a0a5b5]"
        }`}
      >
        Huésped
      </span>
    </div>
  );
}
