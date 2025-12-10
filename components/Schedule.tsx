import React from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface ScheduleProps {
  tasks: Task[];
  onAdd: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const Schedule: React.FC<ScheduleProps> = ({ tasks, onAdd, onToggle, onDelete }) => {
  const [title, setTitle] = React.useState('');
  const [time, setTime] = React.useState('');
  const [category, setCategory] = React.useState<'academic' | 'personal' | 'chore'>('personal');

  const handleAdd = () => {
    if (title.trim() && time) {
      onAdd({ title, time, category });
      setTitle('');
      setTime('');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-pastel-blue/30 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        <span className="text-2xl">📅</span> Agenda del Día
      </h2>

      <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva tarea..."
            className="col-span-2 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blue"
          >
            <option value="academic">Estudio</option>
            <option value="personal">Personal</option>
            <option value="chore">Hogar</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-pastel-blue text-blue-900 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
        >
          Agregar Tarea
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
         {sortedTasks.length === 0 && (
          <p className="text-center text-gray-400 text-sm italic mt-10">¡Todo limpio! Tómate un descanso.</p>
        )}
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-xl border group transition-all ${
              task.completed ? 'bg-gray-50 opacity-60' : 'bg-white hover:shadow-md'
            } border-l-4 ${
                task.category === 'academic' ? 'border-l-pastel-purple' : 
                task.category === 'personal' ? 'border-l-pastel-pink' : 'border-l-pastel-green'
            }`}
          >
            <button onClick={() => onToggle(task.id)} className="text-gray-400 hover:text-pastel-blue">
              {task.completed ? <CheckCircle2 className="text-pastel-green" /> : <Circle />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                <span>{task.time}</span>
                <span className="capitalize ml-2 px-2 py-0.5 rounded-full bg-gray-100">{task.category}</span>
              </div>
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
