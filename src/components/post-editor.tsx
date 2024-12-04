"use client";
import "../styles/editor.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import PlaceHolder from "@tiptap/extension-placeholder";
import UserAvatar from "@/app/(main)/_components/user-avatar";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useCreatePostMutation } from "@/mutations/createPost.mutation";

const PostEditor = () => {
  const session = useSession();
  const mutation = useCreatePostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      PlaceHolder.configure({
        placeholder: "What's hackin",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const hanldeSubmit = async () => {
    mutation.mutate(
      { content: input },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
        },
      },
    );
  };

  return (
    <div className="shaow-sm flex flex-col gap-5 rounded-2xl bg-card p-5">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={session.data?.user?.image}
          className="hidden sm:inline"
        />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-secondary px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="min-w-20"
          onClick={hanldeSubmit}
          disabled={!input.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
