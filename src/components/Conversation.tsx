"use client";
import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { getUnixTime } from "date-fns";
import useMessageStore from "@/store/useMessageStore";
import MessageCard from "@/components/MessageCard";
import ComposeInput from "@/components/ComposeInput";
import classNames from "classnames";
import Link from "next/link";

function TagContainer({ text }: { text: string }) {
  // Split the text by underscore and select the first two items
  const parts = text
    .split("_")
    .slice(0, 2)
    .map((part) => {
      // Capitalize the first letter of each part
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

  return (
    <div className="bg-[#dee22a] text-[#525252] px-4 py-2 rounded-full text-sm ml-2">
      {parts.join(" ")}
    </div>
  );
}

const Conversation: React.FC<{
  className?: string;
  id: string;
}> = ({ className, id }) => {
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const { topics, addMessage, updateTopic, selectedModel, onModelChange } =
    useMessageStore();
  const topic = topics.find((topic) => topic.id === id);
  const messages = useMemo(() => {
    return topic?.messages || [];
  }, [topic?.messages]);
  const endRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classNames("flex flex-1 flex-col", className)}>
      <div className={"shadow w-full p-4"}>
        <div className={"flex flex-col gap-2 justify-start items-start"}>
          <Link
            href="/"
            className={"md:hidden text-[#132e53] underline cursor-pointer"}
          >
            Back
          </Link>
          <div className="flex justify-between w-full">
            <div className={"text-[#132e53] text-lg font-semibold"}>
              {!showEditTitle ? (
                <h3
                  onClick={() => {
                    setTitle(topic?.name || "");
                    setShowEditTitle(true);
                  }}
                >
                  {topic?.name}
                </h3>
              ) : (
                <input
                  autoFocus={true}
                  type="text"
                  className={
                    "text-[#132e53] text-lg font-semibold outline-[#039fb8]"
                  }
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onBlur={() => {
                    updateTopic(id, { name: title });
                    setShowEditTitle(false);
                  }}
                />
              )}
            </div>
            <div className="flex">
              {topic?.tags?.map((item) => {
                return <TagContainer key={`tag-${item}`} text={item} />;
              })}
            </div>
          </div>
          <p className={"text-[#132e53] text-sm"}>
            {topic?.messages.length} messages
          </p>
        </div>
      </div>
      <div className={"flex-1 p-4 overflow-y-auto flex flex-col gap-6"}>
        {messages.map((message) => (
          <MessageCard message={message} key={message.id} />
        ))}
        <div ref={endRef} />
      </div>
      <ComposeInput
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        isSending={topic?.typingRole === "assistant"}
        onSend={(msg, files) => {
          if (!topic) return;
          addMessage(topic.id, {
            id: uuid(),
            content: msg,
            files: files || [],
            createdAt: getUnixTime(new Date()),
            role: "user",
          });
        }}
      />
    </div>
  );
};

export default Conversation;
