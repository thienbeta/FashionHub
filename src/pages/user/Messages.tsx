
import React from "react";
import { MessagesInbox } from "@/components/user/MessagesInbox";

const Messages = () => {
  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Messages</h1>
      <MessagesInbox />
    </div>
  );
};

export default Messages;
