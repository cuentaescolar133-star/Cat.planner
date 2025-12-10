import React, { useState, useEffect } from 'react';
import { UserState, UserMode, Task, Habit, CatAccessory, ChatMessage } from './types';
import CatAvatar from './components/CatAvatar';
import Schedule from './components/Schedule';
import HabitTracker from './components/HabitTracker';
import Stats from './components/Stats';
import ChatInterface from './components/ChatInterface';
import { MessageCircle, Settings, User } from 'lucide-react';

const INITIAL_HABITS: Habit[] = [
  { id: '1', title: 'Beber Agua', streak: 0, completedDates: [] },
  { id: '2', title: 'Dormir temprano', streak: 0, completedDates: [] },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [state, setState] = useState<UserState>({
    name: '',
    mode: null,
    points: 0,
    accessory: CatAccessory.NONE,
    tasks: [],
    habits: INITIAL_HABITS,
    chatHistory: [],
    onboarded: false,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gatoPlannerState');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    setLoading(false);
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('gatoPlannerState', JSON.stringify(state));
    }
  }, [state, loading]);

  const updatePoints = (amount: number) => {
    setState(prev => ({ ...prev, points: Math.max(0, prev.points + amount) }));
  };

  // --- Handlers ---

  const handleOnboarding = (name: string, mode: UserMode) => {
    setState(prev => ({ ...prev, name, mode, onboarded: true }));
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...task, id: Date.now().toString(), completed: false };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (task) {
        // Points logic: +10 if completing, -10 if un-completing
        updatePoints(task.completed ? -10 : 10);
        return {
          ...prev,
          tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        };
      }
      return prev;
    });
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const addHabit = (title: string) => {
    const newHabit: Habit = { id: Date.now().toString(), title, streak: 0, completedDates: [] };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const toggleHabit = (id: string, date: string) => {
    setState(prev => {
      return {
        ...prev,
        habits: prev.habits.map(h => {
          if (h.id !== id) return h;
          const isCompleted = h.completedDates.includes(date);
          let newDates = h.completedDates;
          let newStreak = h.streak;

          if (isCompleted) {
            newDates = newDates.filter(d => d !== date);
            updatePoints(-20); // Penalty for unchecking
            // Simple streak logic (could be more robust)
            if (newStreak > 0) newStreak--;
          } else {
            newDates = [...newDates, date];
            updatePoints(20); // Reward
            newStreak++;
          }
          return { ...h, completedDates: newDates, streak: newStreak };
        })
      };
    });
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  const updateChatHistory = (history: ChatMessage[]) => {
    setState(prev => ({ ...prev, chatHistory: history }));
  };

  const changeAccessory = (acc: CatAccessory) => {
    setState(prev => ({ ...prev, accessory: acc }));
  };

  // --- Views ---

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-pastel-pink text-white">Cargando...</div>;

  // Onboarding View
  if (!state.onboarded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pastel-pink to-pastel-purple p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="w-40 h-40 mx-auto mb-6">
             <CatAvatar accessory={CatAccessory.NONE} mood="happy" />
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">¡Bienvenido!</h1>
          <p className="text-gray-500 mb-6">Soy Michi, tu asistente personal. ¿Cómo te llamas?</p>
          
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded-xl p-3 mb-6 focus:border-pastel-purple outline-none text-center text-lg"
            placeholder="Tu nombre"
            id="nameInput"
          />

          <p className="text-gray-500 mb-4">¿Para qué me necesitas?</p>
          <div className="grid grid-cols-2 gap-4">
             <button
               onClick={() => {
                 const name = (document.getElementById('nameInput') as HTMLInputElement).value;
                 if(name) handleOnboarding(name, UserMode.STUDENT);
               }}
               className="p-4 rounded-xl border-2 border-pastel-blue hover:bg-pastel-blue/20 transition flex flex-col items-center gap-2"
             >
               <span className="text-2xl">🎓</span>
               <span className="font-bold text-gray-700">Estudiante</span>
             </button>
             <button
                onClick={() => {
                 const name = (document.getElementById('nameInput') as HTMLInputElement).value;
                 if(name) handleOnboarding(name, UserMode.DAILY_LIFE);
               }}
               className="p-4 rounded-xl border-2 border-pastel-green hover:bg-pastel-green/20 transition flex flex-col items-center gap-2"
             >
               <span className="text-2xl">🏠</span>
               <span className="font-bold text-gray-700">Vida Diaria</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View
  const completedTasksCount = state.tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#FDF4F5] p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pastel-purple/30 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-pastel-lavender to-pastel-purple opacity-30"></div>
             <div className="relative z-10">
               <div className="w-40 h-40 mx-auto mb-2 cursor-pointer" onClick={() => setShowChat(true)}>
                 <CatAvatar accessory={state.accessory} mood="happy" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">Hola, {state.name}</h2>
               <p className="text-sm text-gray-500 mb-4">{state.mode}</p>
               
               <div className="flex justify-center gap-2 mb-4">
                  {Object.values(CatAccessory).map((acc) => (
                    <button
                      key={acc}
                      onClick={() => changeAccessory(acc)}
                      className={`text-xs px-2 py-1 rounded-full border ${state.accessory === acc ? 'bg-pastel-purple text-white' : 'text-gray-500'}`}
                    >
                      {acc}
                    </button>
                  ))}
               </div>

               <button
                 onClick={() => setShowChat(true)}
                 className="bg-pastel-purple text-white px-6 py-2 rounded-full font-medium shadow-md hover:bg-pastel-lavender transition flex items-center gap-2 mx-auto"
               >
                 <MessageCircle size={18} /> Hablar con Michi
               </button>
             </div>
          </div>
          <Stats completed={completedTasksCount} total={state.tasks.length} points={state.points} />
        </div>

        {/* Center Column: Schedule */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto">
          <Schedule
            tasks={state.tasks}
            onAdd={addTask}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>

        {/* Right Column: Habits */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto">
          <HabitTracker
            habits={state.habits}
            onAdd={addHabit}
            onToggle={toggleHabit}
            onDelete={deleteHabit}
          />
        </div>

      </div>

      {/* Floating Chat Button (Mobile) */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 lg:hidden bg-pastel-purple text-white p-4 rounded-full shadow-xl z-40 hover:scale-110 transition"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Interface Modal */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        userState={state}
        updateHistory={updateChatHistory}
      />
    </div>
  );
}

export default App;
