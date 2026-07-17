import { useEffect } from 'react';

export type FloatingScoreTone = 'save' | 'damage';

interface FloatingScoreTextProps {
  id: string;
  text: string;
  tone: FloatingScoreTone;
  /** Index among concurrently-visible items, so a save + damage text in the
   * same round don't render exactly on top of each other. */
  offsetIndex?: number;
  onDone: (id: string) => void;
}

// Ephemeral rising/fading text. Self-removes via setTimeout rather than
// onAnimationEnd — prefers-reduced-motion can suppress the animation
// entirely, and that event would then never fire, leaking the node.
export function FloatingScoreText({ id, text, tone, offsetIndex = 0, onDone }: FloatingScoreTextProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), 1300);
    return () => clearTimeout(timer);
  }, [id, onDone]);

  return (
    <div
      className={`float-up-fade pointer-events-none absolute left-1/2 text-lg font-black uppercase whitespace-nowrap z-30 ${
        tone === 'save' ? 'text-[#2ECC71]' : 'text-[#E74C3C]'
      }`}
      style={{ textShadow: '0 2px 0 #2D3436', top: `${40 + offsetIndex * 16}%` }}
    >
      {text}
    </div>
  );
}
