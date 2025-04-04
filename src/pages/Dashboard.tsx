
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { demoItems } from "@/utils/demo-data";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentItems, setRecentItems] = useState(demoItems.slice(0, 5));
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0,
    returningToday: 0
  });

  useEffect(() => {
    // Calculate stats from demo data
    const lost = demoItems.filter(item => item.type === "lost").length;
    const found = demoItems.filter(item => item.type === "found").length;
    const claimed = demoItems.filter(item => item.status === "claimed").length;
    
    setStats({
      lostItems: lost,
      foundItems: found,
      claimedItems: claimed,
      returningToday: Math.min(2, lost + found) // Just for demo purposes
    });
    
    // Filter recent items (last 5)
    setRecentItems(demoItems.slice(0, 5));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <Button 
            onClick={() => navigate("/report-item")}
            className="bg-klh hover:bg-klh/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Report Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-lost-light border-lost">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Lost Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.lostItems}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-found-light border-found">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Found Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.foundItems}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Claimed Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.claimedItems}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Returning Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.returningToday}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Search</CardTitle>
            <CardDescription>Looking for something specific?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Search by item name, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" onClick={() => navigate(`/lost-items?search=${searchQuery}`)}>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recently Reported Items */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recently Reported Items</h2>
          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentItems.map((item) => (
                <Card key={item.id} className="item-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'lost' 
                          ? 'bg-lost-light text-lost' 
                          : 'bg-found-light text-found'
                      }`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
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
                No items have been reported yet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to report a lost or found item!
              </p>
              <Button 
                variant="default" 
                onClick={() => navigate("/report-item")}
                className="mt-4"
              >
                Report an Item
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
