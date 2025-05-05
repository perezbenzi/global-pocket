import React, {
  useState,
  useEffect,
  ReactElement,
} from 'react';
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
import { Plus } from 'lucide-react';
import { Debt } from '@/types';
import { toast } from '@/lib/toast';

interface AddDebtFormProps {
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
  onUpdateDebt?: (debt: Debt) => void;
  debt?: Debt;
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddDebtForm = ({
  onAddDebt,
  onUpdateDebt,
  debt,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddDebtFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const isEditing = Boolean(debt);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled
    ? controlledOnOpenChange
    : setInternalOpen;

  const defaultTrigger = (
    <Button className="w-full flex gap-2 items-center">
      <Plus size={16} />
      {isEditing ? 'Edit Debt' : 'Add Debt'}
    </Button>
  );

  useEffect(() => {
    if (open && debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
    }
  }, [debt, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !amount) {
      toast.error('Please complete all fields');
      return;
    }

    if (isEditing && debt && onUpdateDebt) {
      onUpdateDebt({
        ...debt,
        name,
        amount: parseFloat(amount),
      });
    } else {
      onAddDebt({
        name,
        amount: parseFloat(amount),
      });
    }

    setName('');
    setAmount('');
    if (onOpenChange) onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) onOpenChange(newOpen);
    if (!newOpen) {
      setName('');
      setAmount('');
    } else if (debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
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
          <Button type="submit" className="w-full mt-2">
            {isEditing ? 'Update' : 'Add'} Debt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDebtForm;
