import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Square, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Initial placeholder tasks
const initialTasks: Task[] = [
  { id: '1', title: 'Review quarterly reports', completed: false, priority: 'high' },
  { id: '2', title: 'Schedule team meeting', completed: true, priority: 'medium' },
  { id: '3', title: 'Update project documentation', completed: false, priority: 'low' },
];

export const TaskManagementWidget = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        priority: 'medium'
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-muted';
    }
  };

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-accent" />
            Tasks
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showAddForm && (
          <div className="flex gap-2">
            <Input
              placeholder="Add new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="text-sm"
            />
            <Button size="sm" onClick={addTask}>Add</Button>
          </div>
        )}

        <div className="max-h-48 overflow-y-auto space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-2 rounded-lg border-l-2 ${getPriorityColor(task.priority)} ${
                task.completed ? 'bg-muted/20' : 'bg-muted/30 hover:bg-muted/50'
              } transition-colors cursor-pointer`}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckSquare className="h-4 w-4 text-accent flex-shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={`text-sm flex-1 ${
                task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
            View All Tasks →
          </button>
        </div>
      </CardContent>
    </>
  );
};