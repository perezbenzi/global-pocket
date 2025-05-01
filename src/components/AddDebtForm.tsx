import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Account, Debt } from '@/types';
import { toast } from '@/lib/toast';

interface AddDebtFormProps {
  accounts: Account[];
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
  onUpdateDebt?: (debt: Debt) => void;
  debt?: Debt;
}

const AddDebtForm = ({
  accounts,
  onAddDebt,
  onUpdateDebt,
  debt,
}: AddDebtFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const isEditing = Boolean(debt);

  const hasAccounts = accounts && accounts.length > 0;

  useEffect(() => {
    if (debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
      setAccountId(debt.accountId);
    }
  }, [debt]);

  useEffect(() => {
    if (
      hasAccounts &&
      !isEditing &&
      !accountId &&
      accounts.length > 0 &&
      open
    ) {
      setAccountId(accounts[0].id);
    }
  }, [hasAccounts, isEditing, accountId, accounts, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted', {
      name,
      amount,
      accountId,
    });

    if (!name || !amount || !accountId) {
      console.log('Validation failed', {
        name,
        amount,
        accountId,
      });
      toast.error('Please complete all fields');
      return;
    }

    if (isEditing && debt && onUpdateDebt) {
      onUpdateDebt({
        ...debt,
        name,
        amount: parseFloat(amount),
        accountId,
      });
    } else {
      onAddDebt({
        name,
        amount: parseFloat(amount),
        accountId,
      });
    }

    setName('');
    setAmount('');
    setAccountId('');
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!hasAccounts && newOpen) {
      toast.error('You need to add an account first');
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex gap-2 items-center bg-primary/10 hover:bg-primary/20 text-foreground border-primary/30 shadow-sm"
          onClick={() => {
            if (!hasAccounts) {
              toast.error(
                'You need to add an account first'
              );
            }
          }}
          disabled={!hasAccounts}
        >
          <Plus size={16} className="text-primary" />
          {isEditing ? 'Edit Debt' : 'Add Debt'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Debt' : 'Add New Debt'}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Debt Description</Label>
            <Input
              id="name"
              placeholder="Friend's loan, etc."
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account">
              Associated Account
            </Label>
            <Select
              value={accountId}
              onValueChange={setAccountId}
              required
              defaultValue={
                hasAccounts && accounts.length > 0
                  ? accounts[0].id
                  : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length > 0 ? (
                  accounts.map(account => (
                    <SelectItem
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Add an account first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full mt-2">
            {isEditing ? 'Update' : 'Add'} Debt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDebtForm;
