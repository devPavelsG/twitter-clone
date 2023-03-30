import {useUser} from "@clerk/nextjs";
import Image from "next/image";

export const CreatePostWizard = () => {
  const {user, isSignedIn} = useUser();

  if (!isSignedIn || !user) return (<>You must sign in to tweet!</>);

  return (
    <div className={"flex gap-4 w-full"}>
      <Image className={"rounded-full"} src={user.profileImageUrl} width={72} height={72} alt={user.fullName ?? "Profile Picture"} />
      <input className={"bg-transparent outline-none grow"} placeholder={"What's happening?"}/>
    </div>
  );
};