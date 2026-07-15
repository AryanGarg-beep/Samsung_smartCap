import type { Automation } from '../types';

export const initialAutomations: Automation[] = [
  {
    id: 'peak_opt',
    name: 'Peak Hour Optimization',
    desc: 'Automatically adjusts AC temperature during peak electricity pricing.',
    savingVal: '1.4 kWh/day',
    active: true,
  },
  {
    id: 'solar_wash',
    name: 'Solar Powered Laundry',
    desc: 'Runs washing machine only when rooftop solar generation is available.',
    savingVal: '0.9 kWh/day',
    active: false,
  },
  {
    id: 'idle_heat',
    name: 'Idle Water Heater Detection',
    desc: 'Turns off water heater automatically after prolonged inactivity.',
    savingVal: '1.1 kWh/day',
    active: true,
  },
  {
    id: 'night_mode',
    name: 'Night Energy Mode',
    desc: 'Reduces unnecessary appliance consumption automatically after midnight.',
    savingVal: '0.8 kWh/day',
    active: true,
  },
];
