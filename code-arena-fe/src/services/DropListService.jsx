import apiInterceptor from "../config/ApiInterceptor";

const DropListApi = {
    findByLabelKey: async (label) => {
        try {
            const response = await apiInterceptor.get("/drop-list", 
                { params: { labelKey: label } });
            console.info("✅ Fetched types:", response.data);
            return response.data.data;
        } catch (error) {
            console.error("❌ Error fetching types:", error);
            throw error;
        }
    },
};

export default DropListApi;