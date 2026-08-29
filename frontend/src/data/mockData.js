export const CATEGORIES = [
  'Electronics',
  'Documents',
  'Accessories',
  'Bags',
  'Keys',
  'Clothing',
  'Other'
];

export const STATUSES = [
  'Lost',
  'Found',
  'Claimed',
  'Returned'
];

export const LOCATIONS = [
  'Central Library',
  'Student Center',
  'Campus Gym',
  'Engineering Block',
  'Science Building',
  'Dining Hall',
  'Computer Lab 204',
  'Math Dept Hallway',
  'West Parking Lot',
  'Main Gate',
  'Arts Quad'
];

export const MOCK_ITEMS = [
  {
    id: 1,
    item_name: "Black Lenovo Laptop",
    description: "Black Lenovo ThinkPad with a blue campus tech club sticker on the top cover. Contains vital course notes.",
    category: "Electronics",
    status: "Lost",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    location: "Central Library",
    date: "2026-08-25",
    time: "14:30",
    owner_id: 2,
    reporter_id: 2,
    reward: "$50 Reward",
    storage_location: null,
    verification_question: null,
    created_at: "2026-08-25T14:30:00Z",
    updated_at: "2026-08-25T14:30:00Z",
    reporter_name: "Alex Johnson",
    contact_info: "alex.j@campus.edu | (555) 234-5678"
  },
  {
    id: 2,
    item_name: "Blue Stainless Steel Water Bottle",
    description: "Hydro Flask style 32oz water bottle, royal blue with minor scratches near the bottom rim.",
    category: "Accessories",
    status: "Lost",
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    location: "Campus Gym",
    date: "2026-08-24",
    time: "17:15",
    owner_id: 2,
    reporter_id: 2,
    reward: null,
    storage_location: null,
    verification_question: null,
    created_at: "2026-08-24T17:15:00Z",
    updated_at: "2026-08-24T17:15:00Z",
    reporter_name: "Alex Johnson",
    contact_info: "alex.j@campus.edu"
  },
  {
    id: 3,
    item_name: "Student ID Card",
    description: "Campus Student Identification Card for Computer Science Senior Class. Name on card starts with S.",
    category: "Documents",
    status: "Lost",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    location: "Student Center",
    date: "2026-08-26",
    time: "09:10",
    owner_id: 3,
    reporter_id: 3,
    reward: "$10",
    storage_location: null,
    verification_question: null,
    created_at: "2026-08-26T09:10:00Z",
    updated_at: "2026-08-26T09:10:00Z",
    reporter_name: "Sarah Parker",
    contact_info: "sarah.p@campus.edu"
  },
  {
    id: 4,
    item_name: "Black Herschel Backpack",
    description: "Black Canvas Herschel Supply backpack. Left side pocket holds an umbrella.",
    category: "Bags",
    status: "Lost",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    location: "Science Building",
    date: "2026-08-23",
    time: "11:45",
    owner_id: 4,
    reporter_id: 4,
    reward: "$20",
    storage_location: null,
    verification_question: null,
    created_at: "2026-08-23T11:45:00Z",
    updated_at: "2026-08-23T11:45:00Z",
    reporter_name: "Marcus Vance",
    contact_info: "marcus.v@campus.edu"
  },
  {
    id: 5,
    item_name: "iPhone 14 Pro - Space Black",
    description: "Found an iPhone with clear silicone case on table 4 of Engineering Quad.",
    category: "Electronics",
    status: "Found",
    image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    location: "Engineering Block",
    date: "2026-08-26",
    time: "13:00",
    owner_id: null,
    reporter_id: 1,
    reward: null,
    storage_location: "Campus Lost & Found Office - Locker #12",
    verification_question: "What lockscreen wallpaper or customized case sticker is on the phone?",
    created_at: "2026-08-26T13:00:00Z",
    updated_at: "2026-08-26T13:00:00Z",
    reporter_name: "Campus Security Admin",
    contact_info: "lostandfound@campus.edu"
  },
  {
    id: 6,
    item_name: "Brown Leather Wallet",
    description: "Genuine brown leather bi-fold wallet found under bench near parking lot B.",
    category: "Accessories",
    status: "Found",
    image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    location: "West Parking Lot",
    date: "2026-08-25",
    time: "16:20",
    owner_id: null,
    reporter_id: 2,
    reward: null,
    storage_location: "Library Security Desk",
    verification_question: "What initials or cards are inside the billfold?",
    created_at: "2026-08-25T16:20:00Z",
    updated_at: "2026-08-25T16:20:00Z",
    reporter_name: "Alex Johnson",
    contact_info: "alex.j@campus.edu"
  },
  {
    id: 7,
    item_name: "64GB SanDisk USB Drive",
    description: "Silver metallic thumb drive attached to a small blue lanyard.",
    category: "Electronics",
    status: "Found",
    image_url: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=600&q=80",
    location: "Computer Lab 204",
    date: "2026-08-24",
    time: "10:15",
    owner_id: null,
    reporter_id: 3,
    reward: null,
    storage_location: "Lab Monitor Station Desk A",
    verification_question: "What is the volume label or folder name inside the USB root directory?",
    created_at: "2026-08-24T10:15:00Z",
    updated_at: "2026-08-24T10:15:00Z",
    reporter_name: "Sarah Parker",
    contact_info: "sarah.p@campus.edu"
  },
  {
    id: 8,
    item_name: "TI-84 Plus CE Calculator",
    description: "Pink Texas Instruments graphing calculator left after Calculus II midterm exam.",
    category: "Electronics",
    status: "Returned",
    image_url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
    location: "Math Dept Hallway",
    date: "2026-08-20",
    time: "15:00",
    owner_id: 2,
    reporter_id: 1,
    reward: null,
    storage_location: "Math Department Office",
    verification_question: "What name was written in sharpie on the back slide cover?",
    created_at: "2026-08-20T15:00:00Z",
    updated_at: "2026-08-22T10:00:00Z",
    reporter_name: "Campus Security Admin",
    contact_info: "lostandfound@campus.edu"
  }
];

export const MOCK_CLAIMS = [
  {
    id: 1,
    item_id: 5,
    item_name: "iPhone 14 Pro - Space Black",
    claimer_id: 2,
    claimer_name: "Alex Johnson",
    claimer_email: "alex.j@campus.edu",
    reason: "I dropped my iPhone while sitting at table 4 after my 12:30 Physics lecture.",
    ownership_details: "It has a small scratch on the camera module bezel and a wallpaper of a galaxy nebula.",
    verification_answer: "The lockscreen wallpaper is a purple galaxy nebula photo.",
    status: "Pending",
    created_at: "2026-08-26T14:10:00Z",
    updated_at: "2026-08-26T14:10:00Z"
  },
  {
    id: 2,
    item_id: 6,
    item_name: "Brown Leather Wallet",
    claimer_id: 4,
    claimer_name: "Marcus Vance",
    claimer_email: "marcus.v@campus.edu",
    reason: "Slipped out of my back pocket when getting into my car yesterday afternoon.",
    ownership_details: "Contains my student library card and a Metro pass.",
    verification_answer: "Initials M.V. stamped inside bottom left corner.",
    status: "Approved",
    created_at: "2026-08-25T18:00:00Z",
    updated_at: "2026-08-26T09:30:00Z"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    user_id: 2,
    type: "Claim Approved",
    message: "Your claim for 'TI-84 Plus CE Calculator' has been approved by Admin! Please visit the Math Department Office to collect your item.",
    read_status: false,
    created_at: "2026-08-26T09:30:00Z"
  },
  {
    id: 2,
    user_id: 2,
    type: "Claim Submitted",
    message: "Your claim for 'iPhone 14 Pro - Space Black' was successfully submitted. Admin is currently reviewing your verification answer.",
    read_status: true,
    created_at: "2026-08-26T14:10:00Z"
  },
  {
    id: 3,
    user_id: 2,
    type: "New Matching Item",
    message: "A new found item 'Black Lenovo Laptop' matching your report criteria was just posted in Central Library.",
    read_status: false,
    created_at: "2026-08-26T11:00:00Z"
  }
];

export const MOCK_USER_STUDENT = {
  id: 2,
  name: "Alex Johnson",
  email: "student@campus.edu",
  role: "student",
  created_at: "2026-01-15T08:00:00Z"
};

export const MOCK_USER_ADMIN = {
  id: 1,
  name: "Campus Admin",
  email: "admin@campus.edu",
  role: "admin",
  created_at: "2026-01-01T08:00:00Z"
};
