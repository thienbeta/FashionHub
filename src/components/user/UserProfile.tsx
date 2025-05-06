
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, User } from "lucide-react";
import { MessageForm } from "./MessageForm";

interface UserProfileProps {
  userId: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: string;
  email?: string;
  isCurrentUser?: boolean;
}

export const UserProfile = ({
  userId,
  fullName,
  username,
  avatarUrl,
  bio = "No bio available",
  joinDate,
  email,
  isCurrentUser = false,
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
                    Message
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send a message to {fullName}</DialogTitle>
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
              <h3 className="font-medium text-gray-700 mb-1">About</h3>
              <p className="text-gray-600">{bio}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Member since</h3>
                <p className="text-gray-600">{joinDate}</p>
              </div>
              
              {email && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Contact</h3>
                  <p className="text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200">Active Member</Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
