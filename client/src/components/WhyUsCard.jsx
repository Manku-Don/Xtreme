import { Dumbbell, Snowflake, UserCheck, IndianRupee } from "lucide-react";
import Reveal from "./Reveal";

const ICONS = { Dumbbell, Snowflake, UserCheck, IndianRupee };

export default function WhyUsCard({ icon, title, body, index }) {
  const Icon = ICONS[icon] || Dumbbell;
  return (
    <Reveal
      delay={index * 0.08}
      className="group relative border border-line bg-panel p-7 transition-colors hover:border-plate-red/50"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm bg-panel-2 text-plate-red transition-colors group-hover:bg-plate-red group-hover:text-chalk">
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3 className="text-display max-w-[85%] text-2xl leading-tight text-chalk">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-steel">{body}</p>
    </Reveal>
  );
}
