import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/pages/ui/avatar";
import { Button } from "@/pages/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/pages/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/pages/ui/dialog";
import { Badge } from "@/pages/ui/badge";
import {
  MessageSquare,
  Mail,
  User,
  Globe,
  MapPin,
  Users,
  Calendar,
  Info,
} from "lucide-react";

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

const UserProfile = ({
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
                    {fullName.split(" ").map((name) => name[0]).join("")}
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
                  <p className="text-gray-600">{email}</p>
                </div>
              )}

              {location && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Vị trí
                  </h3>
                  <p className="text-gray-600">{location}</p>
                </div>
              )}

              {website && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    Website
                  </h3>
                  <p className="text-gray-600">
                    <a
                      href={`https://${website.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
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
            <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200">
              Thành viên tích cực
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// MOCK USERS
const MOCK_USERS: Record<string, UserProfileProps> = {
  user1: {
    userId: "user1",
    fullName: "Alex Johnson",
    username: "alexj",
    avatarUrl: "",
    bio: "Fashion enthusiast and product designer with a passion for sustainable style. Always looking for the next trend that combines ethics with aesthetics.",
    joinDate: "January 15, 2023",
    email: "alex.johnson@example.com",
    location: "New York, USA",
    website: "www.alexjohnson.com",
    followers: 245,
    following: 123,
  },
  user2: {
    userId: "user2",
    fullName: "Sarah Miller",
    username: "sarahm",
    avatarUrl: "",
    bio: "Fashion blogger and fitness enthusiast with a focus on athleisure. Creating content that blends style with functionality.",
    joinDate: "March 22, 2022",
    email: "sarah.miller@example.com",
    location: "Los Angeles, USA",
    website: "www.sarahstyle.com",
    followers: 1240,
    following: 530,
  },
  current: {
    userId: "current",
    fullName: "Current User",
    username: "currentuser",
    avatarUrl: "",
    bio: "This is your own profile. Update your bio to tell others about yourself and your fashion preferences.",
    joinDate: "December 10, 2021",
    email: "your.email@example.com",
    location: "Fashion City",
    website: "www.yourfashion.com",
    followers: 42,
    following: 87,
  },
};

const ViewProfile = () => {
  const { userId = "" } = useParams<{ userId: string }>();
  const userData = MOCK_USERS[userId] || MOCK_USERS["current"];
  const isCurrentUser = userId === "current" || !userId;

  return (
    <div className="py-6 bg-gray-50/50 min-h-screen">
      <UserProfile {...userData} isCurrentUser={isCurrentUser} />
    </div>
  );
};

export default ViewProfile;
