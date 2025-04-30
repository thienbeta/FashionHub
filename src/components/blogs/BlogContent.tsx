
import { Card, CardContent } from "@/components/ui/card";

interface BlogContentProps {
  image: string;
  title: string;
  content: string;
}

export const BlogContent = ({ image, title, content }: BlogContentProps) => {
  return (
    <>
      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-6">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div 
            className="prose prose-lg max-w-none" 
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </CardContent>
      </Card>
    </>
  );
};
