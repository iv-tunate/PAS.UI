"use client";

import Marquee from "./ui/Marquee";
import { useContent } from "@/contexts/ContentContext";

/** The scrolling strip repeats the roles listed in the About section. */
export default function RolesMarquee() {
  const { get } = useContent();
  const roles = get("about.roles")
    .split(/[,|]/)
    .map((r) => r.trim())
    .filter(Boolean);
  return <Marquee items={roles} />;
}
