"use client";
import React from "react";
import { Message } from "@/store/useMessageStore";
import Avatar from "@/components/Avatar";
import { fromUnixTime, format } from "date-fns";
import { DATE_TIME_FORMAT } from "@/constants";
import classNames from "classnames";
import FileIcon from "@/components/FileIcon";
import { marked } from 'marked';

const MessageCard: React.FC<{
  message: Message;
}> = ({ message }) => {
  return (
    <div
      className={classNames("flex flex-col gap-2", {
        "items-start": message.role === "assistant",
        "items-end": message.role === "user",
      })}
    >
      <Avatar role={message.role} />
      <div
        className={classNames("flex flex-col", {
          "items-start": message.role === "assistant",
          "items-end": message.role === "user",
        })}
      >
        <div
          className={"text-[#132e53] text-lg"}
          dangerouslySetInnerHTML={{ __html: marked(message?.content || '') }}
        ></div>
        {message.files && message.files.length > 0 && (
          <div className={"flex flex-row gap-2 flex-wrap py-2"}>
            {message.files?.map((file, index) => (
              <div
                key={index}
                className={
                  "flex items-center gap-2 border rounded p-2 text-[#132e53]"
                }
              >
                <div className={"bg-[#dee22a] text-white p-2 rounded"}>
                  <FileIcon type={file.type} />
                </div>
                {file.name}
              </div>
            ))}
          </div>
        )}
        <p className={"text-[12px]"}>
          {format(fromUnixTime(message.createdAt), DATE_TIME_FORMAT)}
        </p>
        {message.source_documents && message.source_documents.length > 0 && (
          <>
            <h4 className="font-bold mt-4">Citations:</h4>
            <div className={"flex flex-row gap-2 flex-wrap py-2"}>
            {message.source_documents?.map((file, index) => (
                <div
                  key={index}
                  className={
                    "flex-row items-center gap-2 border rounded p-2 text-[#132e53]"
                  }
                >
                  <div className={"bg-white text-[#1a243b] italic text-sm p-2 rounded mb-2"}>
                    <span>{file.file_name}</span>
                  </div>
                  <div className="px-4">{file.content}</div>
                  
                </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
