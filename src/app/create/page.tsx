"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { tags } from "@/Tags";
import classNames from "classnames";
import Link from "next/link";
import useMessageStore, { Topic } from "@/store/useMessageStore";
import { v4 as uuid } from "uuid";
import { getUnixTime } from "date-fns";
import { useRouter } from "next/navigation";

const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });

const Create = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { addTopic } = useMessageStore();
  const router = useRouter();
  const addNewTopic = () => {
    const topic: Topic = {
      id: uuid(),
      name: "New Conversation",
      createdAt: getUnixTime(new Date()),
      tags: selectedTags,
      messages: [
        {
          id: uuid(),
          role: "assistant",
          content: "Hello! How can I help you today?",
          createdAt: getUnixTime(new Date()),
        },
      ],
    };
    addTopic(topic);
    router.push(`/conversation/${topic.id}`);
  };
  return (
    <div className={"flex w-full h-screen"}>
      <Sidebar className={"hidden md:flex md:w-[300px] md:relative"} />
      <div className={"flex flex-col flex-1 p-4 gap-2"}>
        <div className={"flex-1"}>
          <h2 className={"text-[#132e53] text-3xl font-semibold"}>Pick Tags</h2>
          <div className={"flex-wrap mt-4 mb-4 flex gap-4"}>
            {tags.map((tag) => (
              <button
                onClick={() => {
                  if (selectedTags.includes(tag.id)) {
                    setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                  } else {
                    setSelectedTags([...selectedTags, tag.id]);
                  }
                }}
                key={tag.id}
                className={classNames(
                  "px-4 py-2 text-[#525252] text-sm hover:opacity-90 rounded-full",
                  {
                    "bg-[#dee22a]": selectedTags.includes(tag.id),
                    "bg-gray-400": !selectedTags.includes(tag.id),
                  },
                )}
              >
                <p>{tag.displayName}</p>
              </button>
            ))}
          </div>
        </div>
        <div className={"flex justify-between p-2 gap-4"}>
          <Link
            href="/"
            className={
              "md:hidden cursor-pointer bg-gray-500 text-white p-2 rounded-md text-center"
            }
          >
            Back
          </Link>
          <button
            onClick={addNewTopic}
            className={
              "flex-1 md:flex-auto bg-[#039fb8] text-white rounded p-2 cursor-pointer"
            }
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
