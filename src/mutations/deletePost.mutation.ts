import { deletePost } from "@/actions/deletePost.action";
import { useToast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export const useDeletePostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const path = usePathname();
  const navigate = useRouter();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        //@ts-ignore
        (oldData) => {
          if (!oldData) {
            return;
          }
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => {
              return {
                nextCursor: page.nextCursor,
                posts: page.posts.filter((post) => {
                  return post.id !== deletedPost.id;
                }),
              };
            }),
          };
        },
      );
      toast({ description: "Post deleted" });

      if (path === "/posts/" + deletedPost.id) {
        navigate.push("/");
      }
    },
    onError: (error) => {
      console.log(error);
      toast({ variant: "destructive", description: "something went wrong" });
    },
  });
  return mutation;
};
