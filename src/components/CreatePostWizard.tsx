import { useUser } from "@clerk/nextjs";
import {useCallback, useState} from "react";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import toast from "react-hot-toast";
import Picker from '@emoji-mart/react'
import {HiEmojiHappy} from "react-icons/hi";
import { api } from "~/utils/api";
import Image from "next/image";
import data from '@emoji-mart/data'


type EmojiData = {
  id: string;
  native: string;
  colons: string;
}
export const CreatePostWizard = () => {
  const { user, isSignedIn } = useUser();

  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const ctx = api.useContext();

  const { mutate, isLoading } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      toast.success("Posted!");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const errorMessages = err.data?.zodError?.fieldErrors.content;
      if (!!errorMessages && !!errorMessages[0]) {
        toast.error(errorMessages[0]);
      } else {
        toast.error("Unknown error occurred");
      }
    }
  });

  const handleEmojiSelect = useCallback((e: EmojiData) => {
    setInput(input + e.native);
    setShowEmojiPicker(false);
  }, [input]);

  if (!isSignedIn || !user) return (<>You must sign in to tweet!</>);

  return (
    <div className={"flex items-center gap-4 w-full"}>
      <Image
        className={"rounded-full"}
        src={user.profileImageUrl}
        width={72} height={72}
        alt={user.fullName ?? "Profile Picture"}
      />
      <div className={"w-full flex flex-col relative gap-2"}>
        <div className={"flex items-center rounded bg-gray-800"}>
          <input
            max={280}
            className={"bg-transparent p-2 outline-none w-full h-full"}
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
          <HiEmojiHappy
            className={"text-xl cursor-pointer mr-2"}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>
        <span className={'text-gray-600 text-xs'}>{280 - input.length} characters left</span>
        {showEmojiPicker && (
          <div className={"absolute top-[4.5rem] h-96 left mb-4"}>
            <Picker data={data} onEmojiSelect={(e: EmojiData) => handleEmojiSelect(e)} />
          </div>
        )}
      </div>
      {isLoading ? <LoadingSpinner width={"AUTO"} height={"AUTO"} size={32} /> : (<button className={`border px-6 py-2 rounded-md ${!!input ? "visible" : "invisible"}`} onClick={() => mutate({
        content: input
      })}>Post</button>)}
    </div>
  );
};