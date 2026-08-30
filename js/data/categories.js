export const CATEGORIES = [
  { id: "FIRE", label: "Incendie", icon: "🔥", weight: 0.25 },
  { id: "ELECTRICAL", label: "Électricité", icon: "⚡", weight: 0.25 },
  { id: "GAS", label: "Gaz", icon: "🧯", weight: 0.20 },
  { id: "WATER", label: "Eau", icon: "💧", weight: 0.10 },
  { id: "INTRUSION", label: "Intrusion", icon: "🔒", weight: 0.10 },
  { id: "PEOPLE", label: "Sécurité des personnes", icon: "👨‍👩‍👧", weight: 0.10 },
];

export function getCategoryById(categoryId) {
  const found = CATEGORIES.find((c) => c.id === categoryId);
  if (!found) throw new Error(`Unknown category id: "${categoryId}"`);
  return found;
}
