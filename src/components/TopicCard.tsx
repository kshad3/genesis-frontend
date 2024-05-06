"use client";
import React from "react";
import { Topic } from "@/store/useMessageStore";
import { format, fromUnixTime } from "date-fns";
import classNames from "classnames";
import { DATE_TIME_FORMAT } from "@/constants";
import Link from "next/link";
import { RiDeleteBin4Line } from "react-icons/ri";

const TopicCard: React.FC<{
  topic: Topic;
  isActive?: boolean;
  onDelete?: () => void;
}> = ({ topic, isActive, onDelete }) => {
  return (
    <Link
      href={`/conversation/${topic.id}`}
      key={`topic-${topic.id}`}
      className={classNames(
        "bg-gray-200 shadow rounded p-2 cursor-pointer border-2 flex flex-col gap-2",
        {
          "outline-none border-2 border-[#039fb8]": isActive,
          "border-transparent": !isActive,
        },
      )}
    >
      <p className={"flex justify-between items-center"}>
        <span className={"text-[#132e53] font-semibold"}>{topic.name}</span>
        <button
          type={"button"}
          title={"Delete this conversation"}
          className={"text-[#039fb8]"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <RiDeleteBin4Line />
        </button>
      </p>
      <p className={"flex flex-row justify-between text-xs text-[#132e53]"}>
        <span>{topic.messages ? topic.messages.length : 0} messages</span>
        <span>
          {topic.messages.length
            ? format(
                fromUnixTime(
                  topic.messages[topic.messages.length - 1].createdAt,
                ),
                DATE_TIME_FORMAT,
              )
            : format(fromUnixTime(topic.createdAt), DATE_TIME_FORMAT)}
        </span>
      </p>
    </Link>
  );
};

export default TopicCard;
