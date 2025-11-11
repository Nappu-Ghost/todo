import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
        className={`flex-row items-center rounded-2xl px-5 py-4 ${
          task.completed ? 'bg-gray-100 border border-gray-200' : 'bg-black'
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-1 flex-row items-center gap-4">
          <View className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
            task.completed ? 'bg-black border-black' : 'bg-white border-white'
          }`}>
            {task.completed && (
              <Text className="text-sm font-bold text-white">✓</Text>
            )}
          </View>
          
          <View className="flex-1">
            <Text className={`text-base font-semibold ${
              task.completed ? 'text-gray-400 line-through' : 'text-white'
            }`}>
              {task.title}
            </Text>
            {task.description && (
              <Text className={`mt-1 text-sm ${
                task.completed ? 'text-gray-300' : 'text-white/70'
              }`} numberOfLines={1}>
                {task.description}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          className="ml-2 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className={`text-base ${task.completed ? 'text-gray-400' : 'text-white'}`}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
