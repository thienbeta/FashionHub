
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageForm } from "./MessageForm";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MessageThreadProps {
  threadId: string;
  user: User;
}

// Mock data for demo purposes
const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'user1',
      content: 'Hey, I was wondering about your latest product...',
      timestamp: '2023-05-15T14:30:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: 'Hi there! Which product are you interested in?',
      timestamp: '2023-05-15T14:35:00Z',
    },
    {
      id: 'm3',
      senderId: 'user1',
      content: 'The new wireless headphones. Do they have noise cancellation?',
      timestamp: '2023-05-15T14:40:00Z',
    },
  ],
  '2': [
    {
      id: 'm1',
      senderId: 'user2',
      content: 'I received my order today, thank you!',
      timestamp: '2023-05-14T10:15:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: "You're welcome! I'm glad everything arrived safely.",
      timestamp: '2023-05-14T10:20:00Z',
    },
    {
      id: 'm3',
      senderId: 'user2',
      content: 'Thanks for your help with my order!',
      timestamp: '2023-05-14T10:25:00Z',
    },
  ],
  '3': [
    {
      id: 'm1',
      senderId: 'user3',
      content: 'When will the new items be in stock?',
      timestamp: '2023-05-12T09:00:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: 'We expect them to arrive next week. I can notify you when they come in.',
      timestamp: '2023-05-12T09:10:00Z',
    },
  ],
};

const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const MessageThread = ({ threadId, user }: MessageThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real app, this would fetch messages from an API
    setMessages(MOCK_MESSAGES[threadId] || []);
  }, [threadId]);
  
  useEffect(() => {
    // Scroll to bottom of messages when they change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewMessage = () => {
    // In a real app, this would update with latest messages from API
    console.log("Message sent. Would refresh thread in real application.");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex items-center p-4 border-b">
        <Avatar className="h-10 w-10 mr-3">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : (
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {user.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name}</h3>
        </div>
      </div>

      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex",
              message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
            )}
          >
            <div 
              className={cn(
                "max-w-[75%] rounded-lg p-3",
                message.senderId === 'currentUser' 
                  ? 'bg-purple-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              )}
            >
              <p className="break-words">{message.content}</p>
              <p 
                className={cn(
                  "text-xs mt-1",
                  message.senderId === 'currentUser' ? 'text-purple-100' : 'text-gray-500'
                )}
              >
                {formatMessageDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <MessageForm 
          recipientId={user.id}
          recipientName={user.name}
          onSuccess={handleNewMessage}
        />
      </div>
    </div>
  );
};
