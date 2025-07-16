import cropsData from "../mockData/crops.json";

let crops = [...cropsData];

const cropService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...crops]);
      }, 300);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const crop = crops.find(c => c.Id === parseInt(id));
        if (crop) {
          resolve({ ...crop });
        } else {
          reject(new Error("Crop not found"));
        }
      }, 200);
    });
  },

  async getByFarm(farmId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farmCrops = crops.filter(c => c.farmId === farmId.toString());
        resolve([...farmCrops]);
      }, 250);
    });
  },

  async create(cropData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCrop = {
          ...cropData,
          Id: Math.max(...crops.map(c => c.Id)) + 1
        };
        crops.push(newCrop);
        resolve({ ...newCrop });
      }, 400);
    });
  },

  async update(id, cropData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = crops.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          crops[index] = { ...crops[index], ...cropData };
          resolve({ ...crops[index] });
        } else {
          reject(new Error("Crop not found"));
        }
      }, 350);
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = crops.findIndex(c => c.Id === parseInt(id));
        if (index !== -1) {
          crops.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Crop not found"));
        }
      }, 250);
    });
  }
};

export default cropService;