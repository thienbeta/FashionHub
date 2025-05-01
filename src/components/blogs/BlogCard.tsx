
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  likes?: number;
  comments?: number;
}

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/blogs/${post.id}`}>
        <AspectRatio ratio={16/9} className="w-full overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </AspectRatio>
      </Link>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={`mb-2 ${post.category === "product" ? "bg-crocus-50 text-crocus-700" : "bg-blue-50 text-blue-700"}`}>
            {post.category === "product" ? "Product Feature" : "Combo Suggestion"}
          </Badge>
          <span className="text-sm text-gray-500">{post.date}</span>
        </div>
        <Link to={`/blogs/${post.id}`} className="hover:text-crocus-600 transition-colors">
          <h3 className="font-bold text-xl">{post.title}</h3>
        </Link>
        <div className="flex items-center space-x-2 mt-1">
          <img 
            src={post.authorImage} 
            alt={post.author} 
            className="w-6 h-6 rounded-full object-cover" 
          />
          <p className="text-sm text-gray-500">By {post.author}</p>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600">{post.excerpt}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-4">
          {post.likes && (
            <span className="flex items-center text-sm text-gray-500">
              <Heart className="h-4 w-4 mr-1 text-gray-400" />
              {post.likes}
            </span>
          )}
          {post.comments && (
            <span className="flex items-center text-sm text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
              {post.comments}
            </span>
          )}
        </div>
        <Link to={`/blogs/${post.id}`} className="text-sm text-crocus-600 hover:text-crocus-700">
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};
