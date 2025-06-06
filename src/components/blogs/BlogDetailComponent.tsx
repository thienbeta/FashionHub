import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { BlogHeader } from "./BlogHeader";
import { BlogContent } from "./BlogContent";
import { RelatedItemsSection } from "./RelatedItemsSection";
import { useBreakpoint } from "@/hooks/use-mobile";

const blogPosts = [
  {
    id: "1",
    title: "Bộ Sưu Tập Hè 2025",
    content: `<p>Bộ sưu tập Hè 2025 lấy cảm hứng từ sự sống động của thiên nhiên với gam màu chủ đạo là Tím Crocus - Màu của năm 2025 theo Pantone. Mùa này là sự kết hợp giữa cá tính riêng và sự thoải mái, bền vững.</p>
              <p>Chất liệu sử dụng gồm vải cotton hữu cơ, vải lanh pha, và polyester tái chế – hoàn hảo cho thời tiết nóng bức. Gam màu xoay quanh tím Crocus, kết hợp với các tông trung tính và những điểm nhấn nổi bật.</p>
              <h3>Các thiết kế nổi bật:</h3>
              <ul>
                <li>Áo thun cotton Crocus – Món đồ cơ bản nhưng hiện đại cho mùa hè</li>
                <li>Sơ mi vải lanh – Thanh lịch và linh hoạt cho mọi dịp</li>
                <li>Đầm maxi bay bổng – Lý tưởng cho dạo phố hoặc du lịch biển</li>
              </ul>
              <p>Từng sản phẩm được thiết kế để mang tính ứng dụng cao, giúp bạn hạn chế việc thay mới tủ đồ và hướng đến tiêu dùng có trách nhiệm.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "15 Tháng 4, 2025",
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
    content: `<p>Tím Crocus mang đến nguồn năng lượng mới mẻ cho tủ đồ của bạn. Từ những món nổi bật đến phụ kiện nhỏ, màu sắc này dễ dàng ứng dụng trong nhiều phong cách.</p>
              <h3>Các gợi ý phối đồ:</h3>
              <p><strong>Diện cả cây:</strong> Kết hợp nhiều sắc độ tím tạo nên vẻ ngoài thời thượng và ấn tượng.</p>
              <p><strong>Phối màu đối lập:</strong> Tím Crocus rất hợp với xanh lá mạ hoặc vàng mù tạt – lý tưởng cho những set đồ phá cách.</p>
              <p><strong>Phụ kiện:</strong> Một chiếc khăn, túi xách hoặc giày tím là điểm nhấn tinh tế trên nền trang phục trung tính.</p>
              <p><strong>Hằng ngày:</strong> Áo thun tím kết hợp cùng quần jeans và giày sneaker là lựa chọn hoàn hảo cho phong cách thường ngày.</p>
              <p>Hãy tự tin thể hiện cá tính với sắc tím đặc biệt này!</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "10 Tháng 4, 2025",
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
    content: `<p>Phối đồ không khó nếu bạn có những gợi ý phù hợp. Với các combo thời trang từ chúng tôi, bạn có thể sẵn sàng cho mọi dịp trong tích tắc.</p>
              <h3>Combo xuân hè 2025:</h3>
              <p><strong>Phong cách năng động:</strong> Áo thun Crocus cùng quần short vải lanh và giày trắng – đơn giản mà cuốn hút.</p>
              <p><strong>Đi làm thanh lịch:</strong> Sơ mi lanh kết hợp quần tây và phụ kiện tối giản.</p>
              <p><strong>Dạo phố ban đêm:</strong> Thay áo thun bằng áo lụa hai dây, thêm khuyên tai nổi bật và giày cao gót.</p>
              <p><strong>Cuối tuần:</strong> Bộ đồ đôi tím Crocus – áo khoác và quần ống suông cho những chuyến đi ngắn ngày.</p>
              <p>Tất cả combo đều linh hoạt, thời trang và dễ ứng dụng.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "5 Tháng 4, 2025",
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
    content: `<p>Chúng tôi tin rằng thời trang và sự bền vững có thể song hành. Bộ sưu tập thân thiện với môi trường của chúng tôi thể hiện cam kết giảm thiểu tác động xấu đến môi trường.</p>
              <h3>Chúng tôi làm gì?</h3>
              <p><strong>Nguyên liệu có trách nhiệm:</strong> Chọn đối tác sản xuất tuân thủ đạo đức và bảo vệ môi trường.</p>
              <p><strong>Vật liệu sinh thái:</strong> Sử dụng cotton hữu cơ, polyester tái chế, và vải từ sợi thiên nhiên.</p>
              <p><strong>Giảm lãng phí:</strong> Thiết kế thông minh để tận dụng tối đa nguyên vật liệu, hạn chế dư thừa.</p>
              <h3>Sản phẩm nổi bật:</h3>
              <p><strong>Áo thun hữu cơ:</strong> 100% cotton hữu cơ đạt chuẩn GOTS, nhuộm bằng thuốc nhuộm thân thiện với môi trường.</p>
              <p><strong>Áo khoác denim tái chế:</strong> Tái chế từ vải denim đã qua sử dụng, tiết kiệm đến 1.800 lít nước.</p>
              <p><strong>Đầm Tencel™ Lyocell:</strong> Mềm mại, thoáng mát, làm từ sợi gỗ tái tạo theo quy trình tuần hoàn.</p>
              <p>Hãy cùng chúng tôi tạo nên ngành thời trang phát triển bền vững hơn.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "28 Tháng 3, 2025",
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
    content: `<p>Phối đồ thông minh là bí quyết sở hữu tủ quần áo tối ưu. Những combo sẵn có giúp bạn tiết kiệm thời gian và vẫn nổi bật.</p>
              <h3>Lợi ích của combo:</h3>
              <p><strong>Linh hoạt:</strong> Từng món đều có thể kết hợp với nhiều item khác.</p>
              <p><strong>Tiết kiệm:</strong> Mua combo sẽ có nhiều bộ đồ hơn từ cùng số món.</p>
              <p><strong>Dễ lựa chọn:</strong> Không cần đắn đo mỗi sáng, chỉ cần lấy theo bộ sẵn.</p>
              <h3>Combo yêu thích:</h3>
              <p><strong>Capsule cơ bản:</strong> Áo tím Crocus, quần trung tính, blazer và áo thun đơn sắc.</p>
              <p><strong>Cuối tuần năng động:</strong> Jeans, áo layer nhiều lớp, và áo khoác nổi bật.</p>
              <p><strong>Từ công sở đến dạo phố:</strong> Bộ đồ chuyển đổi linh hoạt từ văn phòng đến buổi tối.</p>
              <p>Chọn đồ phù hợp màu sắc, phong cách và phom dáng để tối ưu hóa tủ đồ của bạn.</p>`,
    image: "https://via.placeholder.com/800x500",
    date: "20 Tháng 3, 2025",
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

export const BlogDetailComponent = ({ blogId }: BlogDetailComponentProps) => {
  const [blog, setBlog] = useState<any | null>(null);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const isMobile = useBreakpoint("mobile");
  const isTablet = useBreakpoint("tablet");

  useEffect(() => {
    const foundBlog = blogPosts.find(post => post.id === blogId);
    if (foundBlog) {
      setBlog(foundBlog);
    }
  }, [blogId]);

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p>Không tìm thấy bài viết</p>
        <Button variant="link" onClick={() => navigate('/blogs')}>
          Quay lại danh sách blog
        </Button>
      </div>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    alert('Chức năng chia sẻ sẽ hiển thị tại đây');
  };

  const scrollToComments = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`mx-auto px-4 ${isMobile ? 'max-w-full' : isTablet ? 'max-w-2xl' : 'max-w-4xl'}`}>
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "default"}
        className="mb-4"
        onClick={() => navigate('/blogs')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Quay lại Blog
      </Button>

      <BlogHeader
        blog={blog}
        onLike={handleLike}
        onShare={handleShare}
        onCommentClick={scrollToComments}
        liked={liked}
      />

      <BlogContent
        image={blog.image}
        title={blog.title}
        content={blog.content}
      />

      <RelatedItemsSection
        category={blog.category}
        relatedProducts={blog.relatedProducts}
        relatedCombos={blog.relatedCombos}
      />

      <Separator className="my-6 sm:my-8" />

      <div id="comments-section" className="scroll-mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Bình luận ({blog.comments})</h2>
        <CommentForm blogId={blogId} />
        <CommentList blogId={blogId} />
      </div>
    </div>
  );
};
