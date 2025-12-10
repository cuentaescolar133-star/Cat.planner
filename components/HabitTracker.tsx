import React from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onAdd: (title: string) => void;
  onToggle: (id: string, date: string) => void;
  onDelete: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onAdd, onToggle, onDelete }) => {
  const [newHabit, setNewHabit] = React.useState('');
  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (newHabit.trim()) {
      onAdd(newHabit);
      setNewHabit('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-pastel-green/30 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">🌱</span> Buenos Hábitos
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nuevo hábito (ej. Beber agua)"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-green"
        />
        <button
          onClick={handleAdd}
          className="bg-pastel-green text-green-800 p-2 rounded-lg hover:bg-green-200 transition"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {habits.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic">No hay hábitos aún. ¡Añade uno!</p>
        )}
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          return (
            <div
              key={habit.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isCompletedToday
                  ? 'bg-pastel-green/20 border-pastel-green'
                  : 'bg-gray-50 border-gray-100 hover:border-pastel-green/50'
              }`}
            >
              <div className="flex items-center gap-3">
                 <button
                   onClick={() => onToggle(habit.id, today)}
                   className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                     isCompletedToday ? 'bg-pastel-green text-green-800' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                   }`}
                 >
                   <Check size={16} />
                 </button>
                 <div>
                   <span className={`block font-medium ${isCompletedToday ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                     {habit.title}
                   </span>
                   <span className="text-xs text-gray-400">Racha: {habit.streak} días</span>
                 </div>
              </div>
              <button onClick={() => onDelete(habit.id)} className="text-gray-300 hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
