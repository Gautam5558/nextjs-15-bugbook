"use client";
import { UserData } from "@/lib/types";
import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";

interface EditProfileDialogProps {
  open: boolean;
  user: UserData;
  setIsDialogOpen: (val: boolean) => void;
}

const EditProfileDialog = ({
  open,
  user,
  setIsDialogOpen,
}: EditProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setIsDialogOpen}>
      <DialogContent>hnji kidda</DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
