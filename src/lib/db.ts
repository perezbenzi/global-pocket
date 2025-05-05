import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Account,
  Debt,
  Transaction,
  MonthlyExpense,
} from '@/types';

const ACCOUNTS_COLLECTION = 'accounts';
const DEBTS_COLLECTION = 'debts';
const TRANSACTIONS_COLLECTION = 'transactions';
const MONTHLY_EXPENSES_COLLECTION = 'monthlyExpenses';

function getUserCollection(
  userId: string,
  collectionName: string
) {
  return collection(db, 'users', userId, collectionName);
}

export async function getAccounts(
  userId: string
): Promise<Account[]> {
  const accountsRef = getUserCollection(
    userId,
    ACCOUNTS_COLLECTION
  );
  const querySnapshot = await getDocs(accountsRef);

  return querySnapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Account
  );
}

export async function addAccount(
  userId: string,
  account: Omit<Account, 'id'>
): Promise<Account> {
  const accountsRef = getUserCollection(
    userId,
    ACCOUNTS_COLLECTION
  );
  const newDocRef = doc(accountsRef);

  await setDoc(newDocRef, account);

  return {
    id: newDocRef.id,
    ...account,
  };
}

export async function deleteAccount(
  userId: string,
  accountId: string
): Promise<void> {
  const debtsQuery = query(
    getUserCollection(userId, DEBTS_COLLECTION),
    where('accountId', '==', accountId)
  );

  const debtsSnapshot = await getDocs(debtsQuery);

  if (!debtsSnapshot.empty) {
    throw new Error('Account has associated debts');
  }

  await deleteDoc(
    doc(
      getUserCollection(userId, ACCOUNTS_COLLECTION),
      accountId
    )
  );
}

export async function updateAccount(
  userId: string,
  account: Account
): Promise<void> {
  const { id, ...data } = account;
  await setDoc(
    doc(getUserCollection(userId, ACCOUNTS_COLLECTION), id),
    data
  );
}

export async function getDebts(
  userId: string
): Promise<Debt[]> {
  const debtsRef = getUserCollection(
    userId,
    DEBTS_COLLECTION
  );
  const querySnapshot = await getDocs(debtsRef);

  return querySnapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Debt
  );
}

export async function addDebt(
  userId: string,
  debt: Omit<Debt, 'id'>
): Promise<Debt> {
  const debtsRef = getUserCollection(
    userId,
    DEBTS_COLLECTION
  );
  const newDocRef = doc(debtsRef);

  await setDoc(newDocRef, debt);

  return {
    id: newDocRef.id,
    ...debt,
  };
}

export async function updateDebt(
  userId: string,
  debt: Debt
): Promise<void> {
  const { id, ...data } = debt;
  await setDoc(
    doc(getUserCollection(userId, DEBTS_COLLECTION), id),
    data
  );
}

export async function deleteDebt(
  userId: string,
  debtId: string
): Promise<void> {
  await deleteDoc(
    doc(getUserCollection(userId, DEBTS_COLLECTION), debtId)
  );
}

export async function addTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const transactionsRef = getUserCollection(
    userId,
    TRANSACTIONS_COLLECTION
  );
  const newDocRef = doc(transactionsRef);

  await setDoc(newDocRef, {
    ...transaction,
    date: transaction.date || new Date().toISOString(),
  });

  return {
    id: newDocRef.id,
    ...transaction,
  };
}

export async function getTransactions(
  userId: string,
  maxResults = 50
): Promise<Transaction[]> {
  const transactionsRef = getUserCollection(
    userId,
    TRANSACTIONS_COLLECTION
  );
  const q = query(
    transactionsRef,
    orderBy('date', 'desc'),
    limit(maxResults)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Transaction
  );
}

