
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/utils/toast";
import { demoItems, Item } from "@/utils/demo-data";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [claimReason, setClaimReason] = useState("");
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundItem = demoItems.find(item => item.id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        toast.error("Item not found");
        navigate("/dashboard");
      }
    }
  }, [id, navigate]);

  if (!item) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Loading item details...</p>
        </div>
      </Layout>
    );
  }

  const handleClaim = () => {
    if (!claimReason.trim()) {
      toast.error("Please provide a reason for claiming this item");
      return;
    }

    setIsLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      // Update the item status
      const updatedItem = {
        ...item,
        status: "claimed" as const,
        claimedBy: {
          id: user?.id || "",
          name: user?.name || "",
          universityId: user?.universityId || "",
        },
        claimDate: new Date().toISOString(),
      };
      
      setItem(updatedItem);
      toast.success("Claim submitted successfully");
      setIsClaimDialogOpen(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminAction = (action: "approve" | "reject") => {
    setIsLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      if (action === "approve") {
        toast.success("Claim approved. Owner notified for item pickup.");
      } else {
        toast.info("Claim rejected. User has been notified.");
      }
      setIsLoading(false);
      navigate("/admin");
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isOwner = user?.id === item.reportedBy.id;
  const hasClaimedByUser = user?.id === item.claimedBy?.id;

  return (
    <Layout>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Item Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">{item.name}</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.type === 'lost' 
                      ? 'bg-lost-light text-lost' 
                      : 'bg-found-light text-found'
                  }`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.image && (
                  <div className="w-full overflow-hidden rounded-md max-h-96">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p>{formatDate(item.date)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p>{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="whitespace-pre-line">{item.description}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {item.type === "found" && item.status === "unclaimed" && !isOwner && (
                  <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Claim This Item</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Claim {item.name}</DialogTitle>
                        <DialogDescription>
                          Please provide proof that you are the owner of this item. Be as specific as possible.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Textarea 
                          placeholder="Describe the item in detail and provide unique identifying characteristics that only the owner would know..."
                          value={claimReason}
                          onChange={(e) => setClaimReason(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsClaimDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleClaim}
                          disabled={isLoading}
                        >
                          Submit Claim
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {item.type === "lost" && item.status === "pending" && isOwner && (
                  <p className="text-sm text-muted-foreground italic">
                    Your lost item has been reported. You will receive a notification if someone finds it.
                  </p>
                )}

                {item.status === "claimed" && item.claimedBy && hasClaimedByUser && (
                  <div className="flex items-center text-blue-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p>You have claimed this item. Please go to the lost & found office with your ID to pick it up.</p>
                  </div>
                )}

                {item.status === "claimed" && item.claimedBy && !hasClaimedByUser && !isAdmin && (
                  <div className="flex items-center text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <p>This item has been claimed by another user.</p>
                  </div>
                )}

                {isAdmin && item.status === "claimed" && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAdminAction("approve")}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      Approve Claim
                    </Button>
                    <Button 
                      onClick={() => handleAdminAction("reject")}
                      variant="destructive"
                      disabled={isLoading}
                    >
                      Reject Claim
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Reporter Information */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{item.reportedBy.name}</p>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground">ID: {item.reportedBy.universityId}</p>
                )}
              </CardContent>
            </Card>

            {/* Claimed By Information (if applicable) */}
            {item.status === "claimed" && item.claimedBy && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Claimed By</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{item.claimedBy.name}</p>
                  {isAdmin && (
                    <>
                      <p className="text-sm text-muted-foreground">ID: {item.claimedBy.universityId}</p>
                      <p className="text-sm text-muted-foreground mt-2">Date: {formatDate(item.claimDate || "")}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Admin Actions */}
            {isAdmin && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // This would edit the item in a real app
                      toast.info("Edit functionality would open here");
                    }}
                  >
                    Edit Item
                  </Button>
                  <Button 
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      // This would remove the item in a real app
                      toast.warning("Item would be removed");
                      navigate("/admin");
                    }}
                  >
                    Remove Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
