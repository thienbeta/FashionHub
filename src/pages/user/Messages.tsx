import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/pages/ui/card";
import { Button } from "@/pages/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import { MessageSquare, Search, Send, Image, FileText, Smile, Heart } from "lucide-react";
import { Input } from "@/pages/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/pages/ui/form";
import { Textarea } from "@/pages/ui/textarea";
import { useToast } from "@/pages/ui/use-toast";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const MOCK_THREADS = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Alex Nguyễn",
      avatar: null,
    },
    lastMessage: {
      content: "Chào, tôi muốn hỏi về sản phẩm mới nhất của bạn...",
      timestamp: "2 giờ trước",
      isRead: false,
    },
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "Sarah Minh",
      avatar: null,
    },
    lastMessage: {
      content: "Cảm ơn bạn đã giúp tôi với đơn hàng!",
      timestamp: "1 ngày trước",
      isRead: true,
    },
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "David Hùng",
      avatar: null,
    },
    lastMessage: {
      content: "Khi nào các mặt hàng mới sẽ có hàng?",
      timestamp: "3 ngày trước",
      isRead: true,
    },
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: 'user1', content: 'Chào, tôi muốn hỏi về sản phẩm mới nhất của bạn...', timestamp: '2023-05-15T14:30:00Z' },
    { id: 'm2', senderId: 'currentUser', content: 'Xin chào! Bạn quan tâm đến sản phẩm nào?', timestamp: '2023-05-15T14:35:00Z' },
    { id: 'm3', senderId: 'user1', content: 'Tai nghe không dây mới. Chúng có tính năng khử tiếng ồn không?', timestamp: '2023-05-15T14:40:00Z' },
  ],
  '2': [
    { id: 'm1', senderId: 'user2', content: 'Tôi đã nhận được đơn hàng hôm nay, cảm ơn bạn!', timestamp: '2023-05-14T10:15:00Z' },
    { id: 'm2', senderId: 'currentUser', content: "Không có gì! Tôi rất vui khi mọi thứ đến nơi an toàn.", timestamp: '2023-05-14T10:20:00Z' },
    { id: 'm3', senderId: 'user2', content: 'Cảm ơn bạn đã giúp tôi với đơn hàng!', timestamp: '2023-05-14T10:25:00Z' },
  ],
  '3': [
    { id: 'm1', senderId: 'user3', content: 'Khi nào các mặt hàng mới sẽ có hàng?', timestamp: '2023-05-12T09:00:00Z' },
    { id: 'm2', senderId: 'currentUser', content: 'Chúng tôi dự kiến sẽ có hàng vào tuần tới. Tôi có thể thông báo cho bạn khi chúng đến.', timestamp: '2023-05-12T09:10:00Z' },
  ],
};

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

const schema = z.object({
  message: z.string().max(1000, { message: "Tin nhắn không được vượt quá 1000 ký tự" }),
});

type FormValues = z.infer<typeof schema>;

const MessageForm = ({
  recipientId,
  recipientName,
  onSuccess,
}: {
  recipientId: string;
  recipientName: string;
  onSuccess?: () => void;
}) => {
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { message: "" },
  });

  const messageValue = form.watch("message");

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      toast({
        title: "Đã gửi",
        description: `Tin nhắn đã gửi đến ${recipientName}`,
      });
      form.reset();
      setCharCount(0);
      onSuccess?.();
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không gửi được tin nhắn. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Nhập tin nhắn..."
                    className="min-h-[120px] resize-none pr-16 border-purple-100 focus-visible:ring-purple-500"
                    {...field}
                    onChange={(e) => {
                      setCharCount(e.target.value.length);
                      field.onChange(e);
                    }}
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-gray-500 hover:text-purple-600">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="ghost"
                      size="icon"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      {messageValue.trim().length > 0 ? <Send className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const filteredThreads = MOCK_THREADS.filter(
    (thread) =>
      thread.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleThreadClick = (threadId: string) => {
    setSelectedThread(threadId);
    setMessages(MOCK_MESSAGES[threadId] || []);
  };

  const handleBackToInbox = () => {
    setSelectedThread(null);
    setMessages([]);
  };

  const selectedUser = MOCK_THREADS.find((t) => t.id === selectedThread)?.user;

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="max-w-full md:max-w-auto mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center text-2xl font-bold text-purple-900">
          <MessageSquare className="mr-2 h-6 w-6 text-purple-600" />
          Hộp Thư
        </CardTitle>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Tìm kiếm tin nhắn..." 
            className="pl-10 border-purple-200 focus-visible:ring-purple-500 bg-purple-50/50" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </CardHeader>
      <CardContent>
        {selectedThread && selectedUser ? (
          <div className="flex flex-col h-[500px] md:h-[600px]">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 md:h-10 md:w-10 mr-3">
                  {selectedUser.avatar ? (
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="font-medium">{selectedUser.name}</h3>
              </div>
              <Button variant="outline" onClick={handleBackToInbox}>
                Quay Lại Hộp Thư
              </Button>
            </div>
            <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.senderId === "currentUser" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[75%] rounded-lg p-3", message.senderId === "currentUser" ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none")}>
                    <p className="break-words">{message.content}</p>
                    <p className={cn("text-xs mt-1", message.senderId === "currentUser" ? "text-purple-100" : "text-gray-500")}>
                      {formatMessageDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <MessageForm recipientId={selectedUser.id} recipientName={selectedUser.name} onSuccess={() => {}} />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className={`p-3 rounded-md border flex items-start cursor-pointer hover:bg-gray-50 transition-colors ${
                    !thread.lastMessage.isRead ? "bg-purple-50 border-purple-200" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 mr-3">
                    {thread.user.avatar ? (
                      <AvatarImage src={thread.user.avatar} alt={thread.user.name} />
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {thread.user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className={`font-medium ${!thread.lastMessage.isRead ? "text-purple-900" : ""}`}>{thread.user.name}</p>
                      <span className="text-xs text-gray-500">{thread.lastMessage.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate mt-1 ${!thread.lastMessage.isRead ? "font-medium" : "text-gray-600"}`}>{thread.lastMessage.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>Không tìm thấy tin nhắn</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};