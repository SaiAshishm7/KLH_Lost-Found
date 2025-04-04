
// Data structures for the application
export interface Item {
  id: string;
  name: string;
  type: 'lost' | 'found';
  date: string;
  location: string;
  description: string;
  category: string;
  status: 'pending' | 'claimed' | 'unclaimed';
  reportedBy: {
    id: string;
    name: string;
    universityId: string;
  };
  image?: string;
  claimedBy?: {
    id: string;
    name: string;
    universityId: string;
  };
  claimDate?: string;
}

export const categories = [
  "Electronics",
  "Books & Stationery",
  "Clothing & Accessories",
  "ID & Cards",
  "Keys",
  "Bags & Luggage",
  "Others"
];

export const locations = [
  "Main Building - Ground Floor",
  "Main Building - First Floor",
  "Science Block",
  "Library",
  "Cafeteria", 
  "Hostel Block A",
  "Hostel Block B",
  "Sports Complex",
  "Auditorium",
  "Parking Area"
];

// Setup localStorage to manage items
const getStoredItems = (): Item[] => {
  const storedItems = localStorage.getItem("klh_items");
  if (storedItems) {
    try {
      return JSON.parse(storedItems);
    } catch (error) {
      console.error("Failed to parse stored items", error);
      return [];
    }
  }
  return [];
};

// Save items to localStorage
export const saveItems = (items: Item[]) => {
  localStorage.setItem("klh_items", JSON.stringify(items));
};

// Access stored items or initialize empty array
export const demoItems: Item[] = getStoredItems();

// Add a new item
export const addItem = (item: Omit<Item, "id" | "status">) => {
  const newItem: Item = {
    ...item,
    id: `item_${Date.now()}`,
    status: 'pending'
  };
  
  demoItems.unshift(newItem); // Add to beginning of array for recent items
  saveItems(demoItems);
  return newItem;
};
