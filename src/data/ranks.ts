import type { RankTier } from '../types';

// Reuses the existing 5-tier name ladder. Thresholds are the one place this
// feature has to invent a number — there's no real data to derive "how much
// cumulative XP = a rank" from — spaced so a single near-perfect match
// (~2,900 XP, see gameEngine.ts) roughly reaches Eco Champion, and several
// matches reach the top tier.
export const RANK_TIERS: RankTier[] = [
  { name: 'Energy Aware', minXp: 0 },
  { name: 'Efficiency Builder', minXp: 1200 },
  { name: 'Eco Champion', minXp: 2900 },
  { name: 'Smart Living Expert', minXp: 5000 },
  { name: 'Grid Master', minXp: 8000 },
];

export interface RankProgress {
  tier: RankTier;
  nextTier: RankTier | null;
  progressPct: number; // 0-100 within the current tier band
  xpToNext: number | null;
}

export function deriveRankProgress(cumulativeXp: number): RankProgress {
  let tier = RANK_TIERS[0];
  let nextTier: RankTier | null = RANK_TIERS[1] ?? null;

  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (cumulativeXp >= RANK_TIERS[i].minXp) {
      tier = RANK_TIERS[i];
      nextTier = RANK_TIERS[i + 1] ?? null;
    }
  }

  if (!nextTier) {
    return { tier, nextTier: null, progressPct: 100, xpToNext: null };
  }

  const band = nextTier.minXp - tier.minXp;
  const progressPct = Math.min(100, Math.max(0, ((cumulativeXp - tier.minXp) / band) * 100));
  return { tier, nextTier, progressPct, xpToNext: nextTier.minXp - cumulativeXp };
}
