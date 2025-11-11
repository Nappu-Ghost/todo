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
        className="flex-row items-center justify-between rounded-2xl bg-white/95 px-5 py-4 shadow-sm"
        activeOpacity={0.7}
        style={{ elevation: 2 }}
      >
        <View className="flex-1 flex-row items-center gap-4">
          <View className={`h-6 w-6 items-center justify-center rounded-full ${
            task.completed ? 'bg-green-500' : 'border-2 border-purple-400 bg-white'
          }`}>
            {task.completed && (
              <Text className="text-sm font-bold text-white">✓</Text>
            )}
          </View>
          
          <View className="flex-1">
            <Text className={`text-base font-semibold ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </Text>
            {task.description && (
              <Text className="mt-1 text-sm text-gray-500" numberOfLines={1}>
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
          <Text className="text-lg text-red-500">🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
