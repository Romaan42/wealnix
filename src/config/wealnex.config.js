export const WX_RATE = 100; // 1 WX$ = 100 PKR

export const BUNDLES = {
  STARTER: { id: 1, name: "Starter", priceWX: 20, pricePKR: 2000, vp: 2 },
  SILVER: { id: 2, name: "Silver", priceWX: 50, pricePKR: 5000, vp: 5 },
  GOLD: { id: 3, name: "Gold", priceWX: 100, pricePKR: 10000, vp: 10 },
  PLATINUM: { id: 4, name: "Platinum", priceWX: 150, pricePKR: 15000, vp: 15 },
  DIAMOND: { id: 5, name: "Diamond", priceWX: 200, pricePKR: 20000, vp: 20 },
};

// PDF se exact commission WX$ me
export const COMMISSION_TABLE = {
  20: { L1: 6, L2: 2.4, L3: 1.4, L4: 0.8, L5: 0.4 }, // Starter
  50: { L1: 17.5, L2: 6, L3: 3.5, L4: 2, L5: 1 }, // Silver
  100: { L1: 35, L2: 12, L3: 7, L4: 4, L5: 2 }, // Gold
  150: { L1: 57, L2: 18, L3: 10.5, L4: 6, L5: 3 }, // Platinum
  200: { L1: 80, L2: 24, L3: 14, L4: 8, L5: 4 }, // Diamond
};

export const WALLET_SPLIT = { E_WALLET: 0.8, S_WALLET: 0.2 };
export const WITHDRAW_RULES = {
  MIN_E_WALLET: 10,
  S_WALLET_LOCK: 500,
  TAX: 0.1,
};

export const RANKS = [
  { name: "Bronze", vp: 100, rewardWX: 30 },
  { name: "Silver", vp: 300, rewardWX: 100 },
  { name: "Gold", vp: 800, rewardWX: 300 },
  { name: "Platinum", vp: 2500, rewardWX: 1500 },
  { name: "Diamond", vp: 8000, rewardWX: 7000 },
  { name: "Crown Director", vp: 20000, rewardWX: 18000 },
];
