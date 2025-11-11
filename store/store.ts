import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, FilterType } from '@/types';

const STORAGE_KEY = '@todo_tasks';

interface TodoStore {
  tasks: Task[];
  filter: FilterType;
  isLoading: boolean;
  
  // Actions
  addTask: (title: string, description?: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  loadTasks: () => Promise<void>;
  
  // Computed
  getFilteredTasks: () => Task[];
  getTodoCount: () => number;
  getCompletedCount: () => number;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  filter: 'all',
  isLoading: false,
  
  addTask: (title: string, description?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    set((state) => {
      const newTasks = [...state.tasks, newTask];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  
  updateTask: (id: string, updates: Partial<Task>) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: Date.now() }
          : task
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  
  deleteTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.filter((task) => task.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  
  toggleTask: (id: string) => {
    set((state) => {
      const newTasks = state.tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: Date.now() }
          : task
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      return { tasks: newTasks };
    });
  },
  
  setFilter: (filter: FilterType) => set({ filter }),
  
  loadTasks: async () => {
    try {
      set({ isLoading: true });
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const tasks = JSON.parse(stored);
        set({ tasks, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
      set({ isLoading: false });
    }
  },
  
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    if (filter === 'todo') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  },
  
  getTodoCount: () => get().tasks.filter((t) => !t.completed).length,
  
  getCompletedCount: () => get().tasks.filter((t) => t.completed).length,
}));