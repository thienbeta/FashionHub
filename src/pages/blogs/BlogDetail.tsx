import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/pages/ui/button";
import { Separator } from "@/pages/ui/separator";
import { ChevronLeft } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { BlogHeader } from "./BlogHeader";
import { BlogContent } from "./BlogContent";
import { useBreakpoint } from "@/hooks/use-mobile";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  likes: number;
  comments: number;
  relatedProducts?: number[];
  relatedCombos?: number[];
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Bộ Sưu Tập Hè 2025",
    content: `<p>Bộ sưu tập Hè 2025 lấy cảm hứng từ thiên nhiên sống động với gam màu chủ đạo là Tím Crocus - Màu của năm 2025 theo Pantone. Sự kết hợp giữa cá tính và sự thoải mái, bền vững.</p>
              <p>Chất liệu: cotton hữu cơ, vải lanh pha và polyester tái chế. Màu sắc xoay quanh tím Crocus cùng các tông trung tính và điểm nhấn nổi bật.</p>
              <h3>Thiết kế nổi bật:</h3>
              <ul>
                <li>Áo thun cotton Crocus</li>
                <li>Sơ mi vải lanh</li>
                <li>Đầm maxi bay bổng</li>
              </ul>
              <p>Mỗi sản phẩm được thiết kế để ứng dụng cao, giúp bạn hạn chế thay mới tủ đồ.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "15/04/2025",
    author: "Emma Johnson",
    authorImage: "https://via.placeholder.com/40x40",
    category: "product",
    likes: 128,
    comments: 32,
    relatedProducts: [1, 2]
  },
  {
    id: "2",
    title: "Phối Đồ Với Màu Tím Crocus",
    content: `<p>Tím Crocus mang đến năng lượng mới cho tủ đồ. Dễ phối với nhiều phong cách.</p>
              <h3>Gợi ý phối đồ:</h3>
              <p><strong>Diện cả cây:</strong> Nhiều sắc độ tím tạo vẻ thời thượng.</p>
              <p><strong>Đối lập màu:</strong> Kết hợp với xanh lá mạ hoặc vàng mù tạt.</p>
              <p><strong>Phụ kiện:</strong> Khăn, túi, giày tím trên nền trung tính.</p>
              <p><strong>Hằng ngày:</strong> Áo thun tím + quần jeans + sneaker.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "10/04/2025",
    author: "Michael Chen",
    authorImage: "https://via.placeholder.com/40x40",
    category: "product",
    likes: 95,
    comments: 18,
    relatedProducts: [3]
  },
  {
    id: "3",
    title: "Gợi Ý Phối Đồ Hoàn Hảo",
    content: `<p>Với các combo từ chúng tôi, bạn sẵn sàng cho mọi dịp.</p>
              <h3>Combo Xuân Hè:</h3>
              <p><strong>Năng động:</strong> Áo thun Crocus + short lanh + giày trắng.</p>
              <p><strong>Đi làm:</strong> Sơ mi lanh + quần tây.</p>
              <p><strong>Ban đêm:</strong> Áo hai dây lụa + khuyên tai + cao gót.</p>
              <p><strong>Cuối tuần:</strong> Bộ đồ đôi tím Crocus.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "05/04/2025",
    author: "Sophia Rodriguez",
    authorImage: "https://via.placeholder.com/40x40",
    category: "combo",
    likes: 156,
    comments: 45,
    relatedCombos: [1, 2]
  },
  {
    id: "4",
    title: "Thời Trang Bền Vững",
    content: `<p>Chúng tôi cam kết thời trang đi cùng bền vững.</p>
              <h3>Cam kết:</h3>
              <p><strong>Nguyên liệu:</strong> Sản xuất có đạo đức, bảo vệ môi trường.</p>
              <p><strong>Vật liệu:</strong> Cotton hữu cơ, polyester tái chế, sợi thiên nhiên.</p>
              <p><strong>Giảm lãng phí:</strong> Thiết kế tối ưu hóa nguyên vật liệu.</p>
              <h3>Sản phẩm nổi bật:</h3>
              <p>Áo thun hữu cơ, Áo khoác denim tái chế, Đầm Tencel™ Lyocell.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "28/03/2025",
    author: "Daniel Lee",
    authorImage: "https://via.placeholder.com/40x40",
    category: "product",
    likes: 72,
    comments: 14,
    relatedProducts: [1, 4]
  },
  {
    id: "5",
    title: "Phối Đồ Linh Hoạt Với Combo",
    content: `<p>Combo giúp bạn tiết kiệm thời gian và vẫn thời trang.</p>
              <h3>Lợi ích:</h3>
              <p><strong>Linh hoạt:</strong> Dễ phối với nhiều món khác.</p>
              <p><strong>Tiết kiệm:</strong> Nhiều set đồ từ ít món.</p>
              <p><strong>Dễ chọn:</strong> Không cần đắn đo mỗi sáng.</p>
              <h3>Combo yêu thích:</h3>
              <p>Capsule cơ bản, Cuối tuần năng động, Từ công sở đến dạo phố.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "20/03/2025",
    author: "Isabella Martinez",
    authorImage: "https://via.placeholder.com/40x40",
    category: "combo",
    likes: 110,
    comments: 27,
    relatedCombos: [3, 4]
  }
];

interface BlogDetailComponentProps {
  blogId: string;
}

export const BlogDetail = ({ blogId }: BlogDetailComponentProps) => {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");

  useEffect(() => {
    const foundBlog = blogPosts.find((post) => post.id === blogId);
    if (foundBlog) {
      setBlog(foundBlog);
    }
  }, [blogId]);

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p>Không tìm thấy bài viết</p>
        <Button variant="link" onClick={() => navigate("/blogs")}>
          Quay lại danh sách blog
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    alert("Chức năng chia sẻ sẽ hiển thị tại đây");
  };

  const scrollToComments = () => {
    document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`mx-auto px-4 ${isMobile ? "max-w-full" : isTablet ? "max-w-2xl" : "max-w-4xl"}`}>

      <BlogHeader blog={blog} onLike={handleLike} onShare={handleShare} onCommentClick={scrollToComments} liked={liked} />
      <BlogContent image={blog.image} title={blog.title} content={blog.content} />
      <Separator className="my-6 sm:my-8" />
      <div id="comments-section" className="scroll-mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Bình luận ({blog.comments})</h2>
        <CommentForm blogId={blogId} />
        <CommentList blogId={blogId} />
      </div>
    </div>
  );
};

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  return <BlogDetail blogId={id || ""} />;
};

export default BlogDetailPage;
