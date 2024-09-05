import React from "react";
import { BsExclamationTriangle } from "react-icons/bs";

const FormError = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center gap-x-2 rounded-[8px] bg-destructive/15 p-3 text-sm text-destructive">
      <BsExclamationTriangle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
