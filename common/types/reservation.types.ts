export interface Reservation {
  id?: string;
  cancelToken?: string | null;
  date: string
  guests: number;
  location: "INSIDE" | "OUTSIDE";
  startTime: string;
  name: string;
  phone: string;
  email: string | null;
  observations: string | null;
  user: string | null;
  state?: string | null;
}

