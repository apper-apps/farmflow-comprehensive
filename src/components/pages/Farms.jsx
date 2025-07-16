import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import FarmCard from "@/components/organisms/FarmCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    sizeUnit: "acres",
    location: ""
  });

  const sizeUnits = [
    { value: "acres", label: "Acres" },
    { value: "hectares", label: "Hectares" },
    { value: "sq_ft", label: "Square Feet" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);

      setFarms(farmsData);
      setCrops(cropsData);
      setFilteredFarms(farmsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = farms.filter(farm =>
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFarms(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await farmService.update(editingFarm.Id, formData);
        setFarms(prevFarms => 
          prevFarms.map(farm => 
            farm.Id === editingFarm.Id ? { ...farm, ...formData } : farm
          )
        );
        toast.success("Farm updated successfully!");
      } else {
        const newFarm = await farmService.create(formData);
        setFarms(prevFarms => [...prevFarms, newFarm]);
        toast.success("Farm created successfully!");
      }
      
      setShowForm(false);
      setEditingFarm(null);
      setFormData({ name: "", size: "", sizeUnit: "acres", location: "" });
      loadData();
    } catch (err) {
      toast.error("Failed to save farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      size: farm.size.toString(),
      sizeUnit: farm.sizeUnit,
      location: farm.location
    });
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        setFarms(prevFarms => prevFarms.filter(farm => farm.Id !== farmId));
        toast.success("Farm deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const getCropsCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId.toString()).length;
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
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
          <h1 className="text-3xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">Manage your farm properties</p>
        </motion.div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add Farm
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search farms by name or location..."
      />

      {/* Farm Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingFarm ? "Edit Farm" : "Add New Farm"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Farm Name" required>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter farm name"
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Size" required>
                  <Input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="0"
                    required
                  />
                </FormField>
                
                <FormField label="Unit" required>
                  <Select
                    value={formData.sizeUnit}
                    onChange={(e) => setFormData({...formData, sizeUnit: e.target.value})}
                    options={sizeUnits}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Location" required>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Enter farm location"
                  required
                />
              </FormField>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingFarm(null);
                    setFormData({ name: "", size: "", sizeUnit: "acres", location: "" });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingFarm ? "Update Farm" : "Create Farm"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Farms Grid */}
      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.Id}
              farm={farm}
              cropsCount={getCropsCount(farm.Id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={() => {}}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="MapPin"
          title="No farms found"
          description="Start by adding your first farm to manage your agricultural operations."
          actionLabel="Add Farm"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default Farms;