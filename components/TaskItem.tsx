import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './nativewindui/Text';
import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isAnimating?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, isAnimating = false }: TaskItemProps) {
  // Animation values
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const checkmarkOpacity = useRef(new Animated.Value(0)).current;
  const strikethroughWidth = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Run animation sequence when isAnimating becomes true
  useEffect(() => {
    if (isAnimating) {
      // Reset animations
      checkmarkScale.setValue(0);
      checkmarkOpacity.setValue(0);
      strikethroughWidth.setValue(0);
      slideAnim.setValue(0);
      fadeAnim.setValue(1);

      // Sequence: checkmark -> strikethrough -> slide away (total: 2s)
      Animated.sequence([
        // 1. Green checkmark appears with bounce (0.3s animation)
        Animated.parallel([
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(checkmarkOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Wait after checkmark (0.15s)
        Animated.delay(150),
        // 2. Strikethrough appears (1s - same as before)
        Animated.timing(strikethroughWidth, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        // Wait after strikethrough (0.1s)
        Animated.delay(100),
        // 3. Slide away and fade (0.45s)
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Reset animations when uncompleted
      checkmarkScale.setValue(0);
      checkmarkOpacity.setValue(0);
      strikethroughWidth.setValue(0);
      slideAnim.setValue(0);
      fadeAnim.setValue(1);
    }
  }, [isAnimating]);

  const handleCirclePress = () => {
    onToggle(task.id);
  };

  const slideTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <Animated.View 
      className="mb-3"
      style={{
        transform: [{ translateX: slideTranslateX }],
        opacity: fadeAnim,
      }}
    >
      <View
        className={`flex-row items-center rounded-2xl px-5 py-4 ${
          task.completed ? 'bg-gray-100 border border-gray-200' : 'bg-black'
        }`}
      >
        <View className="flex-1 flex-row items-center gap-4">
          {/* Circle Checkbox - Now pressable */}
          <TouchableOpacity
            onPress={handleCirclePress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
              isAnimating || task.completed ? 'bg-green-500 border-green-500' : 'bg-white border-white'
            }`}>
              {(isAnimating || task.completed) && (
                <Animated.Text 
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: 'white',
                    transform: [{ scale: checkmarkScale }],
                    opacity: checkmarkOpacity,
                  }}
                >
                  ✓
                </Animated.Text>
              )}
            </View>
          </TouchableOpacity>
          
          <View className="flex-1">
            {/* Title with animated strikethrough */}
            <View style={{ position: 'relative' }}>
              <Text className={`text-base font-semibold ${
                task.completed ? 'text-gray-400' : 'text-white'
              }`}>
                {task.title}
              </Text>
              {(isAnimating || task.completed) && (
                <Animated.View
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    height: 2,
                    backgroundColor: '#9ca3af',
                    width: strikethroughWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                />
              )}
            </View>
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
      </View>
    </Animated.View>
  );
}
