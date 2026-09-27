// ─── The Shimmer Strip — Configuration ───
//
// This is the ONE file you customise to make it yours.
// Change the name, the location, the vibes, the mascot —
// everything that makes your wardrobe YOUR wardrobe.
//
// The snail stays unless you replace it. We recommend keeping the snail.

// Server-side env overrides. This file is also bundled into the browser app,
// where `process` does not exist, so every env read goes through ENV.
const ENV = (typeof process !== "undefined" && process.env) || {};

// ─── App Identity ───
export const APP_NAME = "The Shimmer Strip";
export const APP_SUBTITLE = "Roshan's Wardrobe";

// ─── Weather Location ───
// Chandrapur, Maharashtra. For Hyderabad use 17.45, 78.38.
// Can also be overridden per run: WEATHER_LAT / WEATHER_LON env vars.
export const WEATHER_LATITUDE = 19.96;
export const WEATHER_LONGITUDE = 79.30;
export const WEATHER_TIMEZONE = "Asia/Kolkata";
export const WEATHER_PLACE = ENV.WEATHER_PLACE || "Chandrapur";

// ─── Categories ───
// What types of clothing do you have? Add or remove as needed.
// How Indian menswear maps onto the outfit engine:
//   Top          shirts, t-shirts, polos, kurtas
//   Bottom       trousers, jeans, chinos, shorts
//   Matching Set kurta-pyjama, sherwani, suit worn as one look (counts as full body)
//   Jacket       blazer, Nehru jacket, rain jacket, hoodie
//   Cardigan     sweaters and knits
//   Jewellery    watch, chain, ring
export const CATEGORIES = [
  "Top", "Bottom", "Matching Set", "Jacket", "Cardigan", "Shoes",
  "Accessory", "Bag", "Hat", "Jewellery", "Pyjamas",
];

// ─── Vibes ───
// How do YOU mentally categorise your outfits?
// "Goat Farm" might not be your vibe. "Dog Walking" might be.
// Items can have multiple vibes.
export const VIBES = [
  "Everyday", "Office", "Client Meeting", "Smart Casual", "Weekend Casual",
  "Family Function", "Festive / Traditional", "Travel", "Date Night",
  "Gym / Active", "Lounge at Home", "Monsoon Ready",
];

// ─── Weather Tags ───
export const WEATHERS = ["Hot", "Warm", "Mild", "Cold", "Rainy"];

export const WEATHER_EMOJI = {
  "Hot": "☀️", "Warm": "🌤️", "Mild": "⛅",
  "Cold": "❄️", "Rainy": "🌧️",
};

// ─── Surprise Me Vibes ───
// The options shown on the Surprise Me setup page.
// These map to your main vibes internally.
export const SURPRISE_VIBES = [
  "Office", "Client Meeting", "Weekend", "Family Function", "Festival",
  "Travel Day", "Evening Out", "Lazy Day",
];

// Maps surprise vibes → item vibes
export const SURPRISE_VIBE_MAP = {
  "Office": "Office",
  "Client Meeting": "Client Meeting",
  "Weekend": "Weekend Casual",
  "Family Function": "Family Function",
  "Festival": "Festive / Traditional",
  "Travel Day": "Travel",
  "Evening Out": "Date Night",
  "Lazy Day": "Lounge at Home",
};

// ─── Storage Locations ───
// Where do your clothes live? Name your drawers, shelves, baskets.
// The last entry is the "blocked" location (e.g. someone sleeping).
export const LOCATIONS = [
  "Main Wardrobe", "Drawer", "Shoe Rack", "Accessories Box", "Travel Bag",
];

// Locations that can be toggled off (e.g. partner sleeping)
export const BLOCKED_LOCATIONS = ["Travel Bag"];

// ─── Outfit Pickers ───
// Who can pick outfits? Add your friends, your AI, your cat.
// "manual" is always you (the app owner). The rest are friends/AIs.
export const PICKERS = [
  { id: "manual", label: "Me", icon: "✨" },
];

