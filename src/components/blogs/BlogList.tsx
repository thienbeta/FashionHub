
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock blog data
const blogPosts = [
  {
    id: "1",
    title: "Summer 2025 Collection",
    excerpt: "Discover our new summer collection featuring the hottest trends in fashion with the 2025 Pantone color.",
    image: "https://via.placeholder.com/600x400",
    date: "April 15, 2025",
    author: "Emma Johnson",
    category: "product",
    likes: 128,
    comments: 32,
    relatedProducts: [1, 2]
  },
  {
    id: "2",
    title: "How to Style Crocus Purple",
    excerpt: "Learn how to incorporate the trending Crocus Purple color into your wardrobe this season.",
    image: "https://via.placeholder.com/600x400",
    date: "April 10, 2025",
    author: "Michael Chen",
    category: "product",
    likes: 95,
    comments: 18,
    relatedProducts: [3]
  },
  {
    id: "3",
    title: "Perfect Outfit Combinations",
    excerpt: "Explore our curated outfit combinations that will elevate your style game.",
    image: "https://via.placeholder.com/600x400",
    date: "April 5, 2025",
    author: "Sophia Rodriguez",
    category: "combo",
    likes: 156,
    comments: 45,
    relatedCombos: [1, 2]
  },
  {
    id: "4",
    title: "Sustainable Fashion Choices",
    excerpt: "Discover our eco-friendly clothing options that don't compromise on style.",
    image: "https://via.placeholder.com/600x400",
    date: "March 28, 2025",
    author: "Daniel Lee",
    category: "product",
    likes: 72,
    comments: 14,
    relatedProducts: [1, 4]
  },
  {
    id: "5",
    title: "Mix and Match with Combos",
    excerpt: "Learn the art of mixing and matching with our fashion combos to create versatile looks.",
    image: "https://via.placeholder.com/600x400",
    date: "March 20, 2025",
    author: "Isabella Martinez",
    category: "combo",
    likes: 110,
    comments: 27,
    relatedCombos: [3, 4]
  },
];

export const BlogList = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredBlogs = activeTab === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeTab);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="product">Product Features</TabsTrigger>
          <TabsTrigger value="combo">Combo Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/blogs/${post.id}`}>
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </Link>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      {post.category === "product" ? "Product Feature" : "Combo Suggestion"}
                    </Badge>
                    <span className="text-sm text-gray-500">{post.date}</span>
                  </div>
                  <Link to={`/blogs/${post.id}`} className="hover:text-crocus-600 transition-colors">
                    <h3 className="font-bold text-xl">{post.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500">By {post.author}</p>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      <Heart className="h-4 w-4 mr-1 text-gray-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
                      {post.comments}
                    </span>
                  </div>
                  <Link to={`/blogs/${post.id}`} className="text-sm text-crocus-600 hover:text-crocus-700">
                    Read More
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
