import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MessageThread } from "./MessageThread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_THREADS = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: null,
    },
    lastMessage: {
      content: 'Chào, tôi muốn hỏi về sản phẩm mới nhất của bạn...',
      timestamp: '2 giờ trước',
      isRead: false,
    },
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'Sarah Miller',
      avatar: null,
    },
    lastMessage: {
      content: 'Cảm ơn bạn đã giúp tôi với đơn hàng!',
      timestamp: '1 ngày trước',
      isRead: true,
    },
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'David Wilson',
      avatar: null,
    },
    lastMessage: {
      content: 'Khi nào các mặt hàng mới sẽ có hàng?',
      timestamp: '3 ngày trước',
      isRead: true,
    },
  },
];

export const MessagesInbox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  
  const filteredThreads = MOCK_THREADS.filter(thread => 
    thread.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleThreadClick = (threadId: string) => {
    setSelectedThread(threadId);
  };
  
  const handleBackToInbox = () => {
    setSelectedThread(null);
  };
  
  return (
    <Card className="max-w-full md:max-w-auto mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Tin nhắn
        </CardTitle>
        <CardDescription>
          Xem và phản hồi tin nhắn của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedThread ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={handleBackToInbox}
            >
              Quay lại hộp thư
            </Button>
            <MessageThread 
              threadId={selectedThread} 
              user={MOCK_THREADS.find(t => t.id === selectedThread)?.user!}
            />
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Tìm kiếm tin nhắn..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-2">
                  {filteredThreads.length > 0 ? (
                    filteredThreads.map((thread) => (
                      <div 
                        key={thread.id}
                        onClick={() => handleThreadClick(thread.id)}
                        className={`p-3 rounded-md border flex items-start cursor-pointer hover:bg-gray-50 transition-colors ${!thread.lastMessage.isRead ? 'bg-purple-50 border-purple-200' : ''}`}
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
                            <p className={`font-medium ${!thread.lastMessage.isRead ? 'text-purple-900' : ''}`}>
                              {thread.user.name}
                            </p>
                            <span className="text-xs text-gray-500">{thread.lastMessage.timestamp}</span>
                          </div>
                          <p className={`text-sm truncate mt-1 ${!thread.lastMessage.isRead ? 'font-medium' : 'text-gray-600'}`}>
                            {thread.lastMessage.content}
                          </p>
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
              </TabsContent>
              
              <TabsContent value="unread">
                <div className="space-y-2">
                  {filteredThreads.filter(t => !t.lastMessage.isRead).length > 0 ? (
                    filteredThreads
                      .filter(t => !t.lastMessage.isRead)
                      .map((thread) => (
                        <div 
                          key={thread.id}
                          onClick={() => handleThreadClick(thread.id)}
                          className="p-3 rounded-md border border-purple-200 bg-purple-50 flex items-start cursor-pointer hover:bg-purple-100 transition-colors"
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
                              <p className="font-medium text-purple-900">
                                {thread.user.name}
                              </p>
                              <span className="text-xs text-gray-500">{thread.lastMessage.timestamp}</span>
                            </div>
                            <p className="text-sm truncate mt-1 font-medium">
                              {thread.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p>Không có tin nhắn chưa đọc</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};