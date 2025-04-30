
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Account, Debt } from "@/types";

interface AddDebtFormProps {
  accounts: Account[];
  onAddDebt: (debt: Omit<Debt, "id">) => void;
  onUpdateDebt?: (debt: Debt) => void;
  debt?: Debt;
}

const AddDebtForm = ({ accounts, onAddDebt, onUpdateDebt, debt }: AddDebtFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const isEditing = Boolean(debt);

  useEffect(() => {
    if (debt) {
      setName(debt.name);
      setAmount(debt.amount.toString());
      setAccountId(debt.accountId);
    }
  }, [debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || !accountId) return;
    
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
    
    // Reset form
    setName("");
    setAmount("");
    setAccountId("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-2 items-center">
          <Plus size={16} />
          {isEditing ? "Editar Deuda" : "Agregar Deuda"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Deuda" : "Agregar Nueva Deuda"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Descripción de la Deuda</Label>
            <Input
              id="name"
              placeholder="Préstamo de amigo, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Monto (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account">Cuenta Asociada</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.length > 0 ? (
                  accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Primero agrega una cuenta
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full mt-2" 
            disabled={accounts.length === 0}
          >
            {isEditing ? "Actualizar" : "Agregar"} Deuda
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDebtForm;
