import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsProps {
  completed: number;
  total: number;
  points: number;
}

// Mock data for the chart since we don't have historical DB
const data = [
  { name: 'Lun', points: 40 },
  { name: 'Mar', points: 65 },
  { name: 'Mie', points: 50 },
  { name: 'Jue', points: 80 },
  { name: 'Vie', points: 100 },
  { name: 'Sab', points: 30 },
  { name: 'Dom', points: 60 },
];

const Stats: React.FC<StatsProps> = ({ completed, total, points }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-pastel-pink/30">
      <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span> Tu Progreso
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pastel-cream/30 p-4 rounded-2xl text-center">
          <p className="text-3xl font-bold text-gray-700">{points}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Puntos Totales</p>
        </div>
        <div className="bg-pastel-lavender/20 p-4 rounded-2xl text-center">
           <p className="text-3xl font-bold text-gray-700">{percentage}%</p>
           <p className="text-xs text-gray-500 uppercase tracking-wide">Efectividad Hoy</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <p className="text-sm font-medium text-gray-500 mb-2 ml-2">Actividad Semanal</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="points" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FEC8D8' : '#957DAD'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
