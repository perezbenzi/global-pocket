import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ClipboardList, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 bg-primary  text-green-200 border-b border-border/30 py-2 px-4">
        <div className="container max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl flex items-center justify-between ">
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="flex gap-2 items-center">
                <Home size={18} /><span>Home</span>
              </Button>
            </Link>
            <Link to="/transactions" className="flex items-center gap-2">
              <Button variant={isActive("/transactions") ? "default" : "ghost"} size="sm" className="flex gap-2 items-center">
                <ClipboardList size={18} /><span>Transactions</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => logout()} className="flex gap-2 items-center">
              <LogOut size={18} /><span>Logout</span>
            </Button>
          </div>
          <button onClick={() => setIsOpen(true)} className="md:hidden ml-auto">
            <Menu size={24} className="text-green-200" />
          </button>
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 z-20 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-64 bg-green-800 text-green-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setIsOpen(false)}><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <Home size={18} /><span>Home</span>
              </Link>
              <Link to="/transactions" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <ClipboardList size={18} /><span>Transactions</span>
              </Link>
              <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center gap-2 text-left bg-transparent border-none p-0">
                <LogOut size={18} /><span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 