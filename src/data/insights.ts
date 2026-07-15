import { Activity, Wind } from 'lucide-react';
import type { Insight } from '../types';

export const insights: Insight[] = [
  {
    id: 1,
    title: 'Standby Power Detection',
    desc: 'Your Smart TV consumed 2.1 kWh while idle this week.',
    saving: '₹180/month',
    icon: Activity,
    color: '#FF6B6B',
  },
  {
    id: 2,
    title: 'Air Conditioner Optimization',
    desc: 'Increasing the temperature from 22°C → 24°C can reduce energy consumption by 11%.',
    saving: '₹240/month',
    icon: Wind,
    color: '#3498DB',
  },
];
