import React from "react";
import Navbar from "./_components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto max-w-7xl p-5">{children}</div>
    </div>
  );
};

export default Layout;
