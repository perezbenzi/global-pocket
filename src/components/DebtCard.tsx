import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Debt } from '@/types';
import { Trash2, Wallet } from 'lucide-react';
import EditDebtForm from './EditDebtForm';

interface DebtCardProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

const DebtCard = ({
  debt,
  onEdit,
  onDelete,
}: DebtCardProps) => {
  return (
    <Card className="mb-3 overflow-hidden border border-destructive/30 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-destructive/20 p-1.5 rounded-md">
            <Wallet className="h-5 w-5 text-destructive" />
          </div>
          <h3 className="text-lg font-medium">
            {debt.name}
          </h3>
        </div>
        <div className="flex gap-1">
          <EditDebtForm debt={debt} onEdit={onEdit} />
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
        <div className="mt-1 bg-secondary/40 p-3 rounded-md">
          <p className="text-xl font-semibold text-right text-destructive">
            -${debt.amount.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebtCard;
