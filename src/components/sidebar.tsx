"use client";
import React from "react";
import useMessageStore from "@/store/useMessageStore";
import TopicCard from "@/components/TopicCard";
import Image from "next/image";
import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";

const Sidebar: React.FC<{
  className?: string;
}> = ({ className }) => {
  const { addTopic, topics, deleteTopic } = useMessageStore();
  const router = useRouter();
  const params = useParams();
  const handleDeleteTopic = (id: string) => {
    deleteTopic(id);
    router.push("/");
  };
  //26	36	59 #1a243b
  return (
    <div
      className={classNames(
        "flex flex-col p-5 shadow bg-[#1a243b] gap-4",
        className,
      )}
    >
      <div className={"flex justify-between items-center gap-2"}>
        <div className={"flex flex-col gap-1"}>
          <h1 className={"text-white text-[22px]"}>NORTH HIGHLAND</h1>
          <p className={"text-white text-[12px] text-right"}>
            Make <span className={"text-[#039fb8]"}>Change</span> Happen
            <sup>®</sup>
          </p>
        </div>
        <Image src={"/logo_sm.png"} alt={"NH"} width={38} height={66} />
      </div>
      <div className={"flex flex-col flex-1 overflow-y-auto gap-2"}>
        {topics.map((topic) => (
          <TopicCard
            onDelete={() => handleDeleteTopic(topic.id)}
            isActive={params.id === topic.id}
            key={topic.id}
            topic={topic}
          />
        ))}
      </div>
      <div>
        <button
          className={
            "bg-[#039fb8] text-white rounded p-2 w-full cursor-pointer"
          }
          onClick={() => router.push("/create")}
        >
          New Conversation
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
