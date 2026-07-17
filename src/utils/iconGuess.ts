import type { LucideIcon } from 'lucide-react';
import { Fan, Flame, Snowflake, ShieldCheck, Lightbulb, Tv, Droplet, Microwave, Router, Plug } from 'lucide-react';

// Local, non-AI icon pick — the Coach Agent never supplies a component reference,
// only text (category/product name); this just maps that text to an existing
// lucide-react icon already used elsewhere in the app. Called twice per new card:
// once instantly off the typed name (before any Coach Agent response exists),
// then again once the real category comes back, in case that refines the guess.
const ICON_KEYWORDS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ['fan', 'exhaust'], icon: Fan },
  { keywords: ['heater', 'geyser', 'boiler', 'water/space heater'], icon: Flame },
  { keywords: ['cooler', 'ac', 'air conditioner', 'conditioner', 'cooling'], icon: Snowflake },
  { keywords: ['fridge', 'refrigerator'], icon: ShieldCheck },
  { keywords: ['light', 'lamp', 'bulb', 'led', 'lighting'], icon: Lightbulb },
  { keywords: ['tv', 'television'], icon: Tv },
  { keywords: ['washer', 'washing', 'laundry'], icon: Droplet },
  { keywords: ['oven', 'microwave', 'kitchen'], icon: Microwave },
  { keywords: ['router', 'modem', 'wifi', 'networking'], icon: Router },
];

export function pickIcon(category: string, name: string): LucideIcon {
  const haystack = `${category} ${name}`.toLowerCase();
  const match = ICON_KEYWORDS.find((entry) => entry.keywords.some((k) => haystack.includes(k)));
  return match ? match.icon : Plug;
}
