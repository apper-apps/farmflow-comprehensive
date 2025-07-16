const incomeSummaryService = {
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
          { field: { Name: "period_type" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "transaction" } },
          { field: { Name: "period_start_date" } },
          { field: { Name: "period_end_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("income_summary", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching income summaries:", error);
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
          { field: { Name: "period_type" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "transaction" } },
          { field: { Name: "period_start_date" } },
          { field: { Name: "period_end_date" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } }
        ]
      };
      
      const response = await apperClient.getRecordById("income_summary", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching income summary with ID ${id}:`, error);
      throw error;
    }
  },

  async getByPeriod(periodType, startDate, endDate) {
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
          { field: { Name: "period_type" } },
          { field: { Name: "total_amount" } },
          { field: { Name: "transaction" } },
          { field: { Name: "period_start_date" } },
          { field: { Name: "period_end_date" } }
        ],
        where: [
          {
            FieldName: "period_type",
            Operator: "EqualTo",
            Values: [periodType]
          },
          {
            FieldName: "period_start_date",
            Operator: "EqualTo",
            Values: [startDate]
          },
          {
            FieldName: "period_end_date",
            Operator: "EqualTo",
            Values: [endDate]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("income_summary", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching income summaries by period:", error);
      throw error;
    }
  },

  async create(summaryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [{
          Name: summaryData.name || `${summaryData.period_type} Income Summary`,
          period_type: summaryData.period_type,
          total_amount: parseFloat(summaryData.total_amount),
          transaction: summaryData.transaction ? parseInt(summaryData.transaction) : null,
          period_start_date: summaryData.period_start_date,
          period_end_date: summaryData.period_end_date
        }]
      };
      
      const response = await apperClient.createRecord("income_summary", params);
      
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
      console.error("Error creating income summary:", error);
      throw error;
    }
  },

  async update(id, summaryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const updateData = {
        Id: parseInt(id)
      };
      
      if (summaryData.name) updateData.Name = summaryData.name;
      if (summaryData.period_type) updateData.period_type = summaryData.period_type;
      if (summaryData.total_amount) updateData.total_amount = parseFloat(summaryData.total_amount);
      if (summaryData.transaction) updateData.transaction = parseInt(summaryData.transaction);
      if (summaryData.period_start_date) updateData.period_start_date = summaryData.period_start_date;
      if (summaryData.period_end_date) updateData.period_end_date = summaryData.period_end_date;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("income_summary", params);
      
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
      console.error("Error updating income summary:", error);
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
      
      const response = await apperClient.deleteRecord("income_summary", params);
      
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
      console.error("Error deleting income summary:", error);
      throw error;
    }
  }
};

export default incomeSummaryService;