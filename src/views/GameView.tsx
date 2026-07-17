import { useMemo, useState } from 'react';
import { Gamepad2, HelpCircle, Zap, Droplet } from 'lucide-react';
import type { Appliance, Automation, MatchState, MatchHistoryEntry } from '../types';
import {
  buildGameConfig,
  createMatch,
  activatePowerUp,
  resolveRound,
  toHistoryEntry,
  CONTROL_POINTS_PER_ROUND,
  TOTAL_BASELINE_KWH,
  TOTAL_ROUNDS,
} from '../utils/gameEngine';
import { GameTutorial } from '../components/GameTutorial';
import { FloatingScoreText, type FloatingScoreTone } from '../components/FloatingScoreText';

interface GameViewProps {
  appliances: Appliance[];
  automations: Automation[];
  matchState: MatchState;
  onMatchStateChange: (next: MatchState) => void;
  onMatchComplete: (entry: MatchHistoryEntry) => void;
  hasSeenTutorial: boolean;
  onTutorialSeen: () => void;
}

const FLOURISH_CLASS: Record<string, string> = {
  ac_sleep: 'cool-pulse',
  heater_stagger: 'clock-shift',
  laundry_stagger: 'clock-shift',
  lights_daylight: 'daylight-swap',
};

interface FloatingItem {
  id: string;
  text: string;
  tone: FloatingScoreTone;
}

