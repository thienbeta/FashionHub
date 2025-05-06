
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
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
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

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: initialMessage,
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    try {
      // This would be replaced with actual API call in a real app
      console.log("Sending message to", recipientId, ":", data.message);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${recipientName}`,
      });
      
      form.reset({ message: "" });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Write your message to ${recipientName}...`}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
