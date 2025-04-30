
import React from "react";

const Header = () => {
  return (
    <header className="bg-primary/10 backdrop-blur-lg border-b border-border/50 px-4 py-3.5 sticky top-0 z-10">
      <div className="container max-w-md mx-auto">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Bolsillo Global
        </h1>
      </div>
    </header>
  );
};

export default Header;
