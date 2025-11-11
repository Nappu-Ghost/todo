import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './nativewindui/Text';

interface ActionButtonsProps {
  onDelete: () => void;
  onAdd: () => void;
}

export function ActionButtons({ onDelete, onAdd }: ActionButtonsProps) {
  return (
    <View className="mb-6 flex-row gap-3 px-6">
      <TouchableOpacity
        onPress={onDelete}
        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 shadow-lg"
        activeOpacity={0.8}
        style={{ elevation: 4 }}
      >
        <Text className="text-base font-bold text-white">🗑️ Clear Done</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={onAdd}
        className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 shadow-lg"
        activeOpacity={0.8}
        style={{ elevation: 4 }}
      >
        <Text className="text-base font-bold text-white">+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}
