"use client";
import { UserData } from "@/lib/types";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useUpdateProfileMutation } from "@/mutations/updateProfile.mutation";

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
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      displayName: user.displayName || "",
      bio: user.bio || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const mutation = useUpdateProfileMutation();

  function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    setIsLoading(true);
    mutation.mutate(
      { values },
      {
        onSuccess: () => {
          setIsLoading(false);
          setIsDialogOpen(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      },
    );
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      className="resize-none"
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
