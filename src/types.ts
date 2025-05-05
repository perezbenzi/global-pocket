export interface Account {
  id: string;
  name: string;
  balance: number;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
}

export interface MonthlyExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  isPaid: boolean;
}

export interface QuickEditAction {
  accountId: string;
  amount: number;
  operation: 'add' | 'subtract';
}

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  description?: string;
}
