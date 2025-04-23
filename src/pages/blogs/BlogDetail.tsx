
import { useParams } from "react-router-dom";
import { BlogDetailComponent } from "@/components/blogs/BlogDetailComponent";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="py-10">
      <BlogDetailComponent blogId={id || ""} />
    </div>
  );
};

export default BlogDetail;
