
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account, Debt } from "@/types";
import { Edit, Trash, Wallet } from "lucide-react";

interface DebtCardProps {
  debt: Debt;
  accounts: Account[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const DebtCard = ({ debt, accounts, onEdit, onDelete }: DebtCardProps) => {
  const accountName = accounts.find(a => a.id === debt.accountId)?.name || "Cuenta desconocida";

  return (
    <Card className="mb-3 bg-muted/50">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-destructive" />
          <CardTitle className="text-lg">{debt.name}</CardTitle>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(debt)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive" 
            onClick={() => onDelete(debt.id)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Asociada a: {accountName}</p>
        <p className="text-xl font-semibold text-right text-destructive">-${debt.amount.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
