import { updateProfile } from "@/actions/updateProfile.action";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateProfileSchema } from "@/schemas/index";
import z from "zod";
import { PostsPage } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useRouter();
  const mutation = useMutation({
    mutationFn: ({
      values,
      avatar,
    }: {
      values: z.infer<typeof updateProfileSchema>;
      avatar?: File;
    }) => {
      return Promise.all([
        updateProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      // we will now update the client side cache of user data after db data updation

      const newAvatarUrl = uploadResult && uploadResult[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        // @ts-ignore
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              return {
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  if (post.user.id === updatedUser.id) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        image: newAvatarUrl || updatedUser.image,
                      },
                    };
                  } else {
                    return post;
                  }
                }),
              };
            }),
          };
        },
      );
      navigate.refresh();
      toast({ description: "Profile Updated" });
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went Wrong, Try again",
      });
    },
  });

  return mutation;
};
