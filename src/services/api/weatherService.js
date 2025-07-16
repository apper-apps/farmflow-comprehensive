const weatherService = {
  async getForecast() {
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
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "condition" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "humidity" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("weather", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      throw error;
    }
  },

  async getToday() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const today = new Date().toISOString().split("T")[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "condition" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "humidity" } }
        ],
        where: [
          {
            FieldName: "date",
            Operator: "EqualTo",
            Values: [today]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("weather", params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      // Fallback to get latest weather if today's not found
      const fallbackParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "date" } },
          { field: { Name: "temp_high" } },
          { field: { Name: "temp_low" } },
          { field: { Name: "condition" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "humidity" } }
        ],
        orderBy: [
          {
            fieldName: "date",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const fallbackResponse = await apperClient.fetchRecords("weather", fallbackParams);
      
      if (!fallbackResponse.success) {
        throw new Error(fallbackResponse.message);
      }
      
      return fallbackResponse.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching today's weather:", error);
      throw error;
    }
  }
};
export default weatherService;