import { BadgeCheck, HelpCircle, Loader2 } from 'lucide-react';

interface IdentifiedBadgeProps {
  // undefined = Coach Agent lookup still running in the background (a brand
  // new card starts this way and flips to true/false once it resolves).
  identified?: boolean;
  matchedProductName?: string;
  className?: string;
}

// Only rendered for ruleSource: 'generic' cards — distinguishes "Coach Agent
// matched this to a specific real product" from "fell back to generic
// category guidance," a distinction RuleSourceBadge's Measured/Generic split
// doesn't capture (both cases render as "Generic" there).
export function IdentifiedBadge({ identified, matchedProductName, className = '' }: IdentifiedBadgeProps) {
  if (identified === undefined) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border-2 border-[#2D3436] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide bg-[#F1F2F6] text-slate-500 ${className}`}
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        Identifying…
      </span>
    );
  }

  return (
    <span
      title={identified ? `Matched to ${matchedProductName}` : 'No specific product match found'}
      className={`inline-flex items-center gap-1 rounded-full border-2 border-[#2D3436] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${
        identified ? 'bg-[#3498DB] text-white' : 'bg-[#F1F2F6] text-slate-500'
      } ${className}`}
    >
      {identified ? <BadgeCheck className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
      {identified ? 'Identified' : 'Not Identified'}
    </span>
  );
}
