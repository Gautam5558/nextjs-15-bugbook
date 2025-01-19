import { auth } from "@/auth";
import { db } from "@/lib/connectDb";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatar: f({
    image: {
      maxFileSize: "512KB",
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (session && session?.user) {
        return { user: session.user };
      }
      throw new UploadThingError("Unauthorized");
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.user.id);

      const newAvartarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      );

      console.log("file url", newAvartarUrl);

      await db.user.update({
        where: { id: metadata.user.id },
        data: {
          image: newAvartarUrl,
        },
      });

      // sending the url to the client for updating the client side after upload
      return { avatarUrl: newAvartarUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
