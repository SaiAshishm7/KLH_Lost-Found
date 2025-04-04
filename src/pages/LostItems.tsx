
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { demoItems, categories, locations } from "@/utils/demo-data";

const LostItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [items, setItems] = useState(demoItems.filter(item => item.type === "lost"));
  const [filteredItems, setFilteredItems] = useState(items);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Get latest items on component mount
    const lostItems = demoItems.filter(item => item.type === "lost");
    setItems(lostItems);
    
    // Filter items based on search and filters
    let filtered = lostItems;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.location.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedLocation && selectedLocation !== "all") {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }
    
    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtered through the useEffect
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Lost Items</h1>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" /> {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search Lost Items</CardTitle>
            <CardDescription>Browse items reported lost by KLH University members</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by name, location, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
              
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={resetFilters}
                    className="sm:col-span-2"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Items Display */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="item-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-lost-light text-lost">
                      Lost
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(item.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  {item.image && (
                    <div className="w-full h-32 mb-2 overflow-hidden rounded-md">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm line-clamp-2">{item.location}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/item/${item.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No lost items have been reported yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              If you lost something, please report it using the "Report Item" page.
            </p>
            <Button 
              variant="default" 
              onClick={() => navigate("/report-item")}
              className="mt-4"
            >
              Report a Lost Item
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LostItems;
