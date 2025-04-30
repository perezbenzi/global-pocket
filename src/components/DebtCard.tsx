import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account, Debt } from "@/types";
import { Edit, Trash2, Wallet } from "lucide-react";

interface DebtCardProps {
  debt: Debt;
  accounts: Account[];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const DebtCard = ({ debt, accounts, onEdit, onDelete }: DebtCardProps) => {
  const accountName = accounts.find(a => a.id === debt.accountId)?.name || "Unknown account";

  return (
    <Card className="mb-3 overflow-hidden border border-destructive/30 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-destructive/20 p-1.5 rounded-md">
            <Wallet className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="text-lg font-medium">{debt.name}</h3>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-primary/20" 
            onClick={() => onEdit(debt)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive" 
            onClick={() => onDelete(debt.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-1">Associated with: {accountName}</p>
        <div className="mt-1 bg-secondary/40 p-3 rounded-md">
          <p className="text-xl font-semibold text-right text-destructive">-${debt.amount.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
