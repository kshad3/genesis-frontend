import React, { useRef, useState } from "react";
import { BsPaperclip, BsX } from "react-icons/bs";
import { RiRobot3Line } from "react-icons/ri";
import TextareaAutosize from "react-textarea-autosize";
import FileIcon from "@/components/FileIcon";
import { MessageFile } from "@/store/useMessageStore";
import { readFileContent } from "@/utils/file";
import Lottie from "react-lottie";
import * as Animation from "@/assets/animation.json";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { models } from "@/Models";
import classNames from "classnames";

const getModel = (arg:string):string => {
  let i = models.findIndex(item => item.id === arg)
  return models[i].displayName
}

const ComposeInput: React.FC<{
  isSending?: boolean;
  onSend: (message: string, files?: MessageFile[]) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}> = ({ onSend, isSending, selectedModel, onModelChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [isOpenModelPicker, setIsOpenModelPicker] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpenModelPicker,
    onOpenChange: setIsOpenModelPicker,
    placement: "top-start",
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps } = useInteractions([click, dismiss]);

  const handleSend = async () => {
    let messageFiles: MessageFile[] = [];
    if (files.length > 0) {
      for (const file of files) {
        const content = await readFileContent(file);
        messageFiles.push({
          name: file.name,
          content,
          type: file.type,
        });
      }
    }
    onSend(input, messageFiles);
    setInput("");
    setFiles([]);
  };
  return (
    <div className={"p-3 shadow border border-gray-200"}>
      <input
        disabled={isSending}
        className={"hidden"}
        onChange={(e) => {
          setFiles(Array.from(e.target.files || []));
          if (fileRef.current) {
            fileRef.current.value = "";
          }
        }}
        type={"file"}
        accept={".pdf,.doc,.docx,.txt"}
        ref={fileRef}
      />
      <div className={"pb-3"}>
        {isOpenModelPicker && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={"rounded py-2"}
          >
            <div className={"rounded bg-gray-100"}>
              {models.map((model, index) => (
                <button
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpenModelPicker(false);
                  }}
                  key={model.id}
                  className={classNames(
                    "flex gap-4 items-center justify-between w-full p-2 hover:opacity-60",
                    {
                      "border-b border-gray-300": index !== models.length - 1,
                      "rounded-t-[10px]": index === 0,
                      "rounded-b-[10px]": index === models.length - 1,
                    },
                  )}
                >
                  <span className={"text-[#132e53] font-semibold text-sm"}>
                    {model.displayName}
                  </span>
                  <span
                    className={classNames("w-2 h-2 bg-[#039fb8] rounded-full", {
                      "opacity-100": selectedModel === model.id,
                      "opacity-0": selectedModel !== model.id,
                    })}
                  />
                </button>
              ))}
              
            </div>
          </div>
          
        )}
        <div className="flex">
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            type={"button"}
            className={
              "p-1 rounded-[10px] hover:bg-gray-200 text-[#132e53] bg-gray-100"
            }
          >
            <RiRobot3Line size={20} />
          </button>
          <div className="text-sm font-medium text-[#1a243b] ml-4 mt-1">{getModel(selectedModel)}</div>
        </div>
      </div>
      <div
        className={"shadow p-3 border-t  flex flex-col gap-2 rounded-[10px]"}
      >
        {files.length > 0 && (
          <div className={"flex flex-row gap-2 flex-wrap p-2"}>
            {files.map((file, index) => (
              <div
                key={index}
                className={"flex items-center gap-2 border rounded p-2"}
              >
                <div className={"bg-[#dee22a] text-white p-2 rounded"}>
                  <FileIcon type={file.type} />
                </div>
                <span className={"text-sm"}>{file.name}</span>
                <button
                  type={"button"}
                  className={"text-red-500"}
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <BsX size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className={"flex flex-1 items-end justify-end"}>
          <div className={"flex flex-1 items-center gap-2"}>
            <button
              disabled={isSending}
              onClick={() => {
                fileRef.current?.click();
              }}
              className={
                "p-2 rounded-full hover:bg-gray-200 mr-2 text-[#132e53] disabled:opacity-50"
              }
            >
              <BsPaperclip size={24} />
            </button>
            <TextareaAutosize
              placeholder={"Type a message"}
              className={"flex-1 resize-none p-2 outline-0 text-[#132e53]"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // check keyboard if command + enter is pressed
              onKeyDown={async (e) => {
                if (e.key === "Enter" && e.metaKey) {
                  await handleSend();
                }
              }}
            />
          </div>
          {isSending ? (
            <div className={"w-10 h-10"}>
              <Lottie
                options={{
                  animationData: Animation,
                  loop: true,
                  autoplay: true,
                }}
                style={{ width: 40, height: 40 }}
              />
            </div>
          ) : (
            <button
              disabled={(!input && files.length === 0) || isSending}
              onClick={handleSend}
              className={
                "rounded-full bg-[#039fb8] px-4 py-2 text-white font-semibold hover:opacity-90 disabled:opacity-50"
              }
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComposeInput;
