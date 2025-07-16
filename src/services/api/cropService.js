const cropService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("crop", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } }
        ]
      };
      
      const response = await apperClient.getRecordById("crop", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw error;
    }
  },

  async getByFarm(farmId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "variety" } },
          { field: { Name: "planting_date" } },
          { field: { Name: "expected_harvest_date" } },
          { field: { Name: "status" } },
          { field: { Name: "area" } },
          { field: { Name: "notes" } },
          { field: { Name: "farm_id" } }
        ],
        where: [
          {
            FieldName: "farm_id",
            Operator: "EqualTo",
            Values: [parseInt(farmId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("crop", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm:", error);
      throw error;
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: cropData.name,
          variety: cropData.variety,
          planting_date: cropData.plantingDate,
          expected_harvest_date: cropData.expectedHarvestDate,
          status: cropData.status,
          area: parseFloat(cropData.area),
          notes: cropData.notes,
          farm_id: parseInt(cropData.farmId)
        }]
      };
      
      const response = await apperClient.createRecord("crop", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (cropData.name) updateData.Name = cropData.name;
      if (cropData.variety) updateData.variety = cropData.variety;
      if (cropData.plantingDate) updateData.planting_date = cropData.plantingDate;
      if (cropData.expectedHarvestDate) updateData.expected_harvest_date = cropData.expectedHarvestDate;
      if (cropData.status) updateData.status = cropData.status;
      if (cropData.area) updateData.area = parseFloat(cropData.area);
      if (cropData.notes) updateData.notes = cropData.notes;
      if (cropData.farmId) updateData.farm_id = parseInt(cropData.farmId);
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("crop", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating crop:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("crop", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
};

export default cropService;