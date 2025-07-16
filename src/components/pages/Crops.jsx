import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import CropTable from "@/components/organisms/CropTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [formData, setFormData] = useState({
    farmId: "",
    name: "",
    variety: "",
    plantingDate: "",
    expectedHarvestDate: "",
    status: "planted",
    area: "",
    notes: ""
  });

  const cropStatuses = [
    { value: "planted", label: "Planted" },
    { value: "growing", label: "Growing" },
    { value: "ready", label: "Ready" },
    { value: "harvested", label: "Harvested" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);

      setCrops(cropsData);
      setFarms(farmsData);
      setFilteredCrops(cropsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = crops.filter(crop =>
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.variety.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCrops(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, formData);
        setCrops(prevCrops => 
          prevCrops.map(crop => 
            crop.Id === editingCrop.Id ? { ...crop, ...formData } : crop
          )
        );
        toast.success("Crop updated successfully!");
      } else {
        const newCrop = await cropService.create(formData);
        setCrops(prevCrops => [...prevCrops, newCrop]);
        toast.success("Crop created successfully!");
      }
      
      setShowForm(false);
      setEditingCrop(null);
      setFormData({
        farmId: "",
        name: "",
        variety: "",
        plantingDate: "",
        expectedHarvestDate: "",
        status: "planted",
        area: "",
        notes: ""
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId,
      name: crop.name,
      variety: crop.variety,
      plantingDate: crop.plantingDate.split("T")[0],
      expectedHarvestDate: crop.expectedHarvestDate.split("T")[0],
      status: crop.status,
      area: crop.area.toString(),
      notes: crop.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(cropId);
        setCrops(prevCrops => prevCrops.filter(crop => crop.Id !== cropId));
        toast.success("Crop deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const handleHarvest = async (crop) => {
    try {
      await cropService.update(crop.Id, { status: "harvested" });
      setCrops(prevCrops => 
        prevCrops.map(c => 
          c.Id === crop.Id ? { ...c, status: "harvested" } : c
        )
      );
      toast.success("Crop marked as harvested!");
      loadData();
    } catch (err) {
      toast.error("Failed to update crop status");
    }
  };

  if (loading) {
    return <Loading type="table" count={5} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Crops</h1>
          <p className="text-gray-600 mt-1">Track your planted crops and harvests</p>
        </motion.div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add Crop
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search crops by name or variety..."
      />

      {/* Crop Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCrop ? "Edit Crop" : "Add New Crop"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Farm" required>
                <Select
                  value={formData.farmId}
                  onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                  options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
                  placeholder="Select a farm"
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Crop Name" required>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Tomatoes"
                    required
                  />
                </FormField>
                
                <FormField label="Variety" required>
                  <Input
                    type="text"
                    value={formData.variety}
                    onChange={(e) => setFormData({...formData, variety: e.target.value})}
                    placeholder="e.g., Roma"
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Planting Date" required>
                  <Input
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                    required
                  />
                </FormField>
                
                <FormField label="Expected Harvest" required>
                  <Input
                    type="date"
                    value={formData.expectedHarvestDate}
                    onChange={(e) => setFormData({...formData, expectedHarvestDate: e.target.value})}
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Status" required>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    options={cropStatuses}
                    required
                  />
                </FormField>
                
                <FormField label="Area (acres)" required>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    placeholder="0"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Notes">
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this crop..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-forest-500 focus:outline-none transition-colors duration-200"
                />
              </FormField>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCrop(null);
                    setFormData({
                      farmId: "",
                      name: "",
                      variety: "",
                      plantingDate: "",
                      expectedHarvestDate: "",
                      status: "planted",
                      area: "",
                      notes: ""
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCrop ? "Update Crop" : "Create Crop"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Crops Table */}
      {filteredCrops.length > 0 ? (
        <CropTable
          crops={filteredCrops}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onHarvest={handleHarvest}
        />
      ) : (
        <Empty
          icon="Sprout"
          title="No crops found"
          description="Start tracking your crops by adding your first planting."
          actionLabel="Add Crop"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default Crops;