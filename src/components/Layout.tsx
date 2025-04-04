import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut, Search, BookUser, BookPlus, Map, Settings, Bell } from "lucide-react";
import { toast } from "@/utils/toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 
              className="text-xl font-bold text-klh cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              KLH University Lost & Found
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-1">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r hidden md:block">
          <div className="p-4">
            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/dashboard")}
              >
                <Map className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/lost-items")}
              >
                <BookUser className="mr-2 h-5 w-5" />
                Lost Items
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/found-items")}
              >
                <Search className="mr-2 h-5 w-5" />
                Found Items
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => navigate("/report-item")}
              >
                <BookPlus className="mr-2 h-5 w-5" />
                Report Item
              </Button>
              
              <Separator className="my-2" />

              {isAdmin && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate("/admin")}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Admin Panel
                </Button>
              )}
            </nav>
          </div>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-10">
          <div className="flex justify-around p-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center text-xs py-1 h-auto"
            >
              <Map className="h-5 w-5 mb-1" />
              <span>Dashboard</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/lost-items")}
              className="flex flex-col items-center text-xs py-1 h-auto"
            >
              <BookUser className="h-5 w-5 mb-1" />
              <span>Lost</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/found-items")}
              className="flex flex-col items-center text-xs py-1 h-auto"
            >
              <Search className="h-5 w-5 mb-1" />
              <span>Found</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/report-item")}
              className="flex flex-col items-center text-xs py-1 h-auto"
            >
              <BookPlus className="h-5 w-5 mb-1" />
              <span>Report</span>
            </Button>
            
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/admin")}
                className="flex flex-col items-center text-xs py-1 h-auto"
              >
                <Settings className="h-5 w-5 mb-1" />
                <span>Admin</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
