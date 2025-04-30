
import React, { useState } from "react";
import { Account, Debt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface TotalBalanceProps {
  accounts: Account[];
  debts: Debt[];
}

const TotalBalance = ({ accounts, debts }: TotalBalanceProps) => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalBalance - totalDebt;

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [quickEditAmount, setQuickEditAmount] = useState("");

  const handleQuickEdit = (operation: 'add' | 'subtract', account: Account) => {
    setSelectedAccount(account);
    setQuickEditAmount("");
  };

  const saveQuickEdit = (operation: 'add' | 'subtract') => {
    if (!selectedAccount || !quickEditAmount || isNaN(parseFloat(quickEditAmount))) {
      toast.error("Por favor ingresa un monto válido");
      return;
    }

    const amount = parseFloat(quickEditAmount);
    const updatedAccount = {...selectedAccount};
    
    if (operation === 'add') {
      updatedAccount.balance += amount;
      toast.success(`$${amount.toFixed(2)} agregados a ${selectedAccount.name}`);
    } else {
      updatedAccount.balance -= amount;
      toast.success(`$${amount.toFixed(2)} restados de ${selectedAccount.name}`);
    }

    // Here you would call a parent function to update the account
    // This implementation is a placeholder, you'll need to add the actual update logic
    console.log("Update account:", updatedAccount);
    
    // Reset state
    setSelectedAccount(null);
    setQuickEditAmount("");
  };

  return (
    <Card className="mb-6 border border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Balance Total (USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/40 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Total Cuentas</p>
            <p className="text-xl font-medium text-primary">${totalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/40 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-muted-foreground">Total Deudas</p>
            <p className="text-xl font-medium text-destructive">${totalDebt.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">Balance Neto</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
        
        {accounts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <p className="text-sm text-muted-foreground mb-2">Actualización Rápida</p>
            <div className="grid grid-cols-2 gap-2">
              {accounts.map(account => (
                <Sheet key={account.id}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left truncate bg-secondary/30 border-border/50"
                      onClick={() => setSelectedAccount(account)}
                    >
                      {account.name}
                      <span className="ml-auto font-medium">${account.balance.toFixed(2)}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto pb-10">
                    <SheetHeader>
                      <SheetTitle>Actualizar {account.name}</SheetTitle>
                      <SheetDescription>Balance actual: ${account.balance.toFixed(2)}</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        type="number"
                        step="0.01"
                        value={quickEditAmount}
                        onChange={(e) => setQuickEditAmount(e.target.value)}
                        placeholder="Monto"
                        className="text-lg"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => saveQuickEdit('add')} 
                          className="flex gap-2 items-center"
                        >
                          <Plus size={16} />
                          Agregar
                        </Button>
                        <Button 
                          onClick={() => saveQuickEdit('subtract')} 
                          variant="outline"
                          className="flex gap-2 items-center"
                        >
                          <Minus size={16} />
                          Restar
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalBalance;
