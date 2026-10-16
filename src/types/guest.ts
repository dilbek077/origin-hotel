export interface Guest {
  id: number;
  fullName: string;
  phone: string;
  passport: string;
  notes: string;
  address?: string;
  lastVisit?: string;
}
