
import React from "react";
import { MessagesInbox } from "@/components/user/MessagesInbox";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
      </div>
      
      <Card className="border-purple-100 shadow-sm overflow-hidden">
        <MessagesInbox />
      </Card>
    </div>
  );
};

export default Messages;
