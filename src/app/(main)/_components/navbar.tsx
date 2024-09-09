import Link from "next/link";
import React from "react";
import UserButton from "./user-button";
import SearchField from "./search-field";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="max-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          bugbook
        </Link>
        <SearchField />
        <UserButton />
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
