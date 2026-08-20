export type FieldStatus = "Safe" | "Watch" | "Triggered" | "Data unavailable";

export type Field = {
  id: string;
  name: string;
  farm: string;
  hectares: number;
  status: FieldStatus;
  stage: string;
  lastReading: string;
  source: "Synthetic demo data" | "FortyGuard";
  position: [number, number];
  peak: number | null;
};

export const fields: Field[] = [
  { id: "north", name: "North Field", farm: "Riverside Wheat", hectares: 42, status: "Triggered", stage: "Grain filling", lastReading: "11:00 UTC", source: "Synthetic demo data", position: [30.17, 71.49], peak: 38.1 },
  { id: "east", name: "East Plot", farm: "Riverside Wheat", hectares: 28, status: "Watch", stage: "Flowering", lastReading: "11:00 UTC", source: "Synthetic demo data", position: [30.11, 71.64], peak: 33.6 },
  { id: "south", name: "South Block", farm: "Meadowline Co-op", hectares: 53, status: "Safe", stage: "Grain filling", lastReading: "11:00 UTC", source: "Synthetic demo data", position: [29.97, 71.55], peak: 30.4 },
  { id: "west", name: "West Trial", farm: "Meadowline Co-op", hectares: 16, status: "Data unavailable", stage: "Flowering", lastReading: "—", source: "Synthetic demo data", position: [30.08, 71.34], peak: null },
];

export const temperatures = [
  { hour: "06", temp: 27.6, qualifying: false },
  { hour: "07", temp: 29.2, qualifying: false },
  { hour: "08", temp: 32.8, qualifying: false },
  { hour: "09", temp: 34.7, qualifying: true },
  { hour: "10", temp: 36.5, qualifying: true },
  { hour: "11", temp: 38.1, qualifying: true },
  { hour: "12", temp: 37.4, qualifying: true },
  { hour: "13", temp: 35.1, qualifying: true },
  { hour: "14", temp: 32.6, qualifying: false },
];

export const heatScore = [
  { hour: "06", score: 0 },
  { hour: "07", score: 0 },
  { hour: "08", score: 0 },
  { hour: "09", score: 0.7 },
  { hour: "10", score: 3.2 },
  { hour: "11", score: 7.3 },
  { hour: "12", score: 10.7 },
  { hour: "13", score: 11.8 },
  { hour: "14", score: 11.8 },
];

export const evidence = {
  id: "DEMO-042",
  policy: "HEAT-WHEAT-01 / v1.0",
  field: fields[0],
  exposure: "05 continuous hours",
  heatScore: "11.8 degree-hours",
  payoutBand: "50%",
  payoutAmount: "$12,500 simulated",
  generatedAt: "20 Aug 2026 · 11:05 UTC",
};

export const ledgerEntries = [
  { id: "DEMO-042", field: "North Field", date: "20 Aug 2026", band: "50%", amount: "$12,500", status: "Ready for review" },
  { id: "DEMO-031", field: "South Ridge", date: "18 Aug 2026", band: "25%", amount: "$4,800", status: "Recorded" },
  { id: "DEMO-019", field: "East Plot", date: "15 Aug 2026", band: "25%", amount: "$7,250", status: "Reviewed" },
];
