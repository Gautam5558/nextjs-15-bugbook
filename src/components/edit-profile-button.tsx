"use client";
import { UserData } from "@/lib/types";
import React, { useState } from "react";
import { Button } from "./ui/button";
import EditProfileDialog from "./edit-profile-dialog";

interface EditProfileButtonProps {
  user: UserData;
}

const EditProfileButton = ({ user }: EditProfileButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        Edit Profile
      </Button>
      <EditProfileDialog
        open={isDialogOpen}
        user={user}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
};

export default EditProfileButton;
