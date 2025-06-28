import { useState } from "react";
import { Card, CardContent } from "@/pages/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import { CommentForm } from "./CommentForm";

interface Comment {
  id: string;
  name: string;
  date: string;
  content: string;
  avatar: string;
  replies?: Array<{
    id: string;
    name: string;
    date: string;
    content: string;
    avatar: string;
  }>;
}

interface CommentsData {
  [key: string]: Comment[];
}

const commentsData: CommentsData = {
  "1": [
    {
      id: "c1",
      name: "Alex Nguyễn",
      date: "17 Tháng 4, 2025",
      content: "Tôi yêu thích bộ sưu tập hè mới! Áo thun Crocus thật sự nằm trong danh sách mong muốn của tôi. Các bạn có kế hoạch thêm màu sắc mới cho bộ sưu tập không?",
      avatar: "https://via.placeholder.com/40x40",
    },
    {
      id: "c2",
      name: "Jamie Lê",
      date: "16 Tháng 4, 2025",
      content: "Khía cạnh bền vững của bộ sưu tập này thật ấn tượng. Tôi đánh giá cao các thương hiệu ưu tiên thực hành thân thiện với môi trường!",
      avatar: "https://via.placeholder.com/40x40",
    }
  ],
  "2": [
    {
      id: "c1",
      name: "Riley Phạm",
      date: "12 Tháng 4, 2025",
      content: "Tôi gặp khó khăn trong việc kết hợp màu tím vào tủ đồ, nhưng những mẹo này thực sự hữu ích! Chắc chắn sẽ thử gợi ý phối màu.",
      avatar: "https://via.placeholder.com/40x40",
    }
  ],
  "3": [
    {
      id: "c1",
      name: "Morgan Trần",
      date: "7 Tháng 4, 2025",
      content: "Tôi đã mua combo Cuối Tuần Crocus tuần trước và đã tạo được nhiều trang phục khác nhau! Đầu tư tuyệt vời nhất từ trước đến nay.",
      avatar: "https://via.placeholder.com/40x40",
    },
    {
      id: "c2",
      name: "Taylor Hoàng",
      date: "6 Tháng 4, 2025",
      content: "Các bạn có thể gợi ý combo nào phù hợp cho môi trường công sở không? Tôi cần những món đồ linh hoạt có thể chuyển đổi từ văn phòng sang các sự kiện buổi tối.",
      avatar: "https://via.placeholder.com/40x40",
    }
  ],
  "4": [
    {
      id: "c1",
      name: "Jordan Vũ",
      date: "30 Tháng 3, 2025",
      content: "Thật mới mẻ khi thấy một thương hiệu thời trang quan tâm nghiêm túc đến tính bền vững. Chiếc váy Tencel nghe tuyệt vời - có kích cỡ lớn hơn không?",
      avatar: "https://via.placeholder.com/40x40",
    }
  ],
  "5": [
    {
      id: "c1",
      name: "Casey Kim",
      date: "22 Tháng 3, 2025",
      content: "Combo Essential Capsule đã hoàn toàn thay đổi tủ đồ của tôi! Tôi không còn phải lo lắng về việc mặc gì mỗi sáng. Cảm ơn các bạn!",
      avatar: "https://via.placeholder.com/40x40",
    }
  ],
};

interface CommentListProps {
  blogId: string;
}

export const CommentList = ({ blogId }: CommentListProps) => {
  const comments = commentsData[blogId] || [];

  if (comments.length === 0) {
    return <p className="text-center py-4 text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <Card key={comment.id} className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.avatar} />
                <AvatarFallback>{comment.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">{comment.name}</h4>
                    <p className="text-sm text-gray-500">{comment.date}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{comment.content}</p>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 ml-6 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="border-l-2 pl-4 border-gray-200">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.avatar} />
                            <AvatarFallback>{reply.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{reply.name}</h5>
                              <span className="text-sm text-gray-500">{reply.date}</span>
                            </div>
                            
                            <p className="text-gray-700 mb-2">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};