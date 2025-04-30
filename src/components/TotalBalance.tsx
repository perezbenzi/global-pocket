
import React from "react";
import { Account, Debt } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TotalBalanceProps {
  accounts: Account[];
  debts: Debt[];
}

const TotalBalance = ({ accounts, debts }: TotalBalanceProps) => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const netBalance = totalBalance - totalDebt;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Balance Total (USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Cuentas</p>
            <p className="text-xl font-medium">${totalBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Deudas</p>
            <p className="text-xl font-medium text-destructive">${totalDebt.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">Balance Neto</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
            ${netBalance.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalBalance;
