import farmsData from "../mockData/farms.json";

let farms = [...farmsData];

const farmService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...farms]);
      }, 300);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const farm = farms.find(f => f.Id === parseInt(id));
        if (farm) {
          resolve({ ...farm });
        } else {
          reject(new Error("Farm not found"));
        }
      }, 200);
    });
  },

  async create(farmData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFarm = {
          ...farmData,
          Id: Math.max(...farms.map(f => f.Id)) + 1,
          createdAt: new Date().toISOString()
        };
        farms.push(newFarm);
        resolve({ ...newFarm });
      }, 400);
    });
  },

  async update(id, farmData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = farms.findIndex(f => f.Id === parseInt(id));
        if (index !== -1) {
          farms[index] = { ...farms[index], ...farmData };
          resolve({ ...farms[index] });
        } else {
          reject(new Error("Farm not found"));
        }
      }, 350);
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = farms.findIndex(f => f.Id === parseInt(id));
        if (index !== -1) {
          farms.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Farm not found"));
        }
      }, 250);
    });
  }
};

export default farmService;