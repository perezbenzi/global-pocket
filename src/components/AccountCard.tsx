import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Account } from '@/types';
import { Edit, Trash2, PiggyBank } from 'lucide-react';
import AddAccountForm from './AddAccountForm';

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onUpdate: (account: Account) => void;
  onDelete: (id: string) => void;
}

const AccountCard = ({
  account,
  onEdit,
  onUpdate,
  onDelete,
}: AccountCardProps) => {
  return (
    <Card className="mb-3 overflow-hidden border border-border/30 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-md">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium">
            {account.name}
          </h3>
        </div>
        <div className="flex gap-1">
          <AddAccountForm
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            }
            onAddAccount={() => {}}
            onUpdateAccount={onUpdate}
            account={account}
          />

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 text-destructive"
            onClick={() => onDelete(account.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mt-1 bg-secondary/40 p-3 rounded-md">
          <p className="text-xl font-semibold text-right text-primary">
            ${account.balance.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
