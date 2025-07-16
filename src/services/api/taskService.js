import tasksData from "../mockData/tasks.json";

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
  }
};

export default taskService;