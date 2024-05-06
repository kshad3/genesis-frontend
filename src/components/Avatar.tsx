import React from "react";
import Image from "next/image";
const Avatar: React.FC<{
  role: "assistant" | "user";
}> = ({ role }) => {
  if (role === "assistant") {
    return (
      <div
        className={
          "flex w-10 h-10 rounded-full items-center justify-center bg-[#039fb8]"
        }
      >
        <Image src={"/logo-nh.png"} alt={"NH"} width={20} height={20} />
      </div>
    );
  }
  return (
    <div
      className={
        "flex w-10 h-10 rounded-full bg-[#dee22a] items-center justify-center font-bold"
      }
    >
      U
    </div>
  );
};

export default Avatar;
