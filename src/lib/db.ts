import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { Account, Debt } from "@/types";

const ACCOUNTS_COLLECTION = 'accounts';
const DEBTS_COLLECTION = 'debts';

function getUserCollection(userId: string, collectionName: string) {
  return collection(db, 'users', userId, collectionName);
}

export async function getAccounts(userId: string): Promise<Account[]> {
  const accountsRef = getUserCollection(userId, ACCOUNTS_COLLECTION);
  const querySnapshot = await getDocs(accountsRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Account));
}

export async function addAccount(userId: string, account: Omit<Account, "id">): Promise<Account> {
  const accountsRef = getUserCollection(userId, ACCOUNTS_COLLECTION);
  const newDocRef = doc(accountsRef);
  
  await setDoc(newDocRef, account);
  
  return {
    id: newDocRef.id,
    ...account
  };
}

export async function deleteAccount(userId: string, accountId: string): Promise<void> {
  const debtsQuery = query(
    getUserCollection(userId, DEBTS_COLLECTION),
    where('accountId', '==', accountId)
  );
  
  const debtsSnapshot = await getDocs(debtsQuery);
  
  if (!debtsSnapshot.empty) {
    throw new Error('Account has associated debts');
  }
  
  await deleteDoc(doc(getUserCollection(userId, ACCOUNTS_COLLECTION), accountId));
}

export async function updateAccount(userId: string, account: Account): Promise<void> {
  const { id, ...data } = account;
  await setDoc(doc(getUserCollection(userId, ACCOUNTS_COLLECTION), id), data);
}

export async function getDebts(userId: string): Promise<Debt[]> {
  const debtsRef = getUserCollection(userId, DEBTS_COLLECTION);
  const querySnapshot = await getDocs(debtsRef);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Debt));
}

export async function addDebt(userId: string, debt: Omit<Debt, "id">): Promise<Debt> {
  const debtsRef = getUserCollection(userId, DEBTS_COLLECTION);
  const newDocRef = doc(debtsRef);
  
  await setDoc(newDocRef, debt);
  
  return {
    id: newDocRef.id,
    ...debt
  };
}

export async function updateDebt(userId: string, debt: Debt): Promise<void> {
  const { id, ...data } = debt;
  await setDoc(doc(getUserCollection(userId, DEBTS_COLLECTION), id), data);
}

export async function deleteDebt(userId: string, debtId: string): Promise<void> {
  await deleteDoc(doc(getUserCollection(userId, DEBTS_COLLECTION), debtId));
}

export async function migrateLocalDataToFirestore(user: { uid: string }): Promise<void> {
  const accountsJson = localStorage.getItem('accounts');
  const debtsJson = localStorage.getItem('debts');
  
  const accounts = accountsJson ? JSON.parse(accountsJson) : [];
  const debts = debtsJson ? JSON.parse(debtsJson) : [];
  
  if (accounts.length === 0 && debts.length === 0) {
    return;
  }
  
  const batch = writeBatch(db);
  
  const accountsRef = getUserCollection(user.uid, ACCOUNTS_COLLECTION);
  
  const accountIdMap = new Map<string, string>();
  
  accounts.forEach((account: Account) => {
    const { id: oldId, ...accountData } = account;
    
    const newDocRef = doc(accountsRef);
    batch.set(newDocRef, accountData);
    
    accountIdMap.set(oldId, newDocRef.id);
  });
  
  const debtsRef = getUserCollection(user.uid, DEBTS_COLLECTION);
  
  debts.forEach((debt: Debt) => {
    const { id: oldId, accountId: oldAccountId, ...debtData } = debt;
    
    const newAccountId = accountIdMap.get(oldAccountId);
    
    if (newAccountId) {
      const newDocRef = doc(debtsRef);
      batch.set(newDocRef, {
        ...debtData,
        accountId: newAccountId
      });
    }
  });
  
  await batch.commit();
} 