import Reveal from "./ui/Reveal";
import Editable from "./ui/Editable";
import HexCard from "./ui/HexCard";


const VALUES = [
  { l: "S", w: "Spirituality" },
  { l: "O", w: "Ownership" },
  { l: "H", w: "Honor" },
  { l: "C", w: "Commitment" },
  { l: "A", w: "Accountability" },
  { l: "R", w: "Relationship" },
  { l: "E", w: "Excellence" },
];

export default function Vision() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <Reveal>
        <p className="mb-4 text-sm text-brand-violet dark:text-brand-sky">The vision</p>
        <Editable
          k="vision.statement"
          as="h2"
          scrollWords
          className="font-display font-extrabold text-4xl md:text-6xl leading-[1.04] max-w-4xl"
        />
      </Reveal>

      <Reveal delay={100}>
        <Editable
          k="vision.mission"
          as="p"
          className="mt-8 block max-w-prose text-lg leading-relaxed text-ink/70 dark:text-paper/70"
        />
      </Reveal>

      <div className="mt-16">
        <Reveal>
          <p className="mb-6 font-display font-semibold text-xl">Seven core values</p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.l} delay={i * 60} from="scale">
              <HexCard className="p-5 h-full">
                <span className="block font-display font-extrabold text-6xl leading-none bg-brand-gradient bg-clip-text text-transparent">
                  {v.l}
                </span>
                <span className="mt-4 block text-sm font-medium">{v.w}</span>
              </HexCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