export function GameView({
  appliances,
  automations,
  matchState,
  onMatchStateChange,
  onMatchComplete,
  hasSeenTutorial,
  onTutorialSeen,
}: GameViewProps) {
  const config = useMemo(() => buildGameConfig(appliances, automations), [appliances, automations]);
  const [tutorialOpen, setTutorialOpen] = useState(!hasSeenTutorial);
  const [pulsingId, setPulsingId] = useState<string | null>(null);
  const [floatingItems, setFloatingItems] = useState<FloatingItem[]>([]);

  const closeTutorial = () => {
    setTutorialOpen(false);
    onTutorialSeen();
  };

  const spawnFloatingText = (text: string, tone: FloatingScoreTone) => {
    const id = `float-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setFloatingItems((prev) => [...prev, { id, text, tone }]);
  };

  const removeFloatingText = (id: string) => {
    setFloatingItems((prev) => prev.filter((f) => f.id !== id));
  };

  if (!config.ready) {
    return (
      <div className="space-y-6 animate-fade-in pt-4">
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="inline-block bg-[#9B59B6] border-4 border-[#2D3436] rounded-2xl px-6 py-2 shadow-[0_6px_0_0_#2D3436]">
            <h1 className="text-2xl font-black text-white uppercase flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" /> Game
            </h1>
          </div>
        </header>
        <div className="toy-card p-6 text-center max-w-md mx-auto">
          <p className="font-bold text-[#2D3436]">
            This match needs all 5 real measured appliances/automations to play.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Nothing is saved in this app, so reloading the page restores them.
          </p>
          {config.missingApplianceIds.length > 0 && (
            <p className="text-xs text-slate-400 mt-3">Missing appliances: {config.missingApplianceIds.join(', ')}</p>
          )}
          {config.missingAutomationIds.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">Missing automations: {config.missingAutomationIds.join(', ')}</p>
          )}
        </div>
      </div>
    );
  }

  const handleStart = () => {
    onMatchStateChange(createMatch(config));
  };

  const handleToggle = (automationId: string) => {
    const next = activatePowerUp(matchState, automationId);
    onMatchStateChange(next);
    if (next !== matchState && next.activationsThisRound.includes(automationId)) {
      setPulsingId(automationId);
      setTimeout(() => setPulsingId(null), 600);
    }
  };

  const handleResolveRound = () => {
    const nextState = resolveRound(matchState, config);
    onMatchStateChange(nextState);

    const lastResult = nextState.roundResults[nextState.roundResults.length - 1];
    if (lastResult) {
      if (lastResult.kwhSaved > 0) {
        spawnFloatingText(`+${lastResult.kwhSaved.toFixed(2)} kWh saved`, 'save');
      }
      if (lastResult.comboDamageKwh > 0) {
        spawnFloatingText(`-${lastResult.comboDamageKwh.toFixed(2)} kWh combo damage`, 'damage');
      }
    }

    if (nextState.status === 'complete') {
      onMatchComplete(toHistoryEntry(nextState));
    }
  };

  const handlePlayAgain = () => {
    onMatchStateChange(createMatch(config));
  };

  const roundDef = matchState.rounds.find((r) => r.round === matchState.currentRound);

  // Live score: the same formula as the final score, computed from completed
  // rounds so far — baseline minus what's been saved, plus combo damage taken.
  // Lower is better, exactly like the final score at match end.
  const liveProjectedKwh = TOTAL_BASELINE_KWH - matchState.totalKwhSaved + matchState.totalComboDamageKwh;
  const liveScorePct = Math.min(100, Math.max(0, (liveProjectedKwh / TOTAL_BASELINE_KWH) * 100));

  return (
    <div className="space-y-6 animate-fade-in pt-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-block bg-[#9B59B6] border-4 border-[#2D3436] rounded-2xl px-6 py-2 shadow-[0_6px_0_0_#2D3436]">
          <h1 className="text-2xl font-black text-white uppercase flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" /> Game
          </h1>
        </div>
        <button
          onClick={() => setTutorialOpen(true)}
          className="w-11 h-11 bg-white border-4 border-[#2D3436] rounded-full flex items-center justify-center shadow-[0_4px_0_0_#2D3436] hover:translate-y-1 hover:shadow-none transition-all"
          title="How to play"
        >
          <HelpCircle className="w-5 h-5 text-[#3498DB]" />
        </button>
      </header>

      {tutorialOpen && <GameTutorial onClose={closeTutorial} />}

      {matchState.status === 'not_started' && (
        <div className="toy-card p-8 text-center max-w-md mx-auto space-y-4">
          <p className="font-bold text-[#2D3436]">
            Play through {TOTAL_ROUNDS} real rounds from this household's data. Beat the {TOTAL_BASELINE_KWH} kWh
            unmanaged baseline to win the week.
          </p>
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl border-4 border-[#2D3436] text-lg font-black uppercase bg-[#2ECC71] text-white shadow-[0_8px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_4px_0_0_#2D3436] active:translate-y-2 active:shadow-none transition-all"
          >
            Start Match
          </button>
        </div>
      )}

      {matchState.status === 'in_progress' && roundDef && (
        <div className="relative space-y-6">
          <div className="toy-card p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#2D3436] uppercase">
                Round {matchState.currentRound} / {TOTAL_ROUNDS}
                {roundDef.isLaundryRound && (
                  <span className="ml-2 text-xs bg-[#D4E6F1] text-[#3498DB] border-2 border-[#3498DB] px-2 py-1 rounded-lg align-middle">
                    Laundry Day
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-500 font-bold">This round's real stake: {roundDef.baselineKwh.toFixed(2)} kWh</p>
            </div>
            <div className="flex gap-1.5">
              {[...Array(CONTROL_POINTS_PER_ROUND)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-[#2D3436] ${
                    i < matchState.controlPointsRemaining ? 'bg-[#F1C40F]' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Live score — same bar style as Dashboard's Live Power Draw */}
          <div className="toy-card p-5">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-black text-[#2D3436] uppercase">Live Score</h3>
              <span className="text-lg font-black text-[#2D3436]">
                {liveProjectedKwh.toFixed(2)} <span className="text-sm text-slate-400">/ {TOTAL_BASELINE_KWH} kWh</span>
              </span>
            </div>
            <div className="h-8 bg-[#F1F2F6] rounded-full border-4 border-[#2D3436] overflow-hidden relative shadow-inner">
              <div
                className="h-full energy-bar transition-all duration-700 ease-out"
                style={{ width: `${liveScorePct}%` }}
              />
              <div className="absolute top-0 left-0 w-full h-1/3 bg-white opacity-30 rounded-full" />
            </div>
            <p className="text-center text-xs font-bold text-slate-500 mt-2">Lower is better — this is where you'd finish if the match ended right now.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roundDef.activatableAutomationIds.map((automationId) => {
              const automation = automations.find((a) => a.id === automationId);
              if (!automation) return null;
              const appliance = appliances.find((a) => a.id === automation.applianceIds[0]);
              const Icon = appliance?.icon ?? Zap;
              const isActive = matchState.activationsThisRound.includes(automationId);
              const isPulsing = pulsingId === automationId;
              return (
                <button
                  key={automationId}
                  onClick={() => handleToggle(automationId)}
                  className={`toy-card p-4 flex items-center gap-4 text-left ${isActive ? 'bg-[#D5F5E3]' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full border-4 border-[#2D3436] flex items-center justify-center bg-white shrink-0 ${isPulsing ? FLOURISH_CLASS[automationId] : ''}`}>
                    <Icon className="w-6 h-6" style={{ color: appliance?.accent }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[#2D3436] text-sm">{automation.name}</h4>
                    <p className="text-xs text-slate-500 font-bold">{automation.desc}</p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border-2 shrink-0 ${
                      isActive ? 'bg-[#2ECC71] text-white border-[#2ECC71]' : 'bg-white text-slate-500 border-slate-300'
                    }`}
                  >
                    {isActive ? 'Active' : '1 pt'}
                  </span>
                </button>
              );
            })}

            {/* Fridge — always on, free, no toggle */}
            <div className="toy-card p-4 flex items-center gap-4 text-left opacity-90 cursor-default">
              <div className="w-12 h-12 rounded-full border-4 border-[#2D3436] flex items-center justify-center bg-white shrink-0">
                <Droplet className="w-6 h-6 text-[#3498DB]" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-[#2D3436] text-sm">Monitor for abnormal refrigerator draw</h4>
                <p className="text-xs text-slate-500 font-bold">Fault detection only — always on, no cost.</p>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg border-2 bg-[#F1F2F6] text-slate-500 border-slate-300 shrink-0">
                Free
              </span>
            </div>
          </div>

          <button
            onClick={handleResolveRound}
            className="w-full py-4 rounded-2xl border-4 border-[#2D3436] text-lg font-black uppercase bg-[#3498DB] text-white shadow-[0_8px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_4px_0_0_#2D3436] active:translate-y-2 active:shadow-none transition-all"
          >
            Resolve Round
          </button>

          {floatingItems.map((item, i) => (
            <FloatingScoreText
              key={item.id}
              id={item.id}
              text={item.text}
              tone={item.tone}
              offsetIndex={i}
              onDone={removeFloatingText}
            />
          ))}
        </div>
      )}

      {matchState.status === 'complete' && (
        <div className="toy-card p-8 text-center max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-black text-[#2D3436] uppercase">Week Complete!</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#D5F5E3] border-4 border-[#2D3436] rounded-2xl p-4">
              <span className="block text-xs font-black uppercase text-slate-500">Final Score</span>
              <p className="text-2xl font-black text-[#2ECC71]">{matchState.finalScoreKwh?.toFixed(2)} kWh</p>
            </div>
            <div className="bg-[#FFEAA7] border-4 border-[#2D3436] rounded-2xl p-4">
              <span className="block text-xs font-black uppercase text-slate-500">XP Earned</span>
              <p className="text-2xl font-black text-[#F1C40F]">{matchState.xpEarned}</p>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500">
            Baseline (no power-ups): {TOTAL_BASELINE_KWH} kWh. You saved{' '}
            {matchState.totalKwhSaved.toFixed(2)} kWh and took {matchState.totalComboDamageKwh.toFixed(2)} kWh in
            combo damage.
          </p>
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 rounded-2xl border-4 border-[#2D3436] text-lg font-black uppercase bg-[#2ECC71] text-white shadow-[0_8px_0_0_#2D3436] hover:translate-y-1 hover:shadow-[0_4px_0_0_#2D3436] active:translate-y-2 active:shadow-none transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
