"use client";

import Reveal from "./ui/Reveal";
import Button from "./ui/Button";
import Editable from "./ui/Editable";
import { useContent } from "@/contexts/ContentContext";

const directions = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Gateway Nation, " + address)}`;

function Times() {
  return (
    <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      <p>
        <span className="block font-display text-3xl font-extrabold">Sundays</span>
        <Editable k="visit.sunday" className="opacity-75" />
      </p>
      <p>
        <span className="block font-display text-3xl font-extrabold">Thursdays</span>
        <Editable k="visit.thursday" className="opacity-75" />
      </p>
    </div>
  );
}

/** Join us: both campuses, the same service times, and a Get directions button for each. */
export default function Visit() {
  const { get } = useContent();
  return (
    <section id="visit" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24 md:py-32">
      <Reveal from="scale">
        <div className="bg-ink p-8 text-paper dark:bg-paper dark:text-ink md:p-14">
          <p className="mb-3 text-sm text-brand-sky dark:text-brand-violet">Join us</p>
          <Editable k="visit.heading" as="h2" className="mb-12 block max-w-2xl font-display text-3xl font-bold md:text-5xl" />

          <div className="grid gap-14 md:grid-cols-2 md:gap-16">
            <div>
              <h3 className="mb-6 font-display text-2xl font-bold">Lagos (headquarters)</h3>
              <Times />
              <Editable k="visit.address" as="p" className="mt-6 block max-w-md leading-relaxed opacity-75" />
              <div className="mt-6">
                <Button href={directions(get("visit.address"))} external variant="primary">
                  Get directions
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-6 font-display text-2xl font-bold">Abuja campus</h3>
              <Times />
              <Editable k="visit.abuja.address" as="p" className="mt-6 block max-w-md leading-relaxed opacity-75" />
              <div className="mt-6">
                <Button href={directions(get("visit.abuja.address"))} external variant="primary">
                  Get directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
