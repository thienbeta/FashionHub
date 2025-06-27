import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

const messageSchema = z.object({
  message: z.string()
    .min(1, { message: "Tin nhắn không được để trống" })
    .max(1000, { message: "Tin nhắn không được vượt quá 1000 ký tự" }),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface MessageFormProps {
  recipientId: string;
  recipientName: string;
  initialMessage?: string;
  onSuccess?: () => void;
}

export const MessageForm = ({ 
  recipientId, 
  recipientName, 
  initialMessage = "", 
  onSuccess 
}: MessageFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [charCount, setCharCount] = useState(initialMessage.length);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: initialMessage,
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Đang gửi tin nhắn đến", recipientId, ":", data.message);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Tin nhắn đã được gửi",
        description: `Tin nhắn của bạn đã được gửi đến ${recipientName}`,
      });
      
      form.reset({ message: "" });
      setCharCount(0);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Gửi tin nhắn thất bại:", error);
      toast({
        variant: "destructive",
        title: "Gửi tin nhắn thất bại",
        description: "Vui lòng thử lại sau",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    form.setValue("message", e.target.value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Tin nhắn đến {recipientName}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Viết tin nhắn đến ${recipientName}...`}
                  className="min-h-[100px] md:min-h-[150px] resize-none border-purple-100 focus-visible:ring-purple-500"
                  {...field}
                  onChange={handleTextChange}
                />
              </FormControl>
              <div className="flex justify-between items-center mt-1">
                <FormMessage />
                <div className="text-xs text-gray-500">{charCount}/1000</div>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 transition-all w-full md:w-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </div>
      </form>
    </Form>
  );
};