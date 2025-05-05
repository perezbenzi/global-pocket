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
import { Edit } from 'lucide-react';
import { Debt } from '@/types';

interface EditDebtFormProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
}

const EditDebtForm = ({
  debt,
  onEdit,
}: EditDebtFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(debt.name);
  const [amount, setAmount] = useState(
    debt.amount.toString()
  );

  useEffect(() => {
    if (!open) {
      setName(debt.name);
      setAmount(debt.amount.toString());
    }
  }, [open, debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onEdit({
      ...debt,
      name,
      amount: parseFloat(amount),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Debt</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Description</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Update Debt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDebtForm;
