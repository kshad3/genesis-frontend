"use client";
import React from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/sidebar"), {
  ssr: false,
});
const Conversation = dynamic(() => import("@/components/Conversation"), {
  ssr: false,
});

const Page: NextPage<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  return (
    <div className={"flex w-full h-screen"}>
      <Sidebar className={"hidden md:flex md:w-[300px] md:relative"} />
      <Conversation id={id} />
    </div>
  );
};

export default Page;
