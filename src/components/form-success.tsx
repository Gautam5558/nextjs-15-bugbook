import React from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const FormSuccess = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <IoCheckmarkDoneCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
