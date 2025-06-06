import { useState, useMemo } from "react";
import { BlogCard } from "./BlogCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const blogPosts = [
  {
    id: "1",
    title: "Bộ sưu tập mùa hè 2025",
    excerpt: "Khám phá bộ sưu tập mùa hè mới với những xu hướng thời trang nổi bật và màu sắc Pantone 2025.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=450",
    date: "15/04/2025",
    timestamp: new Date("2025-04-15"),
    author: "Emma Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 128,
    comments: 32,
    relatedProducts: [1, 2],
  },
  {
    id: "2",
    title: "Cách phối đồ với màu tím Crocus",
    excerpt: "Tìm hiểu cách sử dụng màu tím Crocus - màu sắc nổi bật trong mùa này vào trang phục của bạn.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&h=450",
    date: "10/04/2025",
    timestamp: new Date("2025-04-10"),
    author: "Michael Chen",
    authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 95,
    comments: 18,
    relatedProducts: [3],
  },
  {
    id: "3",
    title: "Cách phối đồ hoàn hảo",
    excerpt: "Khám phá các gợi ý phối đồ được chọn lọc để nâng tầm phong cách thời trang của bạn.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&h=450",
    date: "05/04/2025",
    timestamp: new Date("2025-04-05"),
    author: "Sophia Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=60&h=60",
    category: "combo",
    likes: 156,
    comments: 45,
    relatedCombos: [1, 2],
  },
  {
    id: "4",
    title: "Thời trang bền vững và phong cách",
    excerpt: "Khám phá các sản phẩm thời trang thân thiện với môi trường mà vẫn giữ được phong cách riêng.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&h=450",
    date: "28/03/2025",
    timestamp: new Date("2025-03-28"),
    author: "Daniel Lee",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&h=60",
    category: "product",
    likes: 72,
    comments: 14,
    relatedProducts: [1, 4],
  },
  {
    id: "5",
    title: "Phối đồ linh hoạt với combo",
    excerpt: "Tìm hiểu cách phối hợp nhiều set đồ khác nhau từ các combo thời trang tiện lợi.",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&h=450",
    date: "20/03/2025",
    timestamp: new Date("2025-03-20"),
    author: "Isabella Martinez",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=60&h=60",
    category: "combo",
    likes: 110,
    comments: 27,
    relatedCombos: [3, 4],
  },
];

export const BlogList = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const isMobile = useIsMobile();

  const authors = useMemo(() => {
    return [...new Set(blogPosts.map(post => post.author))];
  }, []);

  const filteredBlogs = useMemo(() => {
    let filtered = activeTab === "all"
      ? blogPosts
      : blogPosts.filter(post => post.category === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedAuthor && selectedAuthor !== "all_authors") {
      filtered = filtered.filter(post => post.author === selectedAuthor);
    }

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

  const resetFilters = () => {
    setActiveTab("all");
    setSearchTerm("");
    setSortBy("newest");
    setSelectedAuthor("");
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col space-y-4 mb-4">
          <TabsList className="w-full max-w-full overflow-x-auto flex-wrap justify-start h-auto p-1">
            <TabsTrigger value="all" className={`${isMobile ? 'text-sm py-1.5' : ''}`}>Tất cả</TabsTrigger>
            <TabsTrigger value="product" className={`${isMobile ? 'text-sm py-1.5' : ''}`}>Sản phẩm</TabsTrigger>
            <TabsTrigger value="combo" className={`${isMobile ? 'text-sm py-1.5' : ''}`}>Gợi ý combo</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                placeholder="Tìm bài viết..."
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

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="title_asc">Tiêu đề (A-Z)</SelectItem>
                <SelectItem value="title_desc">Tiêu đề (Z-A)</SelectItem>
                <SelectItem value="popular">Lượt thích</SelectItem>
                <SelectItem value="comments">Bình luận nhiều</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-6 sm:py-12 border rounded-md bg-gray-50">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-600 mb-4 px-4">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
              <Button size={isMobile ? "sm" : "default"} onClick={resetFilters}>Đặt lại tất cả</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-sm text-gray-500">
        Đã tìm thấy {filteredBlogs.length} bài viết
      </div>
    </div>
  );
};
