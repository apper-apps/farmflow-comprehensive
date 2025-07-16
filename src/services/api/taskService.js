import tasksData from "../mockData/tasks.json";
import React from "react";
import Error from "@/components/ui/Error";

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...tasks]);
      }, 300);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = tasks.find(t => t.Id === parseInt(id));
        if (task) {
          resolve({ ...task });
        } else {
          reject(new Error("Task not found"));
        }
      }, 200);
    });
  },

  async getByFarm(farmId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farmTasks = tasks.filter(t => t.farmId === farmId.toString());
        resolve([...farmTasks]);
      }, 250);
    });
  },

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          Id: Math.max(...tasks.map(t => t.Id)) + 1,
          completed: false
        };
        tasks.push(newTask);
        resolve({ ...newTask });
      }, 400);
    });
  },

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...taskData };
          resolve({ ...tasks[index] });
        } else {
          reject(new Error("Task not found"));
        }
      }, 350);
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = tasks.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          tasks.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Task not found"));
        }
}, 250);
    });
  },

  async getNotifications() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const notifications = tasks
          .filter(task => !task.completed)
          .map(task => {
            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));
            
            let notificationType = null;
            if (hoursDiff <= 1 && hoursDiff > 0) notificationType = "urgent";
            else if (daysDiff <= 1 && daysDiff > 0) notificationType = "warning";
            else if (daysDiff <= 3 && daysDiff > 0) notificationType = "info";
            
            return notificationType ? {
              taskId: task.Id,
              title: task.title,
              dueDate: task.dueDate,
              priority: task.priority,
              type: notificationType,
              message: `Task "${task.title}" is due ${daysDiff <= 1 ? 'today' : `in ${daysDiff} days`}`
            } : null;
          })
          .filter(notification => notification !== null);
        
        resolve(notifications);
      }, 200);
    });
  }
};

export default taskService;