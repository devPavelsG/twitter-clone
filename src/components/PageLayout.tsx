import {type PropsWithChildren} from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex min-h-screen justify-center">
      <div className={"border-slate-600 w-full md:max-w-2xl border-x"}>
        {props.children}
      </div>
    </main>
  );
};