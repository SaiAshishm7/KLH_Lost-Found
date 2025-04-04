
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(universityId, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-klh-light to-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-klh">KLH University</h1>
          <p className="text-xl mt-1">Lost & Found Portal</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your university ID and password to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universityId">University ID (10 digits)</Label>
                <Input
                  id="universityId"
                  type="text"
                  placeholder="e.g. 1234567890"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  title="University ID must be 10 digits"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-klh hover:bg-klh/90" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-sm text-center mt-4">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-klh hover:underline">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Admin: 0000000000 / password</p>
          <p>User: 9876543210 / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
