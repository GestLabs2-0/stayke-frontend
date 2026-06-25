import { testimoniosData } from "./mocks";
import { TestimonioCard } from "./TestimonioCard";

export const Testimonios = () => {
  return (
    <section className="w-full bg-zinc-100 py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-6 items-start">
        {testimoniosData.map((testimonio) => (
          <TestimonioCard key={testimonio.id} testimonio={testimonio} />
        ))}
      </div>
    </section>
  );
};
