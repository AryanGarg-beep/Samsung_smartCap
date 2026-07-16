import { Trophy, Zap, Leaf, Award, CheckCircle2, Box, ArrowRight } from 'lucide-react';

const STATS = [
  { label: 'Current XP', val: '7,420', icon: Trophy, color: '#F1C40F' },
  { label: 'Energy Saved', val: '150 kWh', icon: Zap, color: '#3498DB' },
  { label: 'CO₂ Reduced', val: '112 kg', icon: Leaf, color: '#2ECC71' },
  { label: 'Money Saved', val: '₹1,240', icon: Award, color: '#9B59B6' },
];

const ACHIEVEMENTS = [
  { title: 'Completed Energy Challenge', desc: 'Maintained low usage for 7 days.', done: true },
  { title: 'AI Energy Mode Fan', desc: 'Used AI Mode for 20 days straight.', done: true },
  { title: 'Reduced Standby Leak', desc: 'Automated TV standby power off.', done: true },
  { title: 'Appliance Upgrader', desc: 'Replace 2 old appliances.', done: false },
];

export function EnergyRank() {
  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <header className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="inline-block bg-[#F1C40F] border-4 border-[#2D3436] rounded-2xl px-6 py-2 shadow-[0_6px_0_0_#2D3436] transform -rotate-1">
          <h1
            className="text-3xl md:text-5xl font-black text-white tracking-wider uppercase"
            style={{ WebkitTextStroke: '1.5px #2D3436' }}
          >
            Samsung Rewards
          </h1>
        </div>
        <p className="text-lg font-bold text-slate-600 bg-white px-4 py-1 rounded-full border-2 border-slate-300 shadow-sm">
          Earn XP by saving electricity and upgrading!
        </p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="bg-white border-4 border-[#2D3436] p-4 rounded-2xl shadow-[0_6px_0_0_#2D3436] text-center flex flex-col items-center"
          >
            <stat.icon className="w-8 h-8 mb-2" style={{ color: stat.color }} />
            <span className="text-xl font-black text-[#2D3436]">{stat.val}</span>
            <span className="text-xs font-bold text-slate-500 uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div className="bg-white border-4 border-[#2D3436] rounded-2xl p-6 shadow-[0_8px_0_0_#2D3436]">
        <div className="flex justify-between text-sm font-black uppercase text-[#2D3436] mb-4">
          <span>Level: Eco Champion</span>
          <span>Next: 9,000 XP</span>
        </div>
        <div className="h-8 bg-[#F1F2F6] rounded-full border-4 border-[#2D3436] overflow-hidden relative">
          <div className="absolute h-full bg-[#F1C40F] w-[82%] rank-progress border-r-4 border-[#2D3436]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.2)_0%,transparent_50%)] bg-[length:20px_100%]"></div>
        </div>
        <p className="text-center text-xs font-bold text-slate-500 mt-3">1,580 XP remaining to unlock Smart Living Expert</p>
      </div>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-2xl font-black uppercase text-[#2D3436] mb-6">Recent Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach, i) => (
            <div
              key={i}
              className={`p-4 border-4 border-[#2D3436] rounded-2xl flex items-start gap-4 shadow-[0_6px_0_0_#2D3436] ${
                ach.done ? 'bg-[#D5F5E3]' : 'bg-slate-100 opacity-70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full border-2 border-[#2D3436] flex items-center justify-center shrink-0 ${
                  ach.done ? 'bg-[#2ECC71] text-white' : 'bg-slate-300'
                }`}
              >
                {ach.done ? <CheckCircle2 className="w-6 h-6" /> : <Box className="w-5 h-5 text-slate-500" />}
              </div>
              <div>
                <h4 className="font-black text-[#2D3436]">{ach.title}</h4>
                <p className="text-xs font-bold text-slate-600">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrades Section */}
      <div className="bg-[#D4E6F1] border-4 border-[#2D3436] rounded-[32px] p-6 shadow-[0_12px_0_0_#2D3436]">
        <h2 className="text-2xl font-black uppercase text-[#2D3436] mb-6 text-center">Upgrade & Earn XP</h2>

        <div className="bg-white rounded-2xl border-4 border-[#2D3436] p-5 shadow-[0_6px_0_0_#2D3436]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <span className="text-xs font-black text-slate-400 uppercase">Current</span>
              <h4 className="text-lg font-black text-slate-600 line-through">Old Split AC (1850W)</h4>
            </div>

            <ArrowRight className="w-8 h-8 text-[#3498DB] shrink-0 rotate-90 md:rotate-0" />

            <div className="text-center md:text-left flex-1">
              <span className="text-xs font-black text-[#3498DB] uppercase">Recommendation</span>
              <h4 className="text-lg font-black text-[#2D3436]">Samsung WindFree™ AI AC (1180W)</h4>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
            <span className="bg-[#D5F5E3] border-2 border-[#2ECC71] text-[#2ECC71] px-3 py-1 rounded-lg text-xs font-black">
              +500 XP Reward
            </span>
            <span className="bg-[#FFEAA7] border-2 border-[#F1C40F] text-[#856404] px-3 py-1 rounded-lg text-xs font-black">
              Save ₹520/month
            </span>
            <span className="bg-slate-100 border-2 border-slate-300 text-slate-600 px-3 py-1 rounded-lg text-xs font-black">
              Save 42 kWh/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
