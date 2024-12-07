import { submitPost } from "@/actions/submitPost.action";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// This entire code could be written in the PostEditor component but i wanted
// to separate a piece of logic from the component because its makes the component
// more complex. So i wrote a custom hook instead.

export const useCreatePostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed", "for-you"] };

      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        //@ts-ignore
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData?.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData?.pages.slice(1),
              ],
            };
          }
        },
      );
    },

    onError(error) {
      console.log(error);
      toast({ variant: "destructive", description: "New Post Created!" });
    },
  });
  return mutation;
};
