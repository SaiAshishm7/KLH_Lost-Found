
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/utils/toast";
import { categories, locations, addItem } from "@/utils/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Upload } from "lucide-react";

const ReportItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [type, setType] = useState<"lost" | "found">("lost");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error("Item name is required");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!location) {
      toast.error("Please select a location");
      return;
    }
    
    if (!date) {
      toast.error("Please provide the date");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to report an item");
      return;
    }

    setIsLoading(true);

    try {
      // Create the new item
      const newItem = addItem({
        name,
        type,
        description,
        category,
        location,
        date: `${date}${time ? `T${time}` : ''}`,
        reportedBy: {
          id: user.id,
          name: user.name,
          universityId: user.universityId
        },
        image: imagePreview || undefined
      });

      toast.success(`Item ${type === "lost" ? "lost" : "found"} report submitted successfully!`);
      
      // Navigate to the appropriate page
      setTimeout(() => {
        navigate(`/${type}-items`);
      }, 1000);
    } catch (error) {
      console.error("Failed to submit item", error);
      toast.error("Failed to submit item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setLocation("");
    setDate("");
    setTime("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Report an Item</h1>

        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lost" onClick={() => setType("lost")}>Lost Item</TabsTrigger>
            <TabsTrigger value="found" onClick={() => setType("found")}>Found Item</TabsTrigger>
          </TabsList>

          <TabsContent value="lost">
            <Card>
              <CardHeader>
                <CardTitle>Report a Lost Item</CardTitle>
                <CardDescription>
                  Fill in the details about your lost item. Be as specific as possible to help others identify it.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name*</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Blue Backpack, iPhone 13, etc."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category*</Label>
                      <Select 
                        value={category} 
                        onValueChange={setCategory}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Last Seen Location*</Label>
                    <Select 
                      value={location} 
                      onValueChange={setLocation}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date Lost*</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Approximate Time (if known)</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description*</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed description of your lost item, including any identifying features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="image" 
                        className="cursor-pointer flex items-center gap-2 border rounded-md p-2 hover:bg-secondary transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        <span>{imageFile ? imageFile.name : "Choose file"}</span>
                      </Label>
                      {imageFile && (
                        <Button 
                          type="button" 
                          variant="ghost"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="upload-preview rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Report Lost Item"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="found">
            <Card>
              <CardHeader>
                <CardTitle>Report a Found Item</CardTitle>
                <CardDescription>
                  Fill in the details about the item you found to help reunite it with its owner.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="found-name">Item Name*</Label>
                      <Input
                        id="found-name"
                        placeholder="e.g. Blue Backpack, iPhone 13, etc."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="found-category">Category*</Label>
                      <Select 
                        value={category} 
                        onValueChange={setCategory}
                      >
                        <SelectTrigger id="found-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="found-location">Found Location*</Label>
                    <Select 
                      value={location} 
                      onValueChange={setLocation}
                    >
                      <SelectTrigger id="found-location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="found-date">Date Found*</Label>
                      <Input
                        id="found-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="found-time">Approximate Time (if known)</Label>
                      <Input
                        id="found-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="found-description">Description*</Label>
                    <Textarea
                      id="found-description"
                      placeholder="Provide detailed description of the found item. Avoid including uniquely identifying features that only the owner would know..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="found-image">Upload Image (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="found-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Label 
                        htmlFor="found-image" 
                        className="cursor-pointer flex items-center gap-2 border rounded-md p-2 hover:bg-secondary transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        <span>{imageFile ? imageFile.name : "Choose file"}</span>
                      </Label>
                      {imageFile && (
                        <Button 
                          type="button" 
                          variant="ghost"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-2">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="upload-preview rounded-md border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> After submitting this form, please take the found item to the campus Lost & Found office (Admin Building, Room 103) as soon as possible.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Report Found Item"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportItem;
