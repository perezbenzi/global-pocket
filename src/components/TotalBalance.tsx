import React, { useState } from "react";
import { Account, Debt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import { toast } from "@/lib/toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

interface TotalBalanceProps {
  accounts: Account[];
  debts: Debt[];
  onAccountUpdate?: (updatedAccount: Account) => void;
  onQuickUpdate?: (accountId: string, amount: number, type: 'deposit' | 'withdrawal', description?: string) => void;
}

const TotalBalance = ({ accounts, debts, onAccountUpdate, onQuickUpdate }: TotalBalanceProps) => {
  const { user } = useAuth();
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalBalance - totalDebt;

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [quickEditAmount, setQuickEditAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickEdit = (account: Account) => {
    setSelectedAccount(account);
    setQuickEditAmount("");
  };

  const saveQuickEdit = async (operation: 'add' | 'subtract') => {
    if (!user || !selectedAccount || !quickEditAmount || isNaN(parseFloat(quickEditAmount)) || !onQuickUpdate) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(quickEditAmount);
      
      await onQuickUpdate(
        selectedAccount.id, 
        amount, 
        operation === 'add' ? 'deposit' : 'withdrawal',
        `Quick ${operation === 'add' ? 'deposit' : 'withdrawal'} from dashboard`
      );
      
      setSelectedAccount(null);
      setQuickEditAmount("");
      
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium md:text-xl">Total Balance (USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <div className="bg-secondary/40 p-3 md:p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm md:text-base">Total Accounts</p>
            <p className="text-xl md:text-2xl font-medium text-primary">${totalBalance.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/40 p-3 md:p-4 rounded-lg backdrop-blur-sm">
            <p className="text-sm md:text-base">Total Debts</p>
            <p className="text-xl md:text-2xl font-medium text-foreground">${totalDebt.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-sm md:text-base">Net Balance</p>
          <p className={`text-2xl md:text-3xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-foreground'}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
        
        {accounts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <p className="text-sm md:text-base mb-2">Quick Update</p>
            <div style={styles.container}>
              {accounts.map(account => (
                <Sheet key={account.id}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      style={styles.button}
                      className="justify-start text-left truncate bg-secondary/30 border-border/50"
                      onClick={() => handleQuickEdit(account)}
                    >
                      {account.name}
                      <span className="ml-auto font-medium">${account.balance.toFixed(2)}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto pb-10">
                    <SheetHeader>
                      <SheetTitle>Update {account.name}</SheetTitle>
                      <SheetDescription>Current balance: ${account.balance.toFixed(2)}</SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4 max-w-md mx-auto">
                      <Input
                        type="number"
                        step="0.01"
                        value={quickEditAmount}
                        onChange={(e) => setQuickEditAmount(e.target.value)}
                        placeholder="Amount"
                        className="text-lg"
                        disabled={isSubmitting}
                      />
                      <div className="flex justify-center space-x-6">
                        <Button 
                          onClick={() => saveQuickEdit('add')} 
                          className="inline-flex gap-2 items-center px-6"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          <Plus size={16} />
                          Add
                        </Button>
                        <Button 
                          onClick={() => saveQuickEdit('subtract')} 
                          variant="outline"
                          className="inline-flex gap-2 items-center px-6"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          <Minus size={16} />
                          Subtract
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

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '8px',
    transition: 'all 0.3s ease',
    width: '100%'
  },
  button: {
    width: '100%',
    transition: 'all 0.3s ease',
    minHeight: '44px'
  }
};

export default TotalBalance;
