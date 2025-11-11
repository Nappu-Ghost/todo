import React from 'react';
import { View } from 'react-native';
import { Text } from './nativewindui/Text';

interface TaskStatsProps {
  todoCount: number;
  completedCount: number;
}

export function TaskStats({ todoCount, completedCount }: TaskStatsProps) {
  const total = todoCount + completedCount || 1;
  const completionPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <View className="mx-6 mb-6 overflow-hidden rounded-3xl bg-white/95 p-6 shadow-lg" style={{ elevation: 4 }}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Progress</Text>
        <View className="rounded-full bg-purple-100 px-4 py-1.5">
          <Text className="text-sm font-bold text-purple-700">{completionPercentage}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-6 h-3 overflow-hidden rounded-full bg-gray-200">
        <View 
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" 
          style={{ 
            width: `${completionPercentage}%`,
            backgroundColor: '#a855f7'
          }}
        />
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-blue-50 p-4">
          <Text className="text-3xl font-black text-blue-600">{todoCount}</Text>
          <Text className="mt-1 text-sm font-semibold text-blue-600/70">Active</Text>
        </View>
        
        <View className="flex-1 rounded-2xl bg-green-50 p-4">
          <Text className="text-3xl font-black text-green-600">{completedCount}</Text>
          <Text className="mt-1 text-sm font-semibold text-green-600/70">Done</Text>
        </View>
      </View>
    </View>
  );
}
