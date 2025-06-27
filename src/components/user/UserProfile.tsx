import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, User, Globe, MapPin, Users, Calendar, Info } from "lucide-react";
import { MessageForm } from "./messages/MessageForm";

interface UserProfileProps {
  userId: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: string;
  email?: string;
  isCurrentUser?: boolean;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
}

export const UserProfile = ({
  userId,
  fullName,
  username,
  avatarUrl,
  bio = "Chưa có thông tin",
  joinDate,
  email,
  isCurrentUser = false,
  location,
  website,
  followers,
  following,
}: UserProfileProps) => {
  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-purple-100">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={fullName} />
                ) : (
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {fullName.split(" ").map(name => name[0]).join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-gray-500">@{username}</p>
              </div>
            </div>
            
            {!isCurrentUser && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Gửi tin nhắn
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Gửi tin nhắn đến {fullName}</DialogTitle>
                  </DialogHeader>
                  <MessageForm recipientId={userId} recipientName={fullName} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2 text-gray-400" />
                Giới thiệu
              </h3>
              <p className="text-gray-600">{bio}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Tham gia từ
                </h3>
                <p className="text-gray-600">{joinDate}</p>
              </div>
              
              {email && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Liên hệ
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    {email}
                  </p>
                </div>
              )}

              {location && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Vị trí
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    {location}
                  </p>
                </div>
              )}

              {website && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    Website
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <a href={`https://${website.replace(/^https?:\/\//, '')}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-purple-600 hover:underline">
                      {website}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {(followers !== undefined || following !== undefined) && (
              <div className="flex gap-4 mt-2">
                {followers !== undefined && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">{followers}</span> 
                    <span className="text-gray-500">Người theo dõi</span>
                  </div>
                )}
                
                {following !== undefined && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium mr-1">{following}</span>
                    <span className="text-gray-500">Đang theo dõi</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200">Thành viên tích cực</Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};