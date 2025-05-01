import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Account, Debt } from '@/types';
import Header from '@/components/Header';
import TotalBalance from '@/components/TotalBalance';
import AccountCard from '@/components/AccountCard';
import DebtCard from '@/components/DebtCard';
import AddAccountForm from '@/components/AddAccountForm';
import AddDebtForm from '@/components/AddDebtForm';
import { toast } from '@/lib/toast';
import { useAuth } from '@/hooks/useAuth';
import {
  getAccounts,
  getDebts,
  addAccount,
  updateAccount,
  deleteAccount,
  addDebt,
  updateDebt,
  deleteDebt,
  updateAccountWithTransaction,
} from '@/lib/db';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [accountToEdit, setAccountToEdit] = useState<
    Account | undefined
  >(undefined);
  const [debtToEdit, setDebtToEdit] = useState<
    Debt | undefined
  >(undefined);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [fetchedAccounts, fetchedDebts] =
          await Promise.all([
            getAccounts(user.uid),
            getDebts(user.uid),
          ]);

        setAccounts(fetchedAccounts);
        setDebts(fetchedDebts);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleAddAccount = async (
    accountData: Omit<Account, 'id'>
  ) => {
    if (!user) return;

    try {
      const newAccount = await addAccount(
        user.uid,
        accountData
      );
      setAccounts([...accounts, newAccount]);
      toast.success('Account added successfully');
    } catch (error) {
      console.error('Error adding account:', error);
      toast.error('Error adding account');
    }
  };

  const handleUpdateAccount = async (
    updatedAccount: Account
  ) => {
    if (!user) return;

    try {
      await updateAccount(user.uid, updatedAccount);
      setAccounts(
        accounts.map(acc =>
          acc.id === updatedAccount.id
            ? updatedAccount
            : acc
        )
      );
      setAccountToEdit(undefined);
      toast.success('Account updated successfully');
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Error updating account');
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!user) return;

    try {
      const hasDebts = debts.some(
        debt => debt.accountId === id
      );

      if (hasDebts) {
        toast.error(
          'Cannot delete an account with associated debts'
        );
        return;
      }

      await deleteAccount(user.uid, id);
      setAccounts(
        accounts.filter(account => account.id !== id)
      );
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error deleting account');
    }
  };

  const handleAddDebt = async (
    debtData: Omit<Debt, 'id'>
  ) => {
    if (!user) return;

    try {
      const newDebt = await addDebt(user.uid, debtData);
      setDebts([...debts, newDebt]);
      toast.success('Debt added successfully');
    } catch (error) {
      console.error('Error adding debt:', error);
      toast.error('Error adding debt');
    }
  };

  const handleUpdateDebt = async (updatedDebt: Debt) => {
    if (!user) return;

    try {
      await updateDebt(user.uid, updatedDebt);
      setDebts(
        debts.map(d =>
          d.id === updatedDebt.id ? updatedDebt : d
        )
      );
      setDebtToEdit(undefined);
      toast.success('Debt updated successfully');
    } catch (error) {
      console.error('Error updating debt:', error);
      toast.error('Error updating debt');
    }
  };

  const handleDeleteDebt = async (id: string) => {
    if (!user) return;

    try {
      await deleteDebt(user.uid, id);
      setDebts(debts.filter(debt => debt.id !== id));
      toast.success('Debt deleted successfully');
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast.error('Error deleting debt');
    }
  };

  const handleAccountUpdated = async (
    updatedAccount: Account
  ) => {
    if (!user) return;

    setAccounts(
      accounts.map(acc =>
        acc.id === updatedAccount.id ? updatedAccount : acc
      )
    );
  };

  const handleQuickUpdate = async (
    accountId: string,
    amount: number,
    type: 'deposit' | 'withdrawal',
    description?: string
  ) => {
    if (!user) return;

    try {
      const { updatedAccount } =
        await updateAccountWithTransaction(
          user.uid,
          accountId,
          amount,
          type,
          description
        );

      setAccounts(
        accounts.map(acc =>
          acc.id === updatedAccount.id
            ? updatedAccount
            : acc
        )
      );

      toast.success(
        `${type === 'deposit' ? 'Added' : 'Subtracted'} $${amount.toFixed(2)} ${type === 'deposit' ? 'to' : 'from'} account`
      );
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Error updating account');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0 md:pt-16">
        <Navbar />
        <main className="container mx-auto p-4 pb-16 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <Skeleton className="h-40 w-full mb-6" />
          <div className="flex mb-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-16 md:pb-0">
      <Navbar />
      <main className="container mx-auto p-4 pb-16 max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <TotalBalance
          accounts={accounts}
          debts={debts}
          onAccountUpdate={handleAccountUpdated}
          onQuickUpdate={handleQuickUpdate}
        />

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="accounts">
              Accounts
            </TabsTrigger>
            <TabsTrigger value="debts">Debts</TabsTrigger>
          </TabsList>

          <TabsContent
            value="accounts"
            className="space-y-4"
          >
            <div className="mb-4">
              <AddAccountForm
                onAddAccount={handleAddAccount}
                onUpdateAccount={handleUpdateAccount}
                account={accountToEdit}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={acc => setAccountToEdit(acc)}
                    onUpdate={handleUpdateAccount}
                    onDelete={handleDeleteAccount}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md md:col-span-2 lg:col-span-3">
                  <p className="text-muted-foreground">
                    You don't have any accounts yet.
                  </p>
                  <p className="text-sm mt-2">
                    Add your first account to get started.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="debts" className="space-y-4">
            <div className="mb-4">
              <AddDebtForm
                accounts={accounts}
                onAddDebt={handleAddDebt}
                onUpdateDebt={handleUpdateDebt}
                debt={debtToEdit}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {debts.length > 0 ? (
                debts.map(debt => (
                  <DebtCard
                    key={debt.id}
                    debt={debt}
                    accounts={accounts}
                    onEdit={d => setDebtToEdit(d)}
                    onDelete={handleDeleteDebt}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md md:col-span-2 lg:col-span-3">
                  <p className="text-muted-foreground">
                    You don't have any debts registered.
                  </p>
                  <p className="text-sm mt-2">
                    Great! Or you can add one if needed.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
