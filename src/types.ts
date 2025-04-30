
export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  accountId: string;
}
