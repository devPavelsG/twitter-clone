import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";

export const CreatePostWizard = () => {
  const { user, isSignedIn } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      toast.success("Posted!");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessages = err.data.zodError?.fieldErrors.content;
      if (!!errorMessages && !!errorMessages[0]) {
        toast.error(errorMessages[0]);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  });

  if (!isSignedIn || !user) return (<>You must sign in to tweet!</>);

  return (
    <div className={"flex items-center gap-4 w-full"}>
      <Image
        className={"rounded-full"}
        src={user.profileImageUrl}
        width={72} height={72}
        alt={user.fullName ?? "Profile Picture"}
      />
      <div className={"w-full flex flex-col"}>
        <input
          max={280}
          className={"bg-transparent outline-none w-full h-full"}
          placeholder={"What's happening?"}
          value={input}
          onChange={(e) => e.target.value.length <= 280 && setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!!input) {
                mutate({
                  content: input
                });
              }
            }
          }}
          type={"text"}
        />
        <span className={'text-gray-600 text-xs'}>{280 - input.length} characters left</span>
      </div>
      {isLoading ? <LoadingSpinner width={"AUTO"} height={"AUTO"} size={32} /> : (!!input && <button className={"border px-6 py-2 rounded-md"} onClick={() => mutate({
        content: input
      })}>Post</button>)}
    </div>
  );
};