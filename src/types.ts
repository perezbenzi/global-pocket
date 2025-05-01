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
