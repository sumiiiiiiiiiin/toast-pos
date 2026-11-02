import { useEffect, useState } from "react";

// ---------- Design Canvas ----------

const DESIGN_W = 1440;
const DESIGN_H = 960;

function computeScale() {
  return Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
}

function useCanvasScale() {
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 1 : computeScale()
  );
  useEffect(() => {
    const update = () => setScale(computeScale());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

// ---------- Data ----------

const CATEGORY_COLOR = {
  Combo: "orange",
  Chicken: "orange",
  Side: "orange",
  Sandwich: "orange",
  Special: "orange",
  Dipping: "blue",
  Beverage: "blue",
  Alcohol: "blue",
  "Happy Hour": "olive",
  Free: "olive",
};

const CATEGORIES_ROW1 = ["Combo", "Chicken", "Side", "Sandwich", "Special"];
const CATEGORIES_ROW2 = ["Dipping", "Beverage", "Alcohol"];
const CATEGORIES_ROW3 = ["Happy Hour", "Free"];
const ALL_CATEGORIES = [...CATEGORIES_ROW1, ...CATEGORIES_ROW2, ...CATEGORIES_ROW3];

const ORDER_TYPES = ["Dine In", "Take Out", "Uber Eats"];
const SERVERS = [
  { name: "Sumin S", dotColor: "#d45b40" },
  { name: "Phobe B", dotColor: "#6c9fcd" },
  { name: "Joy T", dotColor: "#b9c254" },
];

// categories hidden per order type
const HIDDEN_CATEGORIES = {
  "Dine In": [],
  "Take Out": ["Happy Hour", "Alcohol"],
  "Uber Eats": ["Happy Hour", "Alcohol", "Free"],
};

// flat price surcharge per order type
const PRICE_ADJUST = {
  "Dine In": 0,
  "Take Out": 0,
  "Uber Eats": 2,
};

const MENU = {
  Combo: [
    { id: "combo-solo", name: "Solo", price: 25.99 },
    { id: "combo-duo", name: "Duo", price: 45.99 },
    { id: "combo-trio", name: "Trio", price: 65.99 },
    { id: "combo-party", name: "Party", price: 75.99 },
  ],
  Chicken: [
    { id: "chk-classic", name: "Classic", price: 19.99, badge: 42 },
    { id: "chk-hot", name: "Hot", price: 19.99, badge: 40 },
    { id: "chk-cheese", name: "Cheese", price: 19.99, badge: 0 },
    { id: "chk-honey", name: "Honey", price: 19.99, badge: 32 },
    { id: "chk-barbecue", name: "Barbecue", price: 19.99, badge: 26 },
    { id: "chk-garlic", name: "Garlic", price: 19.99, badge: 28 },
    { id: "chk-sweetchilly", name: "Sweet Chilly", price: 19.99, badge: 30 },
  ],
  Side: [
    { id: "side-fries", name: "Fries", price: 6.99 },
    { id: "side-poutine", name: "Poutine", price: 9.99 },
    { id: "side-cheesesticks", name: "Cheese Stick", price: 9.99 ,badge: 56 },
    { id: "side-salad", name: "Salad", price: 8.99 },
  ],
  Sandwich: [
    { id: "sw-signature", name: "Signature", price: 19.99, badge: 40 },
    { id: "sw-classic", name: "Classic", price: 19.99, badge: 42 },
    { id: "sw-blt", name: "BLT", price: 19.99, badge: 0 },
  ],
  Special: [
    { id: "sp-ricebowl", name: "Rice Bowl", price: 14.99 },
    { id: "sp-chickenpizza", name: "Pizza", price: 16.99 },
  ],
  Dipping: [
    { id: "dip-ranch", name: "Ranch", price: 0.99 },
    { id: "dip-mustard", name: "Sweet Chilly", price: 0.99 },
    { id: "dip-bbq", name: "BBQ", price: 0.99 },
    { id: "dip-bluecheese", name: "Hot", price: 0.99 },
  ],
  Beverage: [
    { id: "bev-coke", name: "Coke", price: 2.99, badge: 99 },
    { id: "bev-cokezero", name: "Coke Zero", price: 2.99, badge: 99 },
    { id: "bev-sprite", name: "Sprite", price: 2.99, badge: 76 },
    { id: "bev-gingerale", name: "Ginger Ale", price: 2.99, badge: 54 },
    { id: "bev-fanta", name: "Fanta", price: 2.99, badge: 36 },
    { id: "bev-oj", name: "Orange Juice", price: 3.99, badge: 0 },
    { id: "bev-eskawater", name: "Eska Water", price: 1.99, badge: 65 },
  ],
  Alcohol: [
    { id: "alc-draftbeer", name: "Draft Beer", price: 6.99 },
    { id: "alc-bottledbeer", name: "Bottled Beer", price: 5.99, badge:36 },
  ],
  "Happy Hour": [
    { id: "hh-draftbeer", name: "Draft Beer", price: 5.0 },
    { id: "hh-classicwings", name: "Wings", price: 10.0 },
    { id: "hh-fries", name: "Fries", price: 5.0 },
  ],
  Free: [
    { id: "free-beverage", name: "Beverage", price: 0.0 },
    { id: "free-fries", name: "Fries", price: 0.0 },
    { id: "free-cheesestick", name: "Cheese Stick", price: 0.0 },
  ],
};

const COMBO_SLOTS = {
  Solo: { chicken: 1, side: 1, drink: 1 },
  Duo: { chicken: 2, side: 1, drink: 2 },
  Trio: { chicken: 3, side: 1, drink: 3 },
  Party: { chicken: 3, side: 2, drink: 2 },
};

// modifier options per category (or per item id, "default" = rest)
const MODIFIER_RULES = {
  Combo: [],
  Chicken: {
    "chk-classic": [],
    "chk-hot": [],
    default: ["Sauce on the Side"],
  },
  Side: [],
  Sandwich: ["No Pickle", "No Onion", "No Tomato"],
  Special: {
    "sp-ricebowl": ["No Egg"],
    "sp-chickenpizza": ["No Cheese", "No Pepperoni", "No Olive"],
    default: [],
  },
  Dipping: [],
  Beverage: [],
  Alcohol: [],
  "Happy Hour": [],
  Free: [],
};

function getModifiersForItem(line) {
  const rule = MODIFIER_RULES[line.category];
  if (!rule) return [];
  if (Array.isArray(rule)) return rule;
  return rule[line.itemId] ?? rule.default ?? [];
}

// ---------- Color Tokens ----------

const COLORS = {
  bg: "#161616",
  panelBg: "#202020",
  border: "#666",
  borderLight: "#eee",
  borderTotal: "#555",
  white: "#fff",
  textLight: "#eee",
  textDim: "#666",
  textMuted: "#aaa",
  orange: "#d45b40",
  blue: "#6c9fcd",
  olive: "#b9c254",
};

// borders: shared edges are drawn by only one side so lines don't double up

function accentColors(cat) {
  const kind = CATEGORY_COLOR[cat] || "orange";
  if (kind === "orange") return { color: COLORS.orange, text: COLORS.white };
  if (kind === "blue") return { color: COLORS.blue, text: COLORS.textLight };
  return { color: COLORS.olive, text: COLORS.textLight };
}

// ---------- Icons ----------

function IconBack({ width = 24, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.36923 11.7976L11.6308 16.9207C12 17.2802 12.1769 17.6997 12.1615 18.179C12.1462 18.6584 11.9692 19.0778 11.6308 19.4374C11.2615 19.7969 10.8231 19.9841 10.3154 19.9991C9.80769 20.0141 9.36923 19.8418 9 19.4823L0.553846 11.2583C0.184615 10.8988 0 10.4794 0 10C0 9.52064 0.184615 9.1012 0.553846 8.74169L9 0.517706C9.36923 0.158188 9.80769 -0.0140811 10.3154 0.000898796C10.8231 0.0158787 11.2615 0.203128 11.6308 0.562646C11.9692 0.922164 12.1462 1.3416 12.1615 1.82096C12.1769 2.30032 12 2.71976 11.6308 3.07927L6.36923 8.20241H22.1538C22.6769 8.20241 23.1154 8.37468 23.4692 8.71922C23.8231 9.06375 24 9.49068 24 10C24 10.5093 23.8231 10.9362 23.4692 11.2808C23.1154 11.6253 22.6769 11.7976 22.1538 11.7976H6.36923Z" fill="#EEF0F3" />
    </svg>
  );
}

function IconMore({ width = 5, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 5 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 5C3.875 5 5 3.875 5 2.5C5 1.125 3.875 0 2.5 0C1.125 0 0 1.125 0 2.5C0 3.875 1.125 5 2.5 5ZM2.5 7.5C1.125 7.5 0 8.625 0 10C0 11.375 1.125 12.5 2.5 12.5C3.875 12.5 5 11.375 5 10C5 8.625 3.875 7.5 2.5 7.5ZM2.5 15C1.125 15 0 16.125 0 17.5C0 18.875 1.125 20 2.5 20C3.875 20 5 18.875 5 17.5C5 16.125 3.875 15 2.5 15Z" fill="#EEF0F3" />
    </svg>
  );
}

function IconTabPerson({ width = 18, height = 18 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 9C7.75 9 6.6875 8.5625 5.8125 7.6875C4.9375 6.8125 4.5 5.75 4.5 4.5C4.5 3.25 4.9375 2.1875 5.8125 1.3125C6.6875 0.4375 7.75 0 9 0C10.25 0 11.3125 0.4375 12.1875 1.3125C13.0625 2.1875 13.5 3.25 13.5 4.5C13.5 5.75 13.0625 6.8125 12.1875 7.6875C11.3125 8.5625 10.25 9 9 9ZM0 18V15.15C0 14.625 0.125 14.125 0.375 13.65C0.625 13.175 0.975 12.8 1.425 12.525C2.55 11.85 3.74375 11.3438 5.00625 11.0063C6.26875 10.6688 7.6 10.5 9 10.5C10.4 10.5 11.7313 10.6688 12.9938 11.0063C14.2563 11.3438 15.45 11.85 16.575 12.525C17.025 12.8 17.375 13.175 17.625 13.65C17.875 14.125 18 14.625 18 15.15V18H0Z" fill="white" />
    </svg>
  );
}

function IconAllChecks({ width = 18, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18.3333 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.5 0H5.5C4.49167 0 3.66667 0.9 3.66667 2V14C3.66667 15.1 4.49167 16 5.5 16H16.5C17.5083 16 18.3333 15.1 18.3333 14V2C18.3333 0.9 17.5083 0 16.5 0ZM9.5975 12L6.41667 8.5L7.7 7.09L9.5975 9.17L14.3 4L15.5833 5.41L9.5975 12ZM1.83333 4H0V18C0 19.1 0.825 20 1.83333 20H14.6667V18H1.83333V4Z" fill="#EEF0F3" />
      <rect x="5.27083" y="2.75" width="11.2292" height="9.39583" fill="#EEF0F3" />
    </svg>
  );
}

function IconSwitchUser({ width = 19, height = 19 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 19 19.0022" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.9209 9.53022C5.11172 9.54367 5.28059 9.62362 5.4209 9.76069L5.42188 9.75971C5.56642 9.89222 5.65185 10.0584 5.67578 10.248L5.68262 10.331L5.68066 10.416C5.66698 10.6102 5.58601 10.783 5.44434 10.9248L3.05664 13.3124H17.9258C18.1513 13.3125 18.3523 13.3919 18.5117 13.5507L18.5684 13.6123C18.6899 13.7606 18.7499 13.9394 18.75 14.1367C18.75 14.3622 18.6709 14.5634 18.5117 14.7226C18.3524 14.8819 18.1515 14.9608 17.9258 14.9609H3.05664L5.44434 17.3486C5.5603 17.4645 5.63227 17.6045 5.66406 17.7597L5.68262 17.9199V17.9208C5.68913 18.1524 5.60751 18.3579 5.43652 18.5146L5.43555 18.5136C5.28262 18.6721 5.08725 18.7519 4.86523 18.7519C4.63645 18.7519 4.43426 18.6685 4.27246 18.5068L0.481445 14.7158C0.401781 14.6361 0.339031 14.5434 0.300781 14.4374L0.299805 14.4355C0.265933 14.3398 0.25 14.2394 0.25 14.1367C0.250026 14.0339 0.265884 13.9336 0.299805 13.8378L0.300781 13.8369C0.339 13.7308 0.40172 13.6383 0.481445 13.5585L4.27246 9.76753C4.42559 9.61442 4.61884 9.53512 4.83594 9.52827L4.9209 9.53022Z" fill="white" stroke="white" strokeWidth="0.5" />
      <path d="M14.0791 9.47196C13.8883 9.45851 13.7194 9.37857 13.5791 9.2415L13.5781 9.24247C13.4336 9.10996 13.3481 8.94376 13.3242 8.75419L13.3174 8.67118L13.3193 8.58622C13.333 8.39195 13.414 8.21919 13.5557 8.07743L15.9434 5.68974L1.07422 5.68974C0.848788 5.68967 0.647659 5.61028 0.488282 5.45146L0.431641 5.38993C0.310143 5.24162 0.250053 5.06278 0.25 4.86552C0.25 4.63995 0.329098 4.43877 0.488282 4.27958C0.647596 4.12027 0.848515 4.04137 1.07422 4.0413L15.9434 4.0413L13.5557 1.65361C13.4397 1.53764 13.3677 1.3977 13.3359 1.24247L13.3174 1.08232L13.3174 1.08134C13.3109 0.84983 13.3925 0.644333 13.5635 0.48759L13.5645 0.488566C13.7174 0.330102 13.9128 0.250286 14.1348 0.250285C14.3635 0.250285 14.5657 0.333735 14.7275 0.495402L18.5186 4.28642C18.5982 4.36608 18.661 4.45876 18.6992 4.56474L18.7002 4.56669C18.7341 4.66242 18.75 4.76281 18.75 4.86552C18.75 4.96826 18.7341 5.0686 18.7002 5.16435L18.6992 5.16532C18.661 5.27143 18.5983 5.36389 18.5186 5.44364L14.7275 9.23466C14.5744 9.38777 14.3812 9.46707 14.1641 9.47392L14.0791 9.47196Z" fill="white" stroke="white" strokeWidth="0.5" />
    </svg>
  );
}

function IconSearch({ width = 20, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.0682 19.6871L11.7045 13.3144C11.1364 13.7696 10.483 14.1299 9.74432 14.3954C9.00568 14.661 8.2197 14.7937 7.38636 14.7937C5.32197 14.7937 3.575 14.078 2.14545 12.6464C0.715152 11.214 0 9.4642 0 7.39687C0 5.32954 0.715152 3.57971 2.14545 2.14737C3.575 0.715789 5.32197 0 7.38636 0C9.45076 0 11.1981 0.715789 12.6284 2.14737C14.058 3.57971 14.7727 5.32954 14.7727 7.39687C14.7727 8.23139 14.6402 9.01849 14.375 9.75818C14.1098 10.4979 13.75 11.1522 13.2955 11.7212L19.6875 18.1223C19.8958 18.331 20 18.587 20 18.8905C20 19.1939 19.8864 19.4595 19.6591 19.6871C19.4508 19.8957 19.1856 20 18.8636 20C18.5417 20 18.2765 19.8957 18.0682 19.6871ZM7.38636 12.5178C8.80682 12.5178 10.0144 12.0201 11.0091 11.0247C12.003 10.0286 12.5 8.81934 12.5 7.39687C12.5 5.97439 12.003 4.7651 11.0091 3.76899C10.0144 2.77364 8.80682 2.27596 7.38636 2.27596C5.96591 2.27596 4.75833 2.77364 3.76364 3.76899C2.7697 4.7651 2.27273 5.97439 2.27273 7.39687C2.27273 8.81934 2.7697 10.0286 3.76364 11.0247C4.75833 12.0201 5.96591 12.5178 7.38636 12.5178Z" fill="white" />
    </svg>
  );
}

function IconOpenItem({ width = 20, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.9043 14.5207 11 14.2833 11 14V11H14.025C14.3083 11 14.5417 10.904 14.725 10.712C14.9083 10.5207 15 10.2833 15 10C15 9.71667 14.904 9.479 14.712 9.287C14.5207 9.09567 14.2833 9 14 9H11V5.975C11 5.69167 10.9043 5.45833 10.713 5.275C10.521 5.09167 10.2833 5 10 5C9.71667 5 9.47933 5.09567 9.288 5.287C9.096 5.479 9 5.71667 9 6V9H5.975C5.69167 9 5.45833 9.09567 5.275 9.287C5.09167 9.479 5 9.71667 5 10C5 10.2833 5.09567 10.5207 5.287 10.712C5.479 10.904 5.71667 11 6 11H9V14.025C9 14.3083 9.096 14.5417 9.288 14.725C9.47933 14.9083 9.71667 15 10 15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z" fill="white" />
    </svg>
  );
}

function IconIdDot({ size = 10, color = "#D45B40" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="5" r="5" fill={color} />
    </svg>
  );
}

function IconChevronDown({ width = 10, height = 6 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 6C4.88042 6 4.76472 5.9771 4.65291 5.9313C4.54051 5.8855 4.44694 5.82443 4.3722 5.74809L0.246636 1.53435C0.0822119 1.36641 0 1.15267 0 0.893129C0 0.633587 0.0822119 0.419847 0.246636 0.251908C0.411061 0.0839691 0.620329 0 0.874439 0C1.12855 0 1.33782 0.0839691 1.50224 0.251908L5 3.82443L8.49776 0.251908C8.66218 0.0839691 8.87145 0 9.12556 0C9.37967 0 9.58894 0.0839691 9.75336 0.251908C9.91779 0.419847 10 0.633587 10 0.893129C10 1.15267 9.91779 1.36641 9.75336 1.53435L5.6278 5.74809C5.53812 5.83969 5.44096 5.90443 5.33632 5.94229C5.23169 5.98076 5.11958 6 5 6Z" fill="white" />
    </svg>
  );
}

function IconQtyPlus({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="23" height="23" rx="4.5" fill="#202020" stroke="#AAAAAA" />
      <path d="M7.41667 13C7.20417 13 7.02604 12.9201 6.88229 12.7604C6.73854 12.6007 6.66667 12.4028 6.66667 12.1667C6.66667 11.9306 6.73854 11.7326 6.88229 11.5729C7.02604 11.4132 7.20417 11.3333 7.41667 11.3333H17.25C17.4625 11.3333 17.6406 11.4132 17.7844 11.5729C17.9281 11.7326 18 11.9306 18 12.1667C18 12.4028 17.9281 12.6007 17.7844 12.7604C17.6406 12.9201 17.4625 13 17.25 13H7.41667Z" fill="white" />
      <path d="M13.1667 17.0833C13.1667 17.2958 13.0868 17.474 12.9271 17.6177C12.7674 17.7615 12.5694 17.8333 12.3333 17.8333C12.0972 17.8333 11.8993 17.7615 11.7396 17.6177C11.5799 17.474 11.5 17.2958 11.5 17.0833L11.5 7.25C11.5 7.0375 11.5799 6.85937 11.7396 6.71562C11.8993 6.57187 12.0972 6.5 12.3333 6.5C12.5694 6.5 12.7674 6.57187 12.9271 6.71562C13.0868 6.85937 13.1667 7.0375 13.1667 7.25V17.0833Z" fill="white" />
    </svg>
  );
}

function IconQtyMinus({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="23" height="23" rx="4.5" fill="#202020" stroke="#AAAAAA" />
      <path d="M7.41667 13C7.20417 13 7.02604 12.9201 6.88229 12.7604C6.73854 12.6007 6.66667 12.4028 6.66667 12.1667C6.66667 11.9306 6.73854 11.7326 6.88229 11.5729C7.02604 11.4132 7.20417 11.3333 7.41667 11.3333L17.25 11.3333C17.4625 11.3333 17.6406 11.4132 17.7844 11.5729C17.9281 11.7326 18 11.9306 18 12.1667C18 12.4028 17.9281 12.6007 17.7844 12.7604C17.6406 12.9201 17.4625 13 17.25 13H7.41667Z" fill="white" />
    </svg>
  );
}

function IconSend({ width = 12, height = 11 }) {
  return (
    <span style={{ display: "flex", transform: "rotate(90deg)" }}>
      <svg width={width} height={height} viewBox="0 0 12.1244 10.5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.06218 0L12.1244 10.5H0L6.06218 0Z" fill="#D45B40" />
      </svg>
    </span>
  );
}

function IconDetails({ width = 20, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.9043 14.5207 11 14.2833 11 14V9.975C11 9.69167 10.9043 9.45833 10.713 9.275C10.521 9.09167 10.2833 9 10 9C9.71667 9 9.47933 9.09567 9.288 9.287C9.096 9.479 9 9.71667 9 10V14.025C9 14.3083 9.096 14.5417 9.288 14.725C9.47933 14.9083 9.71667 15 10 15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.9043 6.52067 11 6.28333 11 6C11 5.71667 10.9043 5.479 10.713 5.287C10.521 5.09567 10.2833 5 10 5C9.71667 5 9.47933 5.09567 9.288 5.287C9.096 5.479 9 5.71667 9 6C9 6.28333 9.096 6.52067 9.288 6.712C9.47933 6.904 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6873 3.825 17.975 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.262667 12.6833 0 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31267 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.31233 6.1 0.787C7.31667 0.262333 8.61667 0 10 0C11.3833 0 12.6833 0.262333 13.9 0.787C15.1167 1.31233 16.175 2.025 17.075 2.925C17.975 3.825 18.6873 4.88333 19.212 6.1C19.7373 7.31667 20 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6873 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6873 13.9 19.212C12.6833 19.7373 11.3833 20 10 20Z" fill="#EEEEEE" />
    </svg>
  );
}

function IconRepeat({ width = 18, height = 20 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.47522 8.43342H7.66181C7.45189 8.43342 7.27277 8.35927 7.12443 8.21097C6.97539 8.06336 6.90087 7.87641 6.90087 7.65013C6.90087 7.42385 6.97539 7.23655 7.12443 7.08825C7.27277 6.94064 7.46064 6.86684 7.68805 6.86684H9.26239C9.48979 6.86684 9.67802 6.94064 9.82705 7.08825C9.97539 7.23655 10.0496 7.42385 10.0496 7.65013V12.376C10.0496 12.5849 9.97539 12.7631 9.82705 12.9107C9.67802 13.059 9.48979 13.1332 9.26239 13.1332C9.03498 13.1332 8.84711 13.059 8.69877 12.9107C8.54974 12.7631 8.47522 12.5762 8.47522 12.3499V8.43342ZM14.2478 15.2219V12.0888C14.2478 11.7929 14.3486 11.5446 14.5501 11.3441C14.7509 11.1443 15 11.0444 15.2974 11.0444C15.5948 11.0444 15.8438 11.1401 16.0447 11.3316C16.2462 11.5231 16.3469 11.7668 16.3469 12.0627V16.2663C16.3469 16.5622 16.2462 16.8101 16.0447 17.0099C15.8438 17.2104 15.5948 17.3107 15.2974 17.3107H3.59475L4.46064 18.1723C4.67055 18.3812 4.78006 18.6336 4.78915 18.9295C4.79755 19.2254 4.69679 19.4778 4.48688 19.6867C4.27697 19.8956 4.02787 20 3.73959 20C3.45061 20 3.20991 19.9043 3.01749 19.7128L0.28863 16.9974C0.09621 16.8059 0 16.5622 0 16.2663C0 15.9704 0.09621 15.7267 0.28863 15.5352L2.99125 12.846C3.20117 12.6371 3.45061 12.5326 3.73959 12.5326C4.02787 12.5326 4.27697 12.6371 4.48688 12.846C4.69679 13.0548 4.80175 13.303 4.80175 13.5906C4.80175 13.8775 4.69679 14.1253 4.48688 14.3342L3.59475 15.2219H14.2478ZM3.75219 4.77807V7.91123C3.75219 8.20714 3.65178 8.455 3.45096 8.65483C3.24945 8.85535 3 8.95561 2.70262 8.95561C2.40525 8.95561 2.1558 8.85988 1.95429 8.66841C1.75347 8.47694 1.65306 8.23325 1.65306 7.93734V3.73368C1.65306 3.43777 1.75347 3.18956 1.95429 2.98903C2.1558 2.78921 2.40525 2.68929 2.70262 2.68929H14.4052L13.5394 1.82768C13.3294 1.6188 13.2203 1.36641 13.2119 1.0705C13.2028 0.774587 13.3032 0.522193 13.5131 0.313316C13.723 0.104439 13.9725 0 14.2615 0C14.5497 0 14.7901 0.0957355 14.9825 0.287206L17.7114 3.00261C17.9038 3.19408 18 3.43777 18 3.73368C18 4.02959 17.9038 4.27328 17.7114 4.46475L15.0087 7.15405C14.7988 7.36292 14.5497 7.46736 14.2615 7.46736C13.9725 7.46736 13.723 7.36292 13.5131 7.15405C13.3032 6.94517 13.1982 6.69695 13.1982 6.4094C13.1982 6.12254 13.3032 5.87467 13.5131 5.6658L14.4052 4.77807H3.75219Z" fill="#EEEEEE" />
    </svg>
  );
}

function IconCancel({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 9.70342L2.03802 15.6654C1.81496 15.8885 1.53105 16 1.18631 16C0.841571 16 0.557667 15.8885 0.3346 15.6654C0.111533 15.4423 0 15.1584 0 14.8137C0 14.4689 0.111533 14.185 0.3346 13.962L6.29658 8L0.3346 2.03802C0.111533 1.81496 0 1.53105 0 1.18631C0 0.841571 0.111533 0.557667 0.3346 0.3346C0.557667 0.111533 0.841571 0 1.18631 0C1.53105 0 1.81496 0.111533 2.03802 0.3346L8 6.29658L13.962 0.3346C14.185 0.111533 14.4689 0 14.8137 0C15.1584 0 15.4423 0.111533 15.6654 0.3346C15.8885 0.557667 16 0.841571 16 1.18631C16 1.53105 15.8885 1.81496 15.6654 2.03802L9.70342 8L15.6654 13.962C15.8885 14.185 16 14.4689 16 14.8137C16 15.1584 15.8885 15.4423 15.6654 15.6654C15.4423 15.8885 15.1584 16 14.8137 16C14.4689 16 14.185 15.8885 13.962 15.6654L8 9.70342Z" fill="#EEEEEE" />
    </svg>
  );
}

function IconDone({ width = 20, height = 14 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.7217 0.5C18.9891 0.500058 19.1651 0.577653 19.2959 0.704102C19.4253 0.829195 19.5 0.991309 19.5 1.23633C19.5 1.48265 19.425 1.64561 19.2959 1.77051L7.37793 13.2959C7.2944 13.3767 7.21586 13.4231 7.14258 13.4482L7.13965 13.4492C7.04553 13.4819 6.93935 13.5 6.81836 13.5C6.69729 13.5 6.59123 13.482 6.49707 13.4492L6.49512 13.4482L6.38086 13.3926C6.34171 13.3679 6.30142 13.3362 6.25977 13.2959L0.688477 7.90918C0.563738 7.78847 0.49342 7.63205 0.5 7.39062C0.507685 7.14081 0.587991 6.97206 0.72168 6.84277C0.855175 6.71373 1.02748 6.63873 1.28027 6.63867C1.5333 6.63867 1.70628 6.71361 1.83984 6.84277L6.4707 11.3213L6.81836 11.6572L7.16602 11.3213L18.1455 0.704102C18.2761 0.577804 18.4528 0.5 18.7217 0.5Z" fill="#EEEEEE" stroke="#EEEEEE" />
    </svg>
  );
}

function IconBackspace({ width = 24, height = 19 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 63 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M46.8198 35.6066C46.3622 36.0642 45.8234 36.2929 45.2033 36.2929C44.5853 36.2929 44.0475 36.0642 43.59 35.6066L36.2132 28.2298L28.8364 35.6066C28.3789 36.0642 27.8406 36.2924 27.2215 36.2913C26.6025 36.2924 26.0642 36.0642 25.6066 35.6066C25.149 35.149 24.9203 34.6102 24.9203 33.9901C24.9203 33.3721 25.149 32.8343 25.6066 32.3768L32.9834 25L25.6066 17.6232C25.149 17.1657 24.9197 16.6274 24.9186 16.0083C24.9197 15.3893 25.149 14.851 25.6066 14.3934C26.0642 13.9358 26.6025 13.7065 27.2215 13.7054C27.8406 13.7065 28.3789 13.9358 28.8364 14.3934L36.2132 21.7702L43.59 14.3934C44.0475 13.9358 44.5858 13.7065 45.2049 13.7054C45.8239 13.7065 46.3622 13.9358 46.8198 14.3934C47.2774 14.851 47.5061 15.3887 47.5061 16.0067C47.5061 16.6268 47.2774 17.1657 46.8198 17.6232L39.443 25L46.8198 32.3768C47.2774 32.8343 47.5061 33.3721 47.5061 33.9901C47.5061 34.6102 47.2774 35.149 46.8198 35.6066Z" fill="#EEEEEE" />
      <path d="M17.8583 47.75C18.8156 49.1161 20.4111 50 22.1928 50L57.6816 49.9732C60.6067 49.9732 63 47.5893 63 44.6429L63 5.35715C63 2.41072 60.6067 0.0267923 57.6816 0.0267921L22.1928 2.47219e-07C20.4112 9.14616e-08 18.8156 0.883932 17.8583 2.25L2.90083e-06 25L17.8583 47.75ZM22.1928 5.35714L57.6816 5.35714L57.6816 44.6429L22.1928 44.6429L6.51504 25L22.1928 5.35714Z" fill="#EEEEEE" />
    </svg>
  );
}

// ---------- Main App ----------

let uid = 100;
const nextId = () => `line-${uid++}`;

export default function ToastPOS() {
  const [cart, setCart] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [browseCategory, setBrowseCategory] = useState("Combo");
  const [comboTab, setComboTab] = useState("chicken");
  const [orderType, setOrderType] = useState("Dine In");
  const [serverName, setServerName] = useState("Sumin S");
  const [view, setView] = useState("order"); // "order" | "payment" | "confirm" | "ubereats"
  const [ticketNumber, setTicketNumber] = useState(26);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [tenderedInput, setTenderedInput] = useState(""); // digits typed on keypad
  const scale = useCanvasScale();

  const selectedLine = cart.find((l) => l.id === selectedLineId) || null;
  const adjust = PRICE_ADJUST[orderType] || 0;
  const visibleCategories = ALL_CATEGORIES.filter(
    (c) => !(HIDDEN_CATEGORIES[orderType] || []).includes(c)
  );

  const displayPrice = (basePrice) => basePrice + adjust;

  const subtotal = cart.reduce(
    (sum, l) => sum + displayPrice(l.basePrice) * l.qty,
    0
  );
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  // cart

  function updateLine(id, patch) {
    setCart((c) => c.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function handleSetOrderType(type) {
    setOrderType(type);
    // if category is hidden now, go back to Combo
    const hidden = HIDDEN_CATEGORIES[type] || [];
    if (hidden.includes(browseCategory)) setBrowseCategory("Combo");
  }

  function addItemToCart(category, item) {
    const isCombo = category === "Combo";
    const line = {
      id: nextId(),
      itemId: item.id,
      category,
      name: item.name,
      basePrice: item.price,
      qty: 1,
      isCombo,
      combo: isCombo ? { chicken: [], side: [], drink: [] } : null,
      modifiers: [],
      note: "",
    };
    setCart((c) => [...c, line]);
    if (isCombo) {
      // combo -> open combo detail
      setSelectedLineId(line.id);
      setComboTab("chicken");
    }
    // other items just get added
  }

  function selectCartLine(line) {
    setSelectedLineId(line.id);
    if (line.isCombo) setComboTab("chicken");
  }

  function setComboSelection(line, slotKey, item) {
    const slots = COMBO_SLOTS[line.name] || { chicken: 1, side: 1, drink: 1 };
    const max = slots[slotKey] || 1;
    const current = line.combo[slotKey];
    let next;
    if (max === 1) {
      next = [item.name];
    } else {
      if (current.includes(item.name)) {
        next = current.filter((n) => n !== item.name);
      } else if (current.length >= max) {
        next = [...current.slice(1), item.name];
      } else {
        next = [...current, item.name];
      }
    }
    const combo = { ...line.combo, [slotKey]: next };
    updateLine(line.id, { combo });
  }

  function toggleModifier(line, mod) {
    const has = line.modifiers.includes(mod);
    const modifiers = has
      ? line.modifiers.filter((m) => m !== mod)
      : [...line.modifiers, mod];
    updateLine(line.id, { modifiers });
  }

  function changeQty(line, delta) {
    const qty = line.qty + delta;
    if (qty <= 0) {
      removeLine(line.id);
      return;
    }
    updateLine(line.id, { qty });
  }

  function removeLine(id) {
    setCart((c) => c.filter((l) => l.id !== id));
    if (selectedLineId === id) setSelectedLineId(null);
  }

  function repeatLine(line) {
    const duplicate = {
      ...line,
      id: nextId(),
      combo: line.combo
        ? {
            chicken: [...line.combo.chicken],
            side: [...line.combo.side],
            drink: [...line.combo.drink],
          }
        : null,
      modifiers: [...line.modifiers],
    };
    setCart((c) => [...c, duplicate]);
  }

  function doneEditing() {
    setSelectedLineId(null);
  }

  function goToPayment() {
    // go to payment screen
    if (cart.length === 0) return;
    setTenderedInput("");
    setPaymentMethod(null);
    setView("payment");
  }

  function backToOrder() {
    setView("order");
  }

  function goToUberEats() {
    // uber eats has its own page
    setPaymentMethod("ubereats");
    setView("ubereats");
  }

  function cancelPayment() {
    // back to payment screen, keep everything
    setView("payment");
  }

  function confirmPayment() {
    // done -> clear cart, next ticket
    setCart([]);
    setSelectedLineId(null);
    setPaymentMethod(null);
    setTenderedInput("");
    setTicketNumber((n) => n + 1);
    setView("order");
  }

  function pressKeypad(key) {
    if (key === "C") {
      setTenderedInput("");
      return;
    }
    if (key === "back") {
      setTenderedInput((s) => s.slice(0, -1));
      return;
    }
    setTenderedInput((s) => (s + key).replace(/^0+(?=\d)/, "").slice(0, 9));
  }

  function setQuickTender(amount) {
    setTenderedInput(String(Math.round(amount * 100)));
  }

  const balanceDue = total;
  const amountTendered = tenderedInput
    ? parseInt(tenderedInput, 10) / 100
    : balanceDue;
  const tipAmount = Math.max(amountTendered - balanceDue, 0);

  function comboDescription(line) {
    const slots = COMBO_SLOTS[line.name] || { chicken: 1, side: 1, drink: 1 };
    const parts = [];
    ["chicken", "side", "drink"].forEach((k) => {
      const chosen = line.combo[k];
      const need = slots[k];
      if (chosen.length === 0) {
        parts.push(`Select ${need > 1 ? need + " " : ""}${k}`);
      } else {
        parts.push(chosen.join(" + "));
      }
    });
    return parts.join(" / ");
  }

  // ---------- Render ----------

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          background: COLORS.bg,
          color: COLORS.white,
          fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif",
          fontSize: 14,
          overflow: "hidden",
        }}
      >
        {view === "confirm" ? (
          <PaymentConfirmScreen onCancel={cancelPayment} onConfirm={confirmPayment} />
        ) : view === "ubereats" ? (
          <UberEatsPaymentScreen
            ticketNumber={ticketNumber}
            balanceDue={balanceDue}
            onCancel={cancelPayment}
            onConfirm={confirmPayment}
          />
        ) : view === "payment" ? (
          <>
            <TopBar ticketNumber={ticketNumber} onBack={backToOrder} />

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              <PaymentBillPanel
                cart={cart}
                selectedLineId={selectedLineId}
                onSelectLine={selectCartLine}
                onQty={changeQty}
                subtotal={subtotal}
                tax={tax}
                total={total}
                balanceDue={balanceDue}
                comboDescription={comboDescription}
                displayPrice={displayPrice}
                orderType={orderType}
                serverName={serverName}
                setServerName={setServerName}
                onDone={backToOrder}
              />
              <PaymentPanel
                balanceDue={balanceDue}
                amountTendered={amountTendered}
                tipAmount={tipAmount}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onKeypad={pressKeypad}
                onQuickTender={setQuickTender}
                onUberEats={goToUberEats}
              />
            </div>
          </>
        ) : (
          <>
            <TopBar ticketNumber={ticketNumber} />

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              <LeftPanel
                cart={cart}
                selectedLineId={selectedLineId}
                onSelectLine={selectCartLine}
                onQty={changeQty}
                subtotal={subtotal}
                tax={tax}
                total={total}
                comboDescription={comboDescription}
                displayPrice={displayPrice}
                orderType={orderType}
                serverName={serverName}
                setServerName={setServerName}
                onPay={goToPayment}
              />
              <RightPanel
                selectedLine={selectedLine}
                browseCategory={browseCategory}
                setBrowseCategory={setBrowseCategory}
                addItemToCart={addItemToCart}
                comboTab={comboTab}
                setComboTab={setComboTab}
                setComboSelection={setComboSelection}
                toggleModifier={toggleModifier}
                changeQty={changeQty}
                removeLine={removeLine}
                repeatLine={repeatLine}
                doneEditing={doneEditing}
                comboDescription={comboDescription}
                visibleCategories={visibleCategories}
                displayPrice={displayPrice}
                orderType={orderType}
                setOrderType={handleSetOrderType}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Top Bar ----------

function TopBar({ ticketNumber, onBack }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 80,
        borderBottom: `1px solid ${COLORS.border}`,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 500,
          minWidth: 500,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          boxSizing: "border-box",
          // divider lines up with the left panel border
          borderRight: `1px solid ${COLORS.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            onClick={onBack}
            style={{ display: "flex", cursor: onBack ? "pointer" : "default" }}
          >
            <IconBack width={22} height={18} />
          </span>
          <span style={{ fontWeight: 700, fontSize: 18, color: COLORS.white }}>
            #{ticketNumber}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${COLORS.borderLight}`,
              borderRadius: 50,
              padding: "10px 20px",
              fontSize: 18,
              color: COLORS.textLight,
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex" }}>
              <IconTabPerson width={16} height={16} />
            </span>
            Tab Name
          </div>
          <span style={{ display: "flex", cursor: "pointer" }}>
            <IconMore width={7} height={22} />
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 14,
          padding: "0 30px",
          boxSizing: "border-box",
        }}
      >
        <PillHeaderBtn icon={<IconAllChecks width={16} height={18} />} label="All Checks" />
        <PillHeaderBtn icon={<IconSwitchUser width={17} height={17} />} label="Switch User" />
        <span style={{ display: "flex", cursor: "pointer" }}>
          <IconMore width={7} height={22} />
        </span>
      </div>
    </div>
  );
}

function PillHeaderBtn({ icon, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${COLORS.borderLight}`,
        borderRadius: 50,
        padding: "10px 20px",
        fontSize: 18,
        color: COLORS.textLight,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex" }}>{icon}</span>
      {label}
    </div>
  );
}

// ---------- Left Panel ----------

// server + order type row (used on order & payment screens)
function BillIdOrderRow({ orderType, serverName, setServerName }) {
  const [serverMenuOpen, setServerMenuOpen] = useState(false);
  const currentServer =
    SERVERS.find((s) => s.name === serverName) || SERVERS[0];

  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      <div
        onClick={() => setServerMenuOpen((o) => !o)}
        style={{
          position: "relative",
          flex: 1,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
          cursor: "pointer",
        }}
      >
        {/* dot + chevron */}
        <span
          style={{
            position: "absolute",
            left: 30,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        >
          <IconIdDot color={currentServer.dotColor} />
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            lineHeight: "normal",
            letterSpacing: "-0.36px",
            color: COLORS.white,
          }}
        >
          {serverName}
        </span>
        <span
          style={{
            position: "absolute",
            right: 30,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
          }}
        >
          <IconChevronDown />
        </span>

        {serverMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: 4,
              background: COLORS.panelBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              overflow: "hidden",
              zIndex: 20,
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}
          >
            {SERVERS.map((s) => (
              <div
                key={s.name}
                onClick={() => {
                  setServerName(s.name);
                  setServerMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  fontSize: 16,
                  cursor: "pointer",
                  background: s.name === serverName ? COLORS.bg : "transparent",
                  color: COLORS.white,
                }}
              >
                <IconIdDot color={s.dotColor} />
                {s.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          background: COLORS.panelBg,
          border: `1px solid ${COLORS.border}`,
          borderTop: "none",
          borderRight: "none",
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.white,
        }}
      >
        {orderType}
      </div>
    </div>
  );
}

// cart lines (used on order & payment screens)
function BillCartLines({ cart, selectedLineId, onSelectLine, onQty, comboDescription, displayPrice }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {cart.length === 0 && (
        <div
          style={{
            padding: 24,
            color: COLORS.textDim,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          No items yet — pick something on the right.
        </div>
      )}
      {cart.map((line) => (
        <div
          key={line.id}
          onClick={() => onSelectLine(line)}
          style={{
            // 60px row height from padding (grows if there are modifiers)
            boxSizing: "border-box",
            padding: "17.5px 30px",
            cursor: "pointer",
            background: selectedLineId === line.id ? "#2a2a2a" : "transparent",
            borderLeft:
              selectedLineId === line.id
                ? `3px solid ${COLORS.orange}`
                : "3px solid transparent",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onQty(line, 1);
              }}
              style={qtyBtnStyle}
            >
              <IconQtyPlus />
            </div>
            <span style={{ width: 18, textAlign: "center", fontSize: 18, color: COLORS.white }}>
              {line.qty}
            </span>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onQty(line, -1);
              }}
              style={qtyBtnStyle}
            >
              <IconQtyMinus />
            </div>
            <span style={{ fontSize: 18, color: COLORS.white, marginLeft: 4 }}>
              {line.name}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 18, color: COLORS.white }}>
              $ {(displayPrice(line.basePrice) * line.qty).toFixed(2)}
            </span>
          </div>
          {line.isCombo && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: COLORS.textMuted,
                marginTop: 6,
                textAlign: "left",
              }}
            >
              {comboDescription(line)}
            </div>
          )}
          {!line.isCombo && (line.modifiers.length > 0 || line.note) && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 300,
                color: COLORS.textMuted,
                marginTop: 6,
                textAlign: "left",
              }}
            >
              {[line.note, ...line.modifiers].filter(Boolean).join(" / ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LeftPanel({
  cart,
  selectedLineId,
  onSelectLine,
  onQty,
  subtotal,
  tax,
  total,
  comboDescription,
  displayPrice,
  orderType,
  serverName,
  setServerName,
  onPay,
}) {
  return (
    <div
      style={{
        width: 500,
        minWidth: 500,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${COLORS.border}`,
        background: COLORS.panelBg,
      }}
    >
      <BillIdOrderRow orderType={orderType} serverName={serverName} setServerName={setServerName} />

      <BillCartLines
        cart={cart}
        selectedLineId={selectedLineId}
        onSelectLine={onSelectLine}
        onQty={onQty}
        comboDescription={comboDescription}
        displayPrice={displayPrice}
      />

      {/* stay / send */}
      <div style={{ display: "flex", gap: 12, padding: "20px 30px 0" }}>
        <button style={bigBtnStyle}>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              background: COLORS.orange,
            }}
          />
          Stay
        </button>
        <button style={bigBtnStyle}>
          <IconSend />
          Send
        </button>
      </div>

      {/* totals */}
      <div
        style={{
          margin: "20px 0 0",
          padding: "14px 0",
          border: `1px solid ${COLORS.borderTotal}`,
          borderRight: "none",
          borderLeft: "none",
          background: COLORS.panelBg,
        }}
      >
        <Row label="Sub Total" value={subtotal} />
        <Row label="Tax" value={tax} />
      </div>

      {/* footer */}
      <div style={{ display: "flex" }}>
        <div style={{ ...footerBtnStyle, flex: 0.7 }}>No Sale</div>
        <div
          style={{
            ...footerBtnStyle,
            flex: 0.7,
            borderLeft: `1px solid ${COLORS.border}`,
          }}
        >
          Print
        </div>
        <div
          onClick={onPay}
          style={{
            ...footerBtnStyle,
            flex: 1.4,
            background: COLORS.orange,
            fontWeight: 700,
            color: COLORS.white,
            borderLeft: `1px solid ${COLORS.border}`,
          }}
        >
          Pay $ {total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

// ---------- Payment Bill Panel ----------

function PaymentBillPanel({
  cart,
  selectedLineId,
  onSelectLine,
  onQty,
  subtotal,
  tax,
  total,
  balanceDue,
  comboDescription,
  displayPrice,
  orderType,
  serverName,
  setServerName,
  onDone,
}) {
  return (
    <div
      style={{
        width: 500,
        minWidth: 500,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${COLORS.border}`,
        background: COLORS.panelBg,
      }}
    >
      <BillIdOrderRow orderType={orderType} serverName={serverName} setServerName={setServerName} />

      <BillCartLines
        cart={cart}
        selectedLineId={selectedLineId}
        onSelectLine={onSelectLine}
        onQty={onQty}
        comboDescription={comboDescription}
        displayPrice={displayPrice}
      />

      {/* sub total / tax */}
      <div
        style={{
          margin: "20px 0 0",
          padding: "14px 0",
          border: `1px solid ${COLORS.borderTotal}`,
          borderRight: "none",
          borderLeft: "none",
          background: COLORS.panelBg,
        }}
      >
        <Row label="Sub Total" value={subtotal} />
        <Row label="Tax" value={tax} />
      </div>

      {/* total / balance due */}
      <div
        style={{
          padding: "14px 0",
          border: `1px solid ${COLORS.borderTotal}`,
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
          background: COLORS.panelBg,
        }}
      >
        <Row label="Total" value={total} />
        <Row label="Balance Due" value={balanceDue} />
      </div>

      {/* done button */}
      <div style={{ display: "flex", flexShrink: 0, padding: "0 20px", margin: "20px 0 28px" }}>
        <div onClick={onDone} style={pillFooterBtnStyle}>
          Done
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  display: "flex",
  cursor: "pointer",
};

const bigBtnStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px 0",
  borderRadius: 50,
  border: `1px solid ${COLORS.borderLight}`,
  background: COLORS.bg,
  color: COLORS.textLight,
  fontSize: 18,
  fontWeight: 500,
  cursor: "pointer",
};

const footerBtnStyle = {
  height: 80,
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontSize: 18,
  color: COLORS.textLight,
  background: COLORS.bg,
  borderLeft: "none",
  cursor: "pointer",
};

// ---------- Payment Confirmation ----------

function PaymentConfirmScreen({ onCancel, onConfirm }) {
  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        width: "100%",
        background: COLORS.bg,
      }}
    >
      <p
        style={{
          position: "absolute",
          left: "50%",
          top: 353,
          transform: "translateX(-50%)",
          margin: 0,
          fontWeight: 700,
          fontSize: 24,
          color: COLORS.white,
          whiteSpace: "nowrap",
        }}
      >
        Confirm Payment?
      </p>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 406,
          transform: "translateX(-50%)",
          fontSize: 18,
          fontWeight: 400,
          color: COLORS.textMuted,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        <p style={{ margin: 0, lineHeight: "normal" }}>
          This will automatically complete the order.
        </p>
        <p style={{ margin: 0, lineHeight: "normal" }}>
          For regular payment, press <span style={{ fontWeight: 600 }}>Cancel</span> to choose another
          payment method.
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 506,
          transform: "translateX(-50%)",
          display: "flex",
          gap: 20,
        }}
      >
        <div
          onClick={onCancel}
          style={{
            width: 253,
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            background: "#333",
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.36px",
            cursor: "pointer",
          }}
        >
          Cancel
        </div>
        <div
          onClick={onConfirm}
          style={{
            width: 253,
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            background: COLORS.orange,
            color: COLORS.white,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.36px",
            cursor: "pointer",
          }}
        >
          Yes, confirm
        </div>
      </div>
    </div>
  );
}

// ---------- Uber Eats Payment ----------

function UberEatsPaymentScreen({ ticketNumber, balanceDue, onCancel, onConfirm }) {
  return (
    <>
      <TopBar ticketNumber={ticketNumber} onBack={onCancel} />
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
        }}
      >
        <div style={{ width: 526, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: COLORS.orange,
              borderRadius: 5,
              padding: "20px 40px",
              marginBottom: 30,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.white, letterSpacing: "-0.36px" }}>
              Uber Eats
            </span>
          </div>

          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.white,
              margin: "0 0 16px",
              textAlign: "center",
            }}
          >
            Confirm Payment?
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.textMuted,
              textAlign: "center",
              lineHeight: "normal",
              margin: "0 0 30px",
            }}
          >
            This order was already paid through Uber Eats.
            <br />
            Confirming will mark <span style={{ fontWeight: 600 }}>Order #{ticketNumber}</span> as paid and
            complete it.<br /> For regular payment, press{" "}
            <span style={{ fontWeight: 600 }}>Cancel</span> to choose another payment method.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              boxSizing: "border-box",
              border: `1px solid ${COLORS.borderTotal}`,
              borderRadius: 5,
              padding: "16px 30px",
              marginBottom: 40,
              background: COLORS.panelBg,
            }}
          >
            <span style={{ fontSize: 18, color: COLORS.white }}>Order Total</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.white }}>
              $ {balanceDue.toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div
              onClick={onCancel}
              style={{
                width: 253,
                height: 62,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                background: "#333",
                color: COLORS.white,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.36px",
                cursor: "pointer",
              }}
            >
              Cancel
            </div>
            <div
              onClick={onConfirm}
              style={{
                width: 253,
                height: 62,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 5,
                background: COLORS.orange,
                color: COLORS.white,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.36px",
                cursor: "pointer",
              }}
            >
              Confirm Payment
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------- Payment Screen ----------

function PaymentPanel({
  balanceDue,
  amountTendered,
  tipAmount,
  paymentMethod,
  setPaymentMethod,
  onKeypad,
  onQuickTender,
  onUberEats,
}) {
  return (
    <div style={{ flex: 1, display: "flex", background: COLORS.bg, overflow: "hidden" }}>
      <CalcPanel
        balanceDue={balanceDue}
        amountTendered={amountTendered}
        tipAmount={tipAmount}
        onKeypad={onKeypad}
        onQuickTender={onQuickTender}
      />
      <CardPanel
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onUberEats={onUberEats}
      />
    </div>
  );
}

function CalcRow({ label, value, valueColor, noDollarSpace }) {
  return (
    <div
      style={{
        display: "flex",
        height: 60,
        boxSizing: "border-box",
        flexShrink: 0,
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div
        style={{
          width: 312,
          minWidth: 312,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.panelBg,
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.white,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 20px",
          background: COLORS.bg,
          borderLeft: `1px solid ${COLORS.border}`,
          fontSize: 20,
          fontWeight: 700,
          color: valueColor || COLORS.white,
          boxSizing: "border-box",
        }}
      >
        {noDollarSpace ? `$${value.toFixed(2)}` : `$ ${value.toFixed(2)}`}
      </div>
    </div>
  );
}

const KEYPAD_ROWS = [
  ["1", "2", "3", { quickIndex: 0 }],
  ["4", "5", "6", { quickIndex: 1 }],
  ["7", "8", "9", { quickIndex: 2 }],
  ["C", "0", "00", { back: true }],
];

// quick cash buttons: round up to next $5, then +5, +10
function quickTenderAmounts(balanceDue) {
  const base = Math.ceil(Math.max(balanceDue, 0) / 5) * 5 || 5;
  return [base, base + 5, base + 10];
}

function CalcPanel({ balanceDue, amountTendered, tipAmount, onKeypad, onQuickTender }) {
  const quickAmounts = quickTenderAmounts(balanceDue);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: COLORS.panelBg,
        borderRight: `1px solid ${COLORS.border}`,
        overflow: "hidden",
      }}
    >
      <CalcRow label="Balance Due" value={balanceDue} />
      <CalcRow label="Amount Tendered" value={amountTendered} valueColor={COLORS.orange} noDollarSpace />
      <CalcRow label="Tip" value={tipAmount} />

      {/* keypad */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          margin: "10px 11px 0",
        }}
      >
        {KEYPAD_ROWS.map((row, i) => (
          <div key={i} style={{ flex: 1, display: "flex", gap: 10 }}>
            {row.map((cell, j) => {
              const cellStyle = {
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#333",
                borderRadius: 10,
                color: COLORS.white,
                cursor: "pointer",
                boxSizing: "border-box",
              };
              if (typeof cell === "string") {
                return (
                  <div
                    key={j}
                    onClick={() => onKeypad(cell)}
                    style={{ ...cellStyle, fontSize: 50, fontWeight: 700, letterSpacing: "-1px" }}
                  >
                    {cell}
                  </div>
                );
              }
              if (cell.quickIndex != null) {
                const amt = quickAmounts[cell.quickIndex];
                return (
                  <div
                    key={j}
                    onClick={() => onQuickTender(amt)}
                    style={{ ...cellStyle, fontSize: 30, fontWeight: 400, letterSpacing: "-0.6px" }}
                  >
                    $ {amt}
                  </div>
                );
              }
              return (
                <div key={j} onClick={() => onKeypad("back")} style={cellStyle}>
                  <IconBackspace width={63} height={50} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* split / service charge */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexShrink: 0,
          padding: "0 20px",
          margin: "20px 0 28px",
        }}
      >
        <div style={pillFooterBtnStyle}>Split</div>
        <div style={pillFooterBtnStyle}>Service Charge</div>
      </div>
    </div>
  );
}

const pillFooterBtnStyle = {
  flex: 1,
  height: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 100,
  border: `1px solid ${COLORS.borderLight}`,
  background: COLORS.bg,
  color: COLORS.textLight,
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: "-0.36px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const PAYMENT_METHODS = [
  { key: "card", label: "Card", color: COLORS.orange },
  { key: "keyin", label: "Key in Card Number", color: "#666" },
  { key: "gift", label: "Gift Card", color: "#666" },
  { key: "ubereats", label: "Uber Eats", color: COLORS.orange },
];

function CardPanel({ paymentMethod, setPaymentMethod, onUberEats }) {
  return (
    <div
      style={{
        width: 319,
        minWidth: 319,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: COLORS.bg,
        padding: "20px 20px 0",
        boxSizing: "border-box",
      }}
    >
      {PAYMENT_METHODS.map((m) => {
        const active = paymentMethod === m.key;
        return (
          <div
            key={m.key}
            onClick={() => {
              // uber eats opens its own page
              if (m.key === "ubereats") {
                onUberEats();
              } else {
                setPaymentMethod(m.key);
              }
            }}
            style={{
              height: 62,
              flexShrink: 0,
              borderRadius: 5,
              background: m.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.36px",
              color: COLORS.white,
              cursor: "pointer",
              border: active ? "3px solid #fff" : "3px solid transparent",
              boxSizing: "border-box",
            }}
          >
            {m.label}
          </div>
        );
      })}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5px 30px",
        fontSize: 18,
        color: COLORS.white,
      }}
    >
      <span>{label}</span>
      <span>$ {value.toFixed(2)}</span>
    </div>
  );
}

// ---------- Right Panel ----------

function RightPanel(props) {
  const { selectedLine, orderType, setOrderType } = props;
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: COLORS.bg,
        overflow: "hidden",
      }}
    >
      <OrderTypeTabs orderType={orderType} setOrderType={setOrderType} />
      <div style={{ flex: 1, padding: 30, overflowY: "auto" }}>
        {selectedLine ? <EditView {...props} /> : <BrowseView {...props} />}
      </div>
    </div>
  );
}

function OrderTypeTabs({ orderType, setOrderType }) {
  return (
    <div style={{ display: "flex", flexShrink: 0 }}>
      {ORDER_TYPES.map((t, i) => {
        const isFirst = i === 0;
        return (
          <div
            key={t}
            onClick={() => setOrderType(t)}
            style={{
              flex: 1,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 60,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 18,
              background: orderType === t ? COLORS.orange : COLORS.bg,
              borderTop: "none",
              borderBottom: `1px solid ${COLORS.border}`,
              // first tab has no left border, last tab no right border
              borderLeft: isFirst ? "none" : `1px solid ${COLORS.border}`,
              borderRight: "none",
              color: COLORS.white,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}

// browse view

function BrowseView({
  browseCategory,
  setBrowseCategory,
  addItemToCart,
  visibleCategories,
  displayPrice,
}) {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length > 0;

  const searchResults = isSearching
    ? visibleCategories
        .flatMap((cat) => MENU[cat].map((item) => ({ ...item, category: cat })))
        .filter((item) =>
          item.name.toLowerCase().includes(query.trim().toLowerCase())
        )
    : [];

  const items = MENU[browseCategory] || [];

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.panelBg,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 50,
            padding: "12px 20px",
            color: COLORS.textDim,
          }}
        >
          <span style={{ display: "flex" }}>
            <IconSearch width={18} height={18} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: COLORS.white,
              fontSize: 18,
            }}
          />
          {isSearching && (
            <span
              onClick={() => setQuery("")}
              style={{ cursor: "pointer", color: COLORS.textDim, fontSize: 13 }}
            >
              &#10005;
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: `1px solid ${COLORS.borderLight}`,
            borderRadius: 50,
            padding: "12px 20px",
            whiteSpace: "nowrap",
            cursor: "pointer",
            color: COLORS.textLight,
            fontSize: 18,
          }}
        >
          <span style={{ display: "flex" }}>
            <IconOpenItem width={18} height={18} />
          </span>
          Open Item
        </div>
      </div>

      {isSearching ? (
        searchResults.length > 0 ? (
          <ItemGrid
            items={searchResults}
            selectedNames={[]}
            onPick={(item) => addItemToCart(item.category, item)}
            accentCategory={null}
            displayPrice={displayPrice}
            showCategoryLabel
          />
        ) : (
          <div
            style={{
              color: COLORS.textDim,
              fontSize: 14,
              padding: "24px 4px",
            }}
          >
            No items match "{query}".
          </div>
        )
      ) : (
        <>
          <CategoryGrid
            active={browseCategory}
            onPick={setBrowseCategory}
            visibleCategories={visibleCategories}
          />

          <ItemGrid
            items={items}
            selectedNames={[]}
            onPick={(item) => addItemToCart(browseCategory, item)}
            accentCategory={browseCategory}
            displayPrice={displayPrice}
          />
        </>
      )}
    </>
  );
}

function CategoryGrid({ active, onPick, visibleCategories }) {
  const isVisible = (c) => visibleCategories.includes(c);
  const renderRow = (row) => {
    const shown = row.filter(isVisible);
    if (shown.length === 0) return null;
    return (
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {shown.map((cat) => {
          const acc = accentColors(cat);
          const isActive = active === cat;
          return (
            <div
              key={cat}
              onClick={() => onPick(cat)}
              style={{
                textAlign: "center",
                padding: "20px 40px",
                borderRadius: 5,
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer",
                background: acc.color,
                border: isActive ? "3px solid #fff" : "3px solid transparent",
                color: acc.text,
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      {renderRow(CATEGORIES_ROW1)}
      {renderRow(CATEGORIES_ROW2)}
      {renderRow(CATEGORIES_ROW3)}
    </div>
  );
}

function ItemGrid({
  items,
  selectedNames,
  onPick,
  accentCategory,
  displayPrice,
  showCategoryLabel,
  showPrice = true,
  selectCount,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(165px, 1fr))",
        gap: 10,
        marginTop: 24,
      }}
    >
      {items.map((item) => {
        const disabled = item.badge === 0;
        const isSelected = selectedNames && selectedNames.includes(item.name);
        const acc = accentColors(accentCategory || item.category || "Chicken");
        const price = displayPrice ? displayPrice(item.price) : item.price;

        return (
          <div
            key={item.id}
            onClick={() => !disabled && onPick(item)}
            style={{
              position: "relative",
              boxSizing: "border-box",
              background: COLORS.panelBg,
              // box-shadow instead of border so the tile doesn't shift when selected
              border: "none",
              boxShadow: isSelected
                ? "inset 0 0 0 3px #fff"
                : `inset 0 0 0 2px ${disabled ? COLORS.border : acc.color}`,
              borderRadius: 5,
              padding: "50px 15px 12px",
              cursor: disabled ? "default" : "pointer",
              minHeight: 70,
              textAlign: "left",
            }}
          >
            {typeof item.badge === "number" && (
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.32px",
                  color: COLORS.textMuted,
                  background: COLORS.panelBg,
                  borderRadius: 50,
                  padding: "2px 10px",
                  border: `1px solid ${COLORS.textMuted}`,
                }}
              >
                {item.badge}
              </span>
            )}
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.36px",
                color: disabled ? COLORS.textDim : COLORS.white,
                marginBottom: 4,
              }}
            >
              {item.name}
            </div>
            {(showPrice || selectCount != null) && (
              <div
                style={{
                  fontSize: 16,
                  letterSpacing: "-0.32px",
                  color: disabled ? COLORS.textDim : acc.color,
                }}
              >
                {showPrice
                  ? price === 0
                    ? "Free"
                    : `$${price.toFixed(2)}`
                  : `Select ${selectCount}`}
              </div>
            )}
            {showCategoryLabel && item.category && (
              <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 6 }}>
                {item.category}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// edit view (item / combo)

function EditView({
  selectedLine: line,
  comboTab,
  setComboTab,
  setComboSelection,
  toggleModifier,
  changeQty,
  removeLine,
  repeatLine,
  doneEditing,
  displayPrice,
}) {
  return (
    <>
      {/* qty + action row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={smallQtyBtn} onClick={() => changeQty(line, 1)}>
          <IconQtyPlus size={36} />
        </div>
        <span
          style={{
            width: 50,
            textAlign: "center",
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "-0.4px",
            color: COLORS.white,
          }}
        >
          {line.qty}
        </span>
        <div style={smallQtyBtn} onClick={() => changeQty(line, -1)}>
          <IconQtyMinus size={36} />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <PillBtn icon={<IconDetails />} label="Details" />
          <PillBtn icon={<IconRepeat />} label="Repeat" onClick={() => repeatLine(line)} />
          <PillBtn icon={<IconCancel />} label="Cancel" onClick={() => removeLine(line.id)} />
          <PillBtn icon={<IconDone />} label="Done" onClick={doneEditing} />
        </div>
      </div>

      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.4px",
          marginBottom: 24,
          color: COLORS.white,
        }}
      >
        {line.name}
        {line.isCombo ? " Combo" : ""}
      </div>

      {line.isCombo && (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            {["chicken", "side", "drink"].map((slot) => {
              const acc = accentColors(
                slot === "chicken" ? "Chicken" : slot === "side" ? "Side" : "Beverage"
              );
              const isActive = comboTab === slot;
              return (
                <div
                  key={slot}
                  onClick={() => setComboTab(slot)}
                  style={{
                    textAlign: "center",
                    padding: "20px 40px",
                    borderRadius: 5,
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: "-0.36px",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    whiteSpace: "nowrap",
                    background: acc.color,
                    border: isActive ? "3px solid #fff" : "3px solid transparent",
                    color: COLORS.white,
                  }}
                >
                  {slot === "drink" ? "Drink" : slot}
                </div>
              );
            })}
          </div>

          <ItemGrid
            items={
              comboTab === "chicken"
                ? MENU.Chicken
                : comboTab === "side"
                ? MENU.Side
                : MENU.Beverage
            }
            selectedNames={line.combo[comboTab]}
            accentCategory={
              comboTab === "chicken" ? "Chicken" : comboTab === "side" ? "Side" : "Beverage"
            }
            onPick={(item) => setComboSelection(line, comboTab, item)}
            displayPrice={displayPrice}
            showPrice={false}
            selectCount={
              (COMBO_SLOTS[line.name] || { chicken: 1, side: 1, drink: 1 })[comboTab]
            }
          />
          <div style={{ marginTop: 30 }} />
        </>
      )}

      {/* modifier row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div
          style={{
            background: "#666",
            border: "3px solid transparent",
            borderRadius: 5,
            padding: "20px 40px",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "-0.36px",
            color: COLORS.white,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          + Add Note
        </div>
        {getModifiersForItem(line).map((mod) => {
          const active = line.modifiers.includes(mod);
          return (
            <div
              key={mod}
              onClick={() => toggleModifier(line, mod)}
              style={{
                textAlign: "center",
                background: "#333",
                border: active ? "3px solid #fff" : "3px solid transparent",
                borderRadius: 5,
                padding: "20px 40px",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.36px",
                color: COLORS.white,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {mod}
            </div>
          );
        })}
      </div>
    </>
  );
}

const smallQtyBtn = {
  display: "flex",
  cursor: "pointer",
};

function PillBtn({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${COLORS.borderLight}`,
        background: COLORS.bg,
        color: COLORS.textLight,
        borderRadius: 50,
        padding: "10px 20px",
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: "-0.36px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex" }}>{icon}</span>
      {label}
    </div>
  );
}
