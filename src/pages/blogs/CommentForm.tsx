import { useState } from "react";
import { useToast } from "@/pages/ui/use-toast";
import { Button } from "@/pages/ui/button";
import { Textarea } from "@/pages/ui/textarea";
import { Card, CardContent, CardFooter } from "@/pages/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import { Image, Paperclip, Send } from "lucide-react";

interface CommentFormProps {
  blogId: string;
  replyTo?: string;
  onCommentAdded?: () => void;
  onCancelReply?: () => void;
}

export const CommentForm = ({
  blogId,
  replyTo,
  onCommentAdded,
  onCancelReply,
}: CommentFormProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setComment("");

      toast({
        title: replyTo ? "Đã gửi phản hồi" : "Đã gửi bình luận",
        description: "Bình luận của bạn đã được gửi thành công.",
      });

      if (onCommentAdded) onCommentAdded();
    }, 1000);
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="https://via.placeholder.com/40x40" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {replyTo ? "Trả lời bình luận" : "Viết bình luận"}
              </p>
              <p className="text-sm text-gray-500">Bình luận của bạn sẽ hiển thị công khai</p>
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Viết bình luận của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="min-h-[120px]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center border-t pt-4 px-6">
          <div className="flex gap-3 text-gray-500">
            <button type="button" title="Chọn hình ảnh" className="hover:text-crocus-600">
              <Image className="w-5 h-5" />
            </button>
            <button type="button" title="Đính kèm tập tin" className="hover:text-crocus-600">
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {replyTo && (
              <Button type="button" variant="ghost" onClick={onCancelReply}>
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              className="bg-crocus-500 hover:bg-crocus-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
