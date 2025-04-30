import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-primary shadow-md px-6 py-4 sticky top-0 z-10">
      <div className="container max-w-md mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-foreground">
          Global Pocket
        </h1>
        {user && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
