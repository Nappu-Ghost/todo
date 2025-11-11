import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, Modal, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/nativewindui/Text';
import { TaskItem } from '@/components/TaskItem';
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
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

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

  const filteredTasks = getFilteredTasks();
  const todoTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="border-b border-gray-200 px-6 pb-6 pt-8">
          <Text className="text-5xl font-black text-black">The Todo App</Text>
          <Text className="mt-2 text-base text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>

        {/* Active Tab Content */}
        {activeTab === 'active' && (
          <>
            {todoTasks.length > 0 ? (
              <View className="px-6 pt-6">
                <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Active ({todoTasks.length})
                </Text>
                {todoTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </View>
            ) : (
              <View className="items-center justify-center px-8 py-20">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Text className="text-5xl">✓</Text>
                </View>
                <Text className="text-center text-xl font-bold text-black">All Clear!</Text>
                <Text className="mt-2 text-center text-base text-gray-500">
                  You have no active tasks.
                  Tap the + button to create your first task
                </Text>
              </View>
            )}
          </>
        )}

        {/* Completed Tab Content */}
        {activeTab === 'completed' && (
          <>
            {completedTasks.length > 0 ? (
              <View className="px-6 pt-6">
                <Text className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Completed ({completedTasks.length})
                </Text>
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))}
              </View>
            ) : (
              <View className="items-center justify-center px-8 py-20">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Text className="text-5xl">○</Text>
                </View>
                <Text className="text-center text-xl font-bold text-black">Nothing Yet</Text>
                <Text className="mt-2 text-center text-base text-gray-500">
                  Complete some tasks to see them here
                </Text>
              </View>
            )}
          </>
        )}

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View 
        className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`flex-1 rounded-2xl py-4 ${
              activeTab === 'active' ? 'border-2 border-black' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-center text-base font-bold text-black">
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            className={`flex-1 rounded-2xl py-4 ${
              activeTab === 'completed' ? 'border-2 border-black' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text className="text-center text-base font-bold text-black">
              Completed
            </Text>
          </TouchableOpacity>

          {/* Add Button */}
          <TouchableOpacity
            onPress={() => setIsAddModalVisible(true)}
            className="h-14 w-14 items-center justify-center rounded-2xl bg-black"
            activeOpacity={0.7}
          >
            <Text className="text-3xl font-light text-white">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/20">
          <View className="rounded-t-3xl bg-white px-6 pb-8 pt-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-black">New Task</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Text className="text-3xl font-light text-gray-400">×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              className="mb-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-black"
              placeholder="Task title"
              placeholderTextColor="#9ca3af"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />

            <TextInput
              className="mb-6 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-base text-black"
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
              className="rounded-2xl bg-black py-4"
              activeOpacity={0.7}
            >
              <Text className="text-center text-base font-bold text-white">Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
