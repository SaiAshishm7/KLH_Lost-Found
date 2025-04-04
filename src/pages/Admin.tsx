
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoItems, Item } from "@/utils/demo-data";
import { Search, CheckCircle, AlertCircle } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(demoItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>(demoItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    // Filter items based on search and filters
    let filtered = items;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.reportedBy.name.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    setFilteredItems(filtered);
  }, [searchQuery, statusFilter, typeFilter, items]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "claimed":
        return "bg-blue-100 text-blue-800";
      case "unclaimed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{items.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {items.filter(item => item.status === "claimed").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Lost Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {items.filter(item => item.type === "lost").length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Found Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {items.filter(item => item.type === "found").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setTypeFilter("all")}>All Items</TabsTrigger>
            <TabsTrigger value="lost" onClick={() => setTypeFilter("lost")}>Lost Items</TabsTrigger>
            <TabsTrigger value="found" onClick={() => setTypeFilter("found")}>Found Items</TabsTrigger>
            <TabsTrigger value="claimed" onClick={() => setStatusFilter("claimed")}>Pending Claims</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Manage Items</CardTitle>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    <Button type="submit" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1 flex flex-col">
                    <span className="text-sm font-medium mb-1">Status</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                        <SelectItem value="unclaimed">Unclaimed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <span className="text-sm font-medium mb-1">Type</span>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="found">Found</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left">Item Name</th>
                          <th className="px-4 py-3 text-left">Type</th>
                          <th className="px-4 py-3 text-left">Category</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Reported By</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/30">
                              <td className="px-4 py-3">{item.name}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.type === 'lost' 
                                    ? 'bg-lost-light text-lost' 
                                    : 'bg-found-light text-found'
                                }`}>
                                  {item.type === 'lost' ? 'Lost' : 'Found'}
                                </span>
                              </td>
                              <td className="px-4 py-3">{item.category}</td>
                              <td className="px-4 py-3">
                                {new Date(item.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(item.status)}`}>
                                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-3">{item.reportedBy.name}</td>
                              <td className="px-4 py-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => navigate(`/item/${item.id}`)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                              No items found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Claims Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.filter(item => item.status === "claimed").length > 0 ? (
                items
                  .filter(item => item.status === "claimed")
                  .map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between border-b py-4 last:border-0"
                    >
                      <div>
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Claimed by {item.claimedBy?.name} on {" "}
                          {item.claimDate && new Date(item.claimDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/item/${item.id}`)}
                      >
                        Review
                      </Button>
                    </div>
                  ))
              ) : (
                <div className="flex justify-center items-center py-8 text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                    <span>No pending claims requiring attention</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