export async function updateAccountWithTransaction(
  userId: string,
  accountId: string,
  amount: number,
  type: 'deposit' | 'withdrawal',
  description?: string
): Promise<{
  updatedAccount: Account;
  transaction: Transaction;
}> {
  // Get the account
  const accountRef = doc(
    getUserCollection(userId, ACCOUNTS_COLLECTION),
    accountId
  );
  const accountDoc = await getDoc(accountRef);

  if (!accountDoc.exists()) {
    throw new Error('Account not found');
  }

  const account = {
    id: accountDoc.id,
    ...accountDoc.data(),
  } as Account;
  const updatedAccount = { ...account };

  // Update balance
  if (type === 'deposit') {
    updatedAccount.balance += amount;
  } else {
    updatedAccount.balance -= amount;
  }

  // Create transaction object
  const transaction: Omit<Transaction, 'id'> = {
    accountId,
    accountName: account.name,
    amount,
    type,
    date: new Date().toISOString(),
    description,
  };

  // Create batch to update both account and add transaction
  const batch = writeBatch(db);

  // Update account
  const { id, ...accountData } = updatedAccount;
  batch.set(accountRef, accountData);

  // Add transaction
  const transactionsRef = getUserCollection(
    userId,
    TRANSACTIONS_COLLECTION
  );
  const newTransactionRef = doc(transactionsRef);
  batch.set(newTransactionRef, transaction);

  // Commit the batch
  await batch.commit();

  return {
    updatedAccount,
    transaction: {
      id: newTransactionRef.id,
      ...transaction,
    },
  };
}

export async function migrateLocalDataToFirestore(user: {
  uid: string;
}): Promise<void> {
  const accountsJson = localStorage.getItem('accounts');
  const debtsJson = localStorage.getItem('debts');

  const accounts = accountsJson
    ? JSON.parse(accountsJson)
    : [];
  const debts = debtsJson ? JSON.parse(debtsJson) : [];

  if (accounts.length === 0 && debts.length === 0) {
    return;
  }

  const batch = writeBatch(db);

  const accountsRef = getUserCollection(
    user.uid,
    ACCOUNTS_COLLECTION
  );

  const accountIdMap = new Map<string, string>();

  accounts.forEach((account: Account) => {
    const { id: oldId, ...accountData } = account;

    const newDocRef = doc(accountsRef);
    batch.set(newDocRef, accountData);

    accountIdMap.set(oldId, newDocRef.id);
  });

  const debtsRef = getUserCollection(
    user.uid,
    DEBTS_COLLECTION
  );

  debts.forEach((debt: Debt) => {
    const {
      id: oldId,
      accountId: oldAccountId,
      ...debtData
    } = debt;

    const newAccountId = accountIdMap.get(oldAccountId);

    if (newAccountId) {
      const newDocRef = doc(debtsRef);
      batch.set(newDocRef, {
        ...debtData,
        accountId: newAccountId,
      });
    }
  });

  await batch.commit();
}

export async function deleteTransaction(
  userId: string,
  transactionId: string
): Promise<void> {
  await deleteDoc(
    doc(
      getUserCollection(userId, TRANSACTIONS_COLLECTION),
      transactionId
    )
  );
}

export async function getMonthlyExpenses(
  userId: string
): Promise<MonthlyExpense[]> {
  const expensesRef = getUserCollection(
    userId,
    MONTHLY_EXPENSES_COLLECTION
  );
  const q = query(expensesRef, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    doc =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as MonthlyExpense
  );
}

export async function addMonthlyExpense(
  userId: string,
  expense: Omit<MonthlyExpense, 'id'>
): Promise<string> {
  const expensesRef = getUserCollection(
    userId,
    MONTHLY_EXPENSES_COLLECTION
  );
  const newDocRef = doc(expensesRef);
  await setDoc(newDocRef, expense);
  return newDocRef.id;
}

export async function updateMonthlyExpense(
  userId: string,
  expenseId: string,
  expense: Omit<MonthlyExpense, 'id'>
): Promise<void> {
  await setDoc(
    doc(
      getUserCollection(
        userId,
        MONTHLY_EXPENSES_COLLECTION
      ),
      expenseId
    ),
    expense
  );
}

export async function deleteMonthlyExpense(
  userId: string,
  expenseId: string
): Promise<void> {
  await deleteDoc(
    doc(
      getUserCollection(
        userId,
        MONTHLY_EXPENSES_COLLECTION
      ),
      expenseId
    )
  );
}
