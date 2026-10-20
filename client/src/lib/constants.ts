export type Temple = {
  name: string;
  city: string;
  state: string;
  description: string;
  url?: string;
};

export const temples: Temple[] = [
  { name: "Shri Hanuman Mandir, Connaught Place", city: "New Delhi", state: "Delhi", description: "A beloved historic temple in the heart of the capital, known for its daily Hanuman worship." },
  { name: "Sankat Mochan Hanuman Temple", city: "Varanasi", state: "Uttar Pradesh", description: "A serene riverside shrine associated with Goswami Tulsidas and the living tradition of the Chalisa." },
  { name: "Mehandipur Balaji Temple", city: "Dausa", state: "Rajasthan", description: "A major pilgrimage destination dedicated to Balaji, a revered form of Hanuman." },
  { name: "Shri Hanuman Temple, Jamnagar", city: "Jamnagar", state: "Gujarat", description: "A devotional landmark where visitors gather for Hanuman naam smaran and aarti." },
  { name: "Sri Karya Siddhi Hanuman Temple", city: "Bengaluru", state: "Karnataka", description: "A contemporary temple devoted to service, prayer, and the compassionate strength of Hanuman." },
  { name: "Panchmukhi Hanuman Temple", city: "Rameswaram", state: "Tamil Nadu", description: "A southern pilgrimage stop associated with the five-faced form of Hanuman." },
];

export const templesReferenceUrl = "https://divineindia.shreehanumanchalisa.in/";

export const festivalDates = [
  { name: "Hanuman Jayanti", date: "April 2, 2026", note: "A day for remembrance, service, and recitation." },
  { name: "Bada Mangal", date: "Tuesdays in Jyeshtha", note: "A season of community kitchens and Hanuman worship in Uttar Pradesh." },
  { name: "Saturday prayer", date: "Every Saturday", note: "A traditional day for offering oil and reading the Chalisa." },
];
