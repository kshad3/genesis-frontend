"use client";
import useMessageStore from "@/store/useMessageStore";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
const Conversation = dynamic(() => import("@/components/Conversation"), {
  ssr: false,
});

export default function Home() {
  const { topics } = useMessageStore();
  return (
    <div className={"flex w-full h-screen"}>
      <Sidebar className={"w-full fixed h-screen md:w-[300px] md:relative"} />
      <Conversation id={topics.length ? topics[0].id : "1"} />
    </div>
  );
}
