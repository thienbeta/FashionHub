
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock blog data with improved images
const blogPosts = [
  {
    id: "1",
    title: "Summer 2025 Collection",
    excerpt: "Discover our new summer collection featuring the hottest trends in fashion with the 2025 Pantone color.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=450",
    date: "April 15, 2025",
    timestamp: new Date("2025-04-15"),
    author: "Emma Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 128,
    comments: 32,
    relatedProducts: [1, 2]
  },
  {
    id: "2",
    title: "How to Style Crocus Purple",
    excerpt: "Learn how to incorporate the trending Crocus Purple color into your wardrobe this season.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=450",
    date: "April 10, 2025",
    timestamp: new Date("2025-04-10"),
    author: "Michael Chen",
    authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 95,
    comments: 18,
    relatedProducts: [3]
  },
  {
    id: "3",
    title: "Perfect Outfit Combinations",
    excerpt: "Explore our curated outfit combinations that will elevate your style game.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&h=450",
    date: "April 5, 2025",
    timestamp: new Date("2025-04-05"),
    author: "Sophia Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=60&h=60",
    category: "combo",
    likes: 156,
    comments: 45,
    relatedCombos: [1, 2]
  },
  {
    id: "4",
    title: "Sustainable Fashion Choices",
    excerpt: "Discover our eco-friendly clothing options that don't compromise on style.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&h=450",
    date: "March 28, 2025",
    timestamp: new Date("2025-03-28"),
    author: "Daniel Lee",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 72,
    comments: 14,
    relatedProducts: [1, 4]
  },
  {
    id: "5",
    title: "Mix and Match with Combos",
    excerpt: "Learn the art of mixing and matching with our fashion combos to create versatile looks.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&h=450",
    date: "March 20, 2025",
    timestamp: new Date("2025-03-20"),
    author: "Isabella Martinez",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&h=60",
    category: "combo",
    likes: 110,
    comments: 27,
    relatedCombos: [3, 4]
  },
];

export const BlogList = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  // Get unique authors
  const authors = useMemo(() => {
    return [...new Set(blogPosts.map(post => post.author))];
  }, []);

  // Apply filters and sorting to blog posts
  const filteredBlogs = useMemo(() => {
    let filtered = activeTab === "all" 
      ? blogPosts 
      : blogPosts.filter(post => post.category === activeTab);

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply author filter
    if (selectedAuthor) {
      filtered = filtered.filter(post => post.author === selectedAuthor);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        return [...filtered].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      case "oldest":
        return [...filtered].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      case "title_asc":
        return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      case "title_desc":
        return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
      case "popular":
        return [...filtered].sort((a, b) => b.likes - a.likes);
      case "comments":
        return [...filtered].sort((a, b) => b.comments - a.comments);
      default:
        return filtered;
    }
  }, [activeTab, searchTerm, selectedAuthor, sortBy]);

  // Reset all filters
  const resetFilters = () => {
    setActiveTab("all");
    setSearchTerm("");
    setSortBy("newest");
    setSelectedAuthor("");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <TabsList className="md:flex-none">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="product">Product Features</TabsTrigger>
            <TabsTrigger value="combo">Combo Suggestions</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {/* Search input */}
            <div className="relative flex-1">
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>

            {/* Sort options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="comments">Most Comments</SelectItem>
              </SelectContent>
            </Select>

            {/* Author filter */}
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Authors</SelectItem>
                {authors.map(author => (
                  <SelectItem key={author} value={author}>{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset filters button */}
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="md:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={resetFilters}>Reset All Filters</Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
