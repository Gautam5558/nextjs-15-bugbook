"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SearchField = () => {
  const [searchData, setSearchData] = useState("");
  const navigate = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = searchData.trim();
    const encodedQuery = encodeURIComponent(value);
    navigate.push("/search?q=" + encodedQuery);
  };

  // In this form react hook form is an overkill hence i have used
  // a simple form , also i have done progressive enhancement that
  // is if js is disabled in someones browser then also form will
  // show default behaviour and if js is enabled then also it will
  // show default behavior by calling the handleSubmit

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      method="GET"
      action={"/search"}
    >
      <div className="relative">
        <Input
          name="search"
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
          value={searchData}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchField;
