export interface Reservation {
  date: string
  guests: number;
  location: "INSIDE" | "OUTSIDE";
  startTime: string;
  name: string;
  phone: string;
  email: string | null;
  observations: string | null;
  googleId: string | null;
}

