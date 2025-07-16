const expenseSummaryService = {
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
      
      const response = await apperClient.fetchRecords("expense_summary", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expense summaries:", error);
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
      
      const response = await apperClient.getRecordById("expense_summary", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching expense summary with ID ${id}:`, error);
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
      
      const response = await apperClient.fetchRecords("expense_summary", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expense summaries by period:", error);
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
          Name: summaryData.name || `${summaryData.period_type} Expense Summary`,
          period_type: summaryData.period_type,
          total_amount: parseFloat(summaryData.total_amount),
          transaction: summaryData.transaction ? parseInt(summaryData.transaction) : null,
          period_start_date: summaryData.period_start_date,
          period_end_date: summaryData.period_end_date
        }]
      };
      
      const response = await apperClient.createRecord("expense_summary", params);
      
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
      console.error("Error creating expense summary:", error);
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
      
      const response = await apperClient.updateRecord("expense_summary", params);
      
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
      console.error("Error updating expense summary:", error);
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
      
      const response = await apperClient.deleteRecord("expense_summary", params);
      
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
      console.error("Error deleting expense summary:", error);
      throw error;
    }
  }
};

export default expenseSummaryService;