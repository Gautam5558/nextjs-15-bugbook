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
import Image, { StaticImageData } from "next/image";
import { Camera } from "lucide-react";
import { Label } from "./ui/label";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "./crop-image-dialog";
import Resizer from "react-image-file-resizer";

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

  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

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
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            src={
              croppedImage
                ? URL.createObjectURL(croppedImage)
                : user.image || avatarPlaceholder
            }
            onImageCropped={setCroppedImage}
          />
        </div>
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (val: Blob | null) => void;
}

const AvatarInput = ({ src, onImageCropped }: AvatarInputProps) => {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const onImageSelected = (image: File | undefined) => {
    if (!image) {
      return;
    }

    // i have selected an image, now i will open a dialog inside which i will have a cropper to crop the image
    // Then after cropping, i will resize the image , then upload it and get back its url.
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  return (
    <div className="flex justify-center">
      <label
        htmlFor="avatarImageInput"
        className="group relative cursor-pointer"
      >
        <Image
          src={src}
          alt="avatarInput"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 left-[50%] top-[50%] flex size-12 translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-full bg-black bg-opacity-35 text-white transition-colors duration-200 group-hover:bg-opacity-25">
          <Camera size={24} />
        </span>
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          onImageSelected(e.target.files?.[0]);
        }}
        id="avatarImageInput"
        className="sr-only hidden"
      />
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
          }}
        />
      )}
    </div>
  );
};
