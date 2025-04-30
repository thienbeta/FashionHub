
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share } from "lucide-react";

interface BlogHeaderProps {
  blog: {
    title: string;
    category: string;
    author: string;
    authorImage: string;
    date: string;
    likes: number;
    comments: number;
  };
  onLike: () => void;
  onShare: () => void;
  onCommentClick: () => void;
  liked: boolean;
}

export const BlogHeader = ({ 
  blog, 
  onLike, 
  onShare, 
  onCommentClick,
  liked 
}: BlogHeaderProps) => {
  return (
    <div className="mb-6">
      <Badge variant="outline" className="mb-2">
        {blog.category === "product" ? "Product Feature" : "Combo Suggestion"}
      </Badge>
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={blog.authorImage} alt={blog.author} />
            <AvatarFallback>{blog.author.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{blog.author}</p>
            <p className="text-sm text-gray-500">{blog.date}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'}`}
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 mr-1 ${liked ? 'fill-current' : ''}`} />
            <span>{liked ? blog.likes + 1 : blog.likes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-500"
            onClick={onCommentClick}
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{blog.comments}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-500"
            onClick={onShare}
          >
            <Share className="h-5 w-5 mr-1" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
