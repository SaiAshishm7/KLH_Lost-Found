
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles, Zap, Shield } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-klh-light to-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-klh">KLH University</h1>
        <div className="space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row justify-center items-center p-6 gap-8">
        <div className="md:w-1/2 text-center md:text-left space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-klh">
            Lost Something?<br />
            Found Something?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            KLH University's Official Lost & Found Portal
          </p>
          <p className="text-lg">
            Connecting lost items with their owners across campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              onClick={() => navigate("/login")}
              className="bg-klh hover:bg-klh/90 text-white"
              size="lg"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center animate-fade-in">
          <img
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1000"
            alt="Lost and Found"
            className="max-w-full h-auto rounded-lg shadow-xl"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How Our Platform Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A simple, efficient system to help you find what you've lost or return what you've found
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-r from-klh/80 to-klh p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Report & Search</h3>
                    <p>Simple tools to connect items with owners</p>
                  </div>
                  <div className="p-6 bg-white flex-grow">
                    <div className="flex items-start mb-4">
                      <Sparkles className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Easy-to-use form to report lost or found items</p>
                    </div>
                    <div className="flex items-start mb-4">
                      <CheckCircle className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Search through existing reports with simple filters</p>
                    </div>
                    <div className="flex items-start">
                      <Zap className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Convenient campus drop-off and pick-up locations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className="bg-gradient-to-r from-klh/80 to-klh p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Safe & Reliable</h3>
                    <p>Structured process for handling items</p>
                  </div>
                  <div className="p-6 bg-white flex-grow">
                    <div className="flex items-start mb-4">
                      <Shield className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Verification steps ensure items return to rightful owners</p>
                    </div>
                    <div className="flex items-start mb-4">
                      <CheckCircle className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Secure storage for all collected items</p>
                    </div>
                    <div className="flex items-start">
                      <Zap className="h-5 w-5 mt-1 text-klh mr-2" />
                      <p>Clear tracking from finding to return</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => navigate("/register")}
              className="bg-klh hover:bg-klh/90 text-white"
              size="lg"
            >
              Join Now
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-klh-light py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Real Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-klh/10 text-klh flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">JD</span>
                  </div>
                  <p className="italic mb-4">"Lost my student ID during orientation week. Filed a report and someone turned it in the next day. The notification system saved me a lot of trouble!"</p>
                  <p className="font-semibold">Jamie D.</p>
                  <p className="text-sm text-muted-foreground">First Year Student</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-klh/10 text-klh flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">SK</span>
                  </div>
                  <p className="italic mb-4">"Found a wallet on campus and wasn't sure what to do. The lost and found portal made it easy to report and drop it off. Simple process from start to finish."</p>
                  <p className="font-semibold">Sarah K.</p>
                  <p className="text-sm text-muted-foreground">Campus Staff</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-klh/10 text-klh flex items-center justify-center mb-4">
                    <span className="text-xl font-bold">RM</span>
                  </div>
                  <p className="italic mb-4">"Left my notebook in the library with all my semester notes. Posted a lost report and got it back within 48 hours. This service is a real lifesaver."</p>
                  <p className="font-semibold">Ryan M.</p>
                  <p className="text-sm text-muted-foreground">Graduate Student</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-klh py-8 px-6 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-bold">KLH University Lost & Found</h3>
            <p className="text-sm opacity-75">Helping the campus community since 2025</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm">Lost & Found Office: Admin Building</p>
            <p className="text-sm">Contact: lostandfound@klh.edu.in</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
