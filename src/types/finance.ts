export type IncomeCategory =
  | "Xona haqi"
  | "Ovqatlanish"
  | "Qo‘shimcha xizmatlar"
  | "Ijara"
  | "Boshqa kirim";

export type ExpenseCategory =
  | "Ish haqi"
  | "Kommunal to‘lovlar"
  | "Material/xaridlar"
  | "Ta’mirlash"
  | "Boshqa chiqim";

export interface Transaction {
  id: number;
  date: string; // YYYY-MM-DD
  type: "income" | "expense";
  category: IncomeCategory | ExpenseCategory;
  description: string;
  amount: number;
}
