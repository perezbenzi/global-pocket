
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Account, Debt } from "@/types";
import Header from "@/components/Header";
import TotalBalance from "@/components/TotalBalance";
import AccountCard from "@/components/AccountCard";
import DebtCard from "@/components/DebtCard";
import AddAccountForm from "@/components/AddAccountForm";
import AddDebtForm from "@/components/AddDebtForm";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  // State for accounts and debts
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const savedAccounts = localStorage.getItem("accounts");
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });
  
  const [debts, setDebts] = useState<Debt[]>(() => {
    const savedDebts = localStorage.getItem("debts");
    return savedDebts ? JSON.parse(savedDebts) : [];
  });

  // State for editing
  const [accountToEdit, setAccountToEdit] = useState<Account | undefined>(undefined);
  const [debtToEdit, setDebtToEdit] = useState<Debt | undefined>(undefined);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  // Account handlers
  const handleAddAccount = (accountData: Omit<Account, "id">) => {
    const newAccount = {
      ...accountData,
      id: uuidv4(),
    };
    setAccounts([...accounts, newAccount]);
    toast.success("Cuenta agregada exitosamente");
  };

  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(acc => 
      acc.id === updatedAccount.id ? updatedAccount : acc
    ));
    setAccountToEdit(undefined);
    toast.success("Cuenta actualizada exitosamente");
  };

  const handleDeleteAccount = (id: string) => {
    // Check if account has debts
    const hasDebts = debts.some(debt => debt.accountId === id);
    
    if (hasDebts) {
      toast.error("No se puede eliminar una cuenta con deudas asociadas");
      return;
    }
    
    setAccounts(accounts.filter(account => account.id !== id));
    toast.success("Cuenta eliminada exitosamente");
  };

  // Debt handlers
  const handleAddDebt = (debtData: Omit<Debt, "id">) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
    };
    setDebts([...debts, newDebt]);
    toast.success("Deuda agregada exitosamente");
  };

  const handleUpdateDebt = (updatedDebt: Debt) => {
    setDebts(debts.map(d => 
      d.id === updatedDebt.id ? updatedDebt : d
    ));
    setDebtToEdit(undefined);
    toast.success("Deuda actualizada exitosamente");
  };

  const handleDeleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
    toast.success("Deuda eliminada exitosamente");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-md mx-auto p-4 pb-16">
        <TotalBalance accounts={accounts} debts={debts} />
        
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="accounts">Cuentas</TabsTrigger>
            <TabsTrigger value="debts">Deudas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts" className="space-y-4">
            <div className="mb-4">
              <AddAccountForm 
                onAddAccount={handleAddAccount} 
                onUpdateAccount={handleUpdateAccount}
                account={accountToEdit}
              />
            </div>
            
            <div>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onEdit={(acc) => setAccountToEdit(acc)}
                    onDelete={handleDeleteAccount}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md">
                  <p className="text-muted-foreground">No tienes cuentas aún.</p>
                  <p className="text-sm mt-2">Agrega tu primera cuenta para comenzar.</p>
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
            
            <div>
              {debts.length > 0 ? (
                debts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    debt={debt}
                    accounts={accounts}
                    onEdit={(d) => setDebtToEdit(d)}
                    onDelete={handleDeleteDebt}
                  />
                ))
              ) : (
                <div className="text-center p-6 bg-muted rounded-md">
                  <p className="text-muted-foreground">No tienes deudas registradas.</p>
                  <p className="text-sm mt-2">¡Genial! O puedes agregar una si lo necesitas.</p>
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