// System pickers (set automatically, not shown in the picker UI)
export const SYSTEM_PICKERS = [
  { id: "claude", label: "Claude's Choice", icon: "🩵", color: "#7ab0c4" },
  { id: "ode", label: "Ode's Pick", icon: "💛", color: "#c4a43a" },
  { id: "chaos", label: "Chaos Mode", icon: "🌀", color: "#e86b6b" },
  { id: "snail", label: "Snail's Pick", icon: "🐌", color: "#c4956a" },
];

// ─── Mascot: The Snail ───
// The snail names outfits when you hit Surprise Me.
// Replace with your own mascot's personality.
export const SNAIL_NAMES = [
  "The Audacity", "Hold My Prosecco", "The Snail Has Spoken",
  "Trust The Shell", "Slime & Shine", "Spiral Intentions",
  "Shell Yeah", "Slow Fashion", "The Gastropod Glow",
  "Snail Mail Special", "Trail Blazer", "Shimmer Slither",
  "The Shell Game", "Spiral Instinct", "The Slow Burn",
  "Antenna Approved", "The Mucus Muse", "Shell Shocked",
  "Gastropod Glamour", "Slime Time", "The Spiral Decides",
];

// Chaos mode names its own outfits too.
export const CHAOS_NAMES = [
  "Chaos Theory", "The Algorithm Dared", "Colour Crime Scene",
  "Fashion Emergency", "The Eyes Need Sunglasses", "Wardrobe Malfunction",
  "Controlled Explosion", "Beautiful Disaster", "Chaos Couture",
  "The Spiral Snapped", "Unbothered Unmatched", "Hot Mess Express",
  "Aggressive Sparkle", "The Audible Gasp", "Prosecco Fuelled",
];

// ─── Chaos Mode Messages ───
// Shown when chaos mode generates an outfit.
export const CHAOS_MESSAGES = [
  "the snails chose violence today",
  "fashion is dead and we killed it (beautifully)",
  "rules? in THIS wardrobe?",
  "the spiral has spoken and it's UNHINGED",
  "your outfit today is: a threat",
  "legally i cannot be held responsible",
  "this is what peak performance looks like",
  "chaotic good energy only",
  "the fashion police have been notified (they're scared)",
  "nimbus would be proud (nimbus has no taste)",
  "colour theory? never heard of her",
  "this outfit said 'hold my prosecco'",
];

// ─── Category Rules ───
// Which categories count as what in outfit building.
export const OUTFIT_RULES = {
  tops: ["Top"],
  bottoms: ["Bottom"],
  fullBody: ["Dress", "Jumpsuit", "Matching Set"],
  midLayers: ["Jacket", "Cardigan"],
  footwear: ["Shoes"],
  accessories: ["Bag", "Hat", "Jewellery", "Accessory"],
  // Categories excluded from suggestions unless specific vibes are active
  excludeFromSuggestions: ["Pyjamas"],
  // Vibes that allow excluded categories
  cosyVibes: ["Lounge at Home"],
};

// ─── Navigation Icons ───
// Customise the emoji on each tab. A guy might want a suit, a dog
// person might want a poodle. Make them yours.
export const NAV_ICONS = {
  wardrobe: "🌀",
  add: "✨",
  outfit: "👔",     // Try: 🤵 👔 🐕 🧥 🪄
  saved: "💖",
  laundry: "🧺",
  surprise: "🐌",
};

// ─── Comfort Mode (Crimson Moon) ───
// A toggle that prioritises comfort-first items. Originally designed
// for period days but useful for anyone having a low-energy, high-cosy
// day. Set enabled: false to hide it entirely. Rename it to whatever
// fits — "Soft Day", "Comfort Mode", "Duvet Energy", "Spoon Day".
export const COMFORT_MODE = {
  enabled: true,
  name: "Lazy Day",
  icon: "🛋️",
  description: "Comfort first. Relaxed pieces prioritised.",
  comfortVibes: ["Lounge at Home", "Everyday", "Weekend Casual"],
};

// ─── Auth ───
// The secret URL path for device authentication.
// Visit this URL once per device to get edit access.
// Change it to something only you know.
// Change this to your own secret path! Don't use the default.
export const AUTH_PATH = ENV.SHIMMER_AUTH_PATH || "/unlock-wardrobe";
