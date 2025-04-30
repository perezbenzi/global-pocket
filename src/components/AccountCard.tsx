
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Account } from "@/types";
import { Edit, Trash, PiggyBank } from "lucide-react";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AccountCard = ({ account, onEdit, onDelete }: AccountCardProps) => {
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{account.name}</CardTitle>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => onEdit(account)}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive" 
            onClick={() => onDelete(account.id)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-right">${account.balance.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
