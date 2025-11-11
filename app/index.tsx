import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, Modal, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/nativewindui/Text';
import { TaskStats } from '@/components/TaskStats';
import { TaskItem } from '@/components/TaskItem';
import { ActionButtons } from '@/components/ActionButtons';
import { useTodoStore } from '@/store/store';

export default function Home() {
  const insets = useSafeAreaInsets();
  const {
    tasks,
    loadTasks,
    addTask,
    toggleTask,
    deleteTask,
    getFilteredTasks,
    getTodoCount,
    getCompletedCount,
  } = useTodoStore();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsAddModalVisible(false);
    } else {
      Alert.alert('Oops!', 'Please enter a task title');
    }
  };

  const handleDeleteCompleted = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) {
      Alert.alert('Nothing to Delete', 'No completed tasks found');
      return;
    }

    Alert.alert(
      'Delete Completed Tasks',
      `Delete ${completedTasks.length} completed task(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            completedTasks.forEach((task) => deleteTask(task.id));
          },
        },
      ]
    );
  };

  const filteredTasks = getFilteredTasks();
  const todoTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="px-6 pb-4 pt-8">
            <Text className="text-5xl font-black text-white">My Tasks</Text>
            <Text className="mt-2 text-base text-white/80">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          {/* Stats Card */}
          <TaskStats todoCount={getTodoCount()} completedCount={getCompletedCount()} />

          {/* Action Buttons */}
          <ActionButtons
            onDelete={handleDeleteCompleted}
            onAdd={() => setIsAddModalVisible(true)}
          />

          {/* Todo Tasks */}
          {todoTasks.length > 0 && (
            <View className="mb-6 px-6">
              <Text className="mb-3 text-xl font-bold text-white">Active Tasks</Text>
              {todoTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </View>
          )}

          {/* Complete Section */}
          {completedTasks.length > 0 && (
            <View className="mb-6 px-6">
              <Text className="mb-3 text-xl font-bold text-white/90">Completed</Text>
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </View>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
            <View className="items-center justify-center px-8 py-20">
              <Text className="text-7xl">📝</Text>
              <Text className="mt-4 text-center text-xl font-semibold text-white">No Tasks Yet</Text>
              <Text className="mt-2 text-center text-base text-white/70">
                Tap the Add button to create your first task
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          className="absolute bottom-8 right-6 h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-black/30"
          activeOpacity={0.8}
          style={{ elevation: 8 }}
        >
          <Text className="text-3xl font-bold text-purple-600">+</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">New Task</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Text className="text-3xl text-gray-400">×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="mb-4 rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-base text-gray-900"
              placeholder="Task title"
              placeholderTextColor="#9ca3af"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <TextInput
              className="mb-6 rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-base text-gray-900"
              placeholder="Description (optional)"
              placeholderTextColor="#9ca3af"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleAddTask}
              className="rounded-2xl bg-purple-600 py-4 shadow-lg shadow-purple-600/30"
              activeOpacity={0.8}
              style={{ elevation: 4 }}
            >
              <Text className="text-center text-base font-bold text-white">Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
