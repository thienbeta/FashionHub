import React, { useState, useEffect, useRef } from "react";
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

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'user1',
      content: 'Chào, tôi muốn hỏi về sản phẩm mới nhất của bạn...',
      timestamp: '2023-05-15T14:30:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: 'Xin chào! Bạn quan tâm đến sản phẩm nào?',
      timestamp: '2023-05-15T14:35:00Z',
    },
    {
      id: 'm3',
      senderId: 'user1',
      content: 'Tai nghe không dây mới. Chúng có tính năng khử tiếng ồn không?',
      timestamp: '2023-05-15T14:40:00Z',
    },
  ],
  '2': [
    {
      id: 'm1',
      senderId: 'user2',
      content: 'Tôi đã nhận được đơn hàng hôm nay, cảm ơn bạn!',
      timestamp: '2023-05-14T10:15:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: "Không có gì! Tôi rất vui khi mọi thứ đến nơi an toàn.",
      timestamp: '2023-05-14T10:20:00Z',
    },
    {
      id: 'm3',
      senderId: 'user2',
      content: 'Cảm ơn bạn đã giúp tôi với đơn hàng!',
      timestamp: '2023-05-14T10:25:00Z',
    },
  ],
  '3': [
    {
      id: 'm1',
      senderId: 'user3',
      content: 'Khi nào các mặt hàng mới sẽ có hàng?',
      timestamp: '2023-05-12T09:00:00Z',
    },
    {
      id: 'm2',
      senderId: 'currentUser',
      content: 'Chúng tôi dự kiến sẽ có hàng vào tuần tới. Tôi có thể thông báo cho bạn khi chúng đến.',
      timestamp: '2023-05-12T09:10:00Z',
    },
  ],
};

const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MessageThread = ({ threadId, user }: MessageThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMessages(MOCK_MESSAGES[threadId] || []);
  }, [threadId]);
  
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewMessage = () => {
    console.log("Tin nhắn đã được gửi. Sẽ làm mới luồng trong ứng dụng thực tế.");
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px]">
      <div className="flex items-center p-4 border-b">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 mr-3">
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