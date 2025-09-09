import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/pages/ui/card";
import {
  Star,
  Upload,
  X,
  Send,
  Camera,
  Calendar,
  CheckCircle,
  Sparkles,
  Filter,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";
const APP_TITLE = import.meta.env.VITE_TITLE || "FashionApi";

interface Comment {
  maBinhLuan: number;
  tieuDe: string;
  noiDung: string;
  danhGia: number;
  ngayTao: string;
  trangThai: number;
  maNguoiDung: number;
  maSanPham: number;
  medias: Media[];
  danhGiaTrungBinh: number;
  soLuongDanhGia: number;
  soLuong5Sao: number;
  soLuong4Sao: number;
  soLuong3Sao: number;
  soLuong2Sao: number;
  soLuong1Sao: number;
  hoTen: string;
  avt: string;
}

interface Media {
  maMedia: number;
  loaiMedia: string;
  duongDan: string;
  altMedia: string | null;
  trangThai: number;
}

interface SelectedFile {
  file: File;
  preview?: string;
}

interface CmtProps {
  productId: number;
}

const Cmt: React.FC<CmtProps> = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [errors, setErrors] = useState({
    rating: "",
    title: "",
    content: "",
    files: "",
    auth: "",
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const commentsPerPage = 20;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentFormRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true);
    setCommentsError("");
    try {
      const response = await fetch(
        `${API_URL}/api/BinhLuan/search?maSanPham=${productId}&trangThai=1`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Không thể tải danh sách bình luận.");
      }

      const commentsData: Comment[] = await response.json();
      setComments(commentsData);
      setFilteredComments(commentsData);
    } catch (error) {
      setCommentsError((error as Error).message);
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể tải bình luận: ${(error as Error).message}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsLoadingComments(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commentFormRef.current &&
        !commentFormRef.current.contains(event.target as Node)
      ) {
        setShowCommentForm(false);
        resetForm();
      }
    };
    if (showCommentForm) {
      document.addEventListener("mousedown", handleClickOutside);
      firstFocusableElementRef.current?.focus();
      if (commentsContainerRef.current) {
        commentsContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCommentForm]);

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setContent("");
    setSelectedFiles((prev) => {
      prev.forEach((file) => file.preview && URL.revokeObjectURL(file.preview));
      return [];
    });
    setErrors({ rating: "", title: "", content: "", files: "", auth: "" });
    setIsSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filterComments = (star: number | null) => {
    setSelectedFilter(star);
    setCurrentPage(1);
    setFilteredComments(
      star === null
        ? comments
        : comments.filter((comment) => comment.danhGia === star)
    );
  };

  const handleStarClick = (value: number) => {
    setRating(value);
    setErrors((prev) => ({ ...prev, rating: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: SelectedFile[] = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    if (selectedFiles.length + newFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        files: "Bạn chỉ có thể tải lên tối đa 5 ảnh",
      }));
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bạn chỉ có thể tải lên tối đa 5 ảnh",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrors((prev) => ({ ...prev, files: "" }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files) return;
    const newFiles: SelectedFile[] = Array.from(files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    if (selectedFiles.length + newFiles.length > 5) {
      setErrors((prev) => ({
        ...prev,
        files: "Bạn chỉ có thể tải lên tối đa 5 ảnh",
      }));
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Bạn chỉ có thể tải lên tối đa 5 ảnh",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setErrors((prev) => ({ ...prev, files: "" }));
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev];
      const fileToRemove = updatedFiles[index];
      if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      rating: "",
      title: "",
      content: "",
      files: "",
      auth: "",
    };
    if (rating === 0) {
      newErrors.rating = "Vui lòng chọn số sao đánh giá";
      isValid = false;
    }
    if (title.length < 5) {
      newErrors.title = "Tiêu đề phải có ít nhất 5 ký tự";
      isValid = false;
    }
    if (content.length < 10) {
      newErrors.content = "Nội dung phải có ít nhất 10 ký tự";
      isValid = false;
    }
    const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");
    if (!userId) {
      newErrors.auth = "Vui lòng đăng nhập để gửi đánh giá";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          errors.auth ||
          errors.rating ||
          errors.title ||
          errors.content ||
          "Vui lòng kiểm tra lại các trường thông tin!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "MaNguoiDung",
        sessionStorage.getItem("userId") || localStorage.getItem("userId") || ""
      );
      formData.append("MaSanPham", productId.toString());
      formData.append("DanhGia", rating.toString());
      formData.append("TieuDe", title);
      formData.append("NoiDung", content);
      formData.append("TrangThai", "1");
      selectedFiles.forEach((selectedFile) => formData.append("Images", selectedFile.file));
      const response = await fetch(`${API_URL}/api/BinhLuan`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Message || "Lỗi khi gửi đánh giá");
      }
      setIsSubmitted(true);
      MySwal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đánh giá của bạn đã được gửi. Cảm ơn bạn đã chia sẻ!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
      setTimeout(() => {
        setShowCommentForm(false);
        resetForm();
        fetchComments();
      }, 2000);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        auth: `Lỗi khi gửi đánh giá: ${(error as Error).message}`,
      }));
      MySwal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Có lỗi xảy ra khi gửi đánh giá: ${(error as Error).message}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars: number) => {
    const ratingTexts = {
      1: "Rất không hài lòng",
      2: "Không hài lòng",
      3: "Bình thường",
      4: "Hài lòng",
      5: "Rất hài lòng",
    };
    return ratingTexts[stars as keyof typeof ratingTexts] || "";
  };

  const totalReviews = comments.length;
  const averageRating = comments[0]?.danhGiaTrungBinh || 0;
  const ratingCounts = {
    5: comments[0]?.soLuong5Sao || 0,
    4: comments[0]?.soLuong4Sao || 0,
    3: comments[0]?.soLuong3Sao || 0,
    2: comments[0]?.soLuong2Sao || 0,
    1: comments[0]?.soLuong1Sao || 0,
  };

  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                    Tổng Quan Đánh Giá
                  </CardTitle>

                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-md">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 sm:h-6 sm:w-6 ${star <= averageRating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                          }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base font-medium">
                    {totalReviews} đánh giá
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-3 mb-6">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1 w-10 sm:w-12">
                        <span className="text-xs sm:text-sm font-medium">{star}</span>
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                          style={{
                            width: `${totalReviews > 0
                              ? (ratingCounts[star as keyof typeof ratingCounts] /
                                totalReviews) *
                              100
                              : 0
                              }%`,
                          }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-right">
                        {ratingCounts[star as keyof typeof ratingCounts]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Lọc theo đánh giá
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => filterComments(null)}
                      className={`w-full px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${selectedFilter === null
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Tất cả ({totalReviews})
                    </Button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <Button
                        key={star}
                        onClick={() => filterComments(star)}
                        className={`w-full px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${selectedFilter === star
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        {star} sao ({ratingCounts[star as keyof typeof ratingCounts]})
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div ref={commentsContainerRef} className="">

              <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-red-600 text-white rounded-t-2xl p-6 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Tiêu đề */}
                    <div className="flex items-center gap-3">
                      <Star className="h-6 w-6 text-yellow-300" />
                      <CardTitle className="text-2xl font-bold">
                        Đánh giá từ khách hàng
                      </CardTitle>
                    </div>

                    {/* Nút hành động */}
                    <Button
                      onClick={() => setShowCommentForm((prev) => !prev)}
                      className={`bg-white font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${showCommentForm ? "text-red-600" : "text-purple-600"
                        }`}
                    >
                      {showCommentForm ? (
                        <>
                          <X className="h-5 w-5 text-red-600" />
                          <span className="text-sm sm:text-base">Đóng</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <span className="text-sm sm:text-base">Viết đánh giá</span>
                        </>
                      )}
                    </Button>

                  </div>

                  {/* Mô tả */}
                  <CardDescription className="mt-3 text-purple-100 text-sm sm:text-base">
                    Xem ý kiến từ những khách hàng khác về sản phẩm này
                  </CardDescription>
                </CardHeader>
                {showCommentForm && (
                  <div className="mb-6">
                    <Card className="bg-transparent rounded-2xl shadow-none border-none">
                      <CardContent className="p-0">
                        {isSubmitted ? (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-md">
                              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                              Đánh giá đã được gửi thành công!
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base mb-6">
                              Cảm ơn bạn đã dành thời gian chia sẻ đánh giá. Ý kiến của bạn rất quan trọng!
                            </p>
                            <Button
                              onClick={() => {
                                setIsSubmitted(false);
                                setShowCommentForm(false);
                              }}
                              className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              Viết đánh giá khác
                            </Button>
                          </div>
                        ) : (
                          <div className="">
                            <div className="bg-white shadow-xl border border-gray-200 overflow-hidden">


                              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                                {/* Rating Section */}
                                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-100">
                                  <div className="text-center">
                                    {/* Tiêu đề + điểm đánh giá */}
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
                                      <Label className="text-base sm:text-lg font-semibold text-gray-800">
                                        Đánh giá của bạn:
                                      </Label>
                                      {(hoverRating || rating) > 0 && (
                                        <span className="text-purple-700 text-sm sm:text-base font-medium">
                                          {getRatingText(hoverRating || rating)}
                                        </span>
                                      )}
                                    </div>

                                    {/* Hàng sao */}
                                    <div className="flex justify-center gap-2 mb-3">
                                      {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                          key={value}
                                          type="button"
                                          onClick={() => handleStarClick(value)}
                                          onMouseEnter={() => setHoverRating(value)}
                                          onMouseLeave={() => setHoverRating(0)}
                                          className="focus:outline-none"
                                          aria-label={`Chọn ${value} sao`}
                                        >
                                          <Star
                                            className={`h-8 w-8 sm:h-10 sm:w-10 cursor-pointer transition-all duration-200 ${value <= (hoverRating || rating)
                                              ? "text-yellow-400 fill-yellow-400 scale-110"
                                              : "text-gray-300 hover:text-yellow-300 hover:scale-105"
                                              }`}
                                          />
                                        </button>
                                      ))}
                                    </div>

                                    {/* Lỗi */}
                                    {errors.rating && (
                                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                                        {errors.rating}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Title Section */}
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-purple-100 shadow-sm">
                                  <Label
                                    htmlFor="title"
                                    className="block text-sm font-semibold text-gray-700 mb-3"
                                  >
                                    Tiêu đề đánh giá
                                  </Label>
                                  <Input
                                    id="title"
                                    type="text"
                                    placeholder="Tóm tắt ngắn gọn về trải nghiệm của bạn..."
                                    value={title}
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                      setErrors((prev) => ({
                                        ...prev,
                                        title:
                                          e.target.value.length < 5
                                            ? "Tiêu đề phải có ít nhất 5 ký tự"
                                            : "",
                                      }));
                                    }}
                                    className={`w-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 rounded-lg ${errors.title
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-purple-200 focus:border-purple-500"
                                      }`}
                                    disabled={isSubmitting}
                                    aria-describedby={errors.title ? "title-error" : undefined}
                                  />
                                  {errors.title && (
                                    <p
                                      id="title-error"
                                      className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200"
                                    >
                                      {errors.title}
                                    </p>
                                  )}
                                </div>

                                {/* Content Section */}
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-purple-100 shadow-sm">
                                  <Label
                                    htmlFor="content"
                                    className="block text-sm font-semibold text-gray-700 mb-3"
                                  >
                                    Nội dung đánh giá
                                  </Label>
                                  <textarea
                                    id="content"
                                    placeholder="Chia sẻ chi tiết trải nghiệm của bạn..."
                                    value={content}
                                    onChange={(e) => {
                                      setContent(e.target.value);
                                      setErrors((prev) => ({
                                        ...prev,
                                        content:
                                          e.target.value.length < 10
                                            ? "Nội dung phải có ít nhất 10 ký tự"
                                            : "",
                                      }));
                                    }}
                                    rows={4}
                                    className={`w-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 p-3 rounded-lg ${errors.content
                                      ? "border-red-300 focus:border-red-500"
                                      : "border-purple-200 focus:border-purple-500"
                                      } resize-none`}
                                    disabled={isSubmitting}
                                    aria-describedby={errors.content ? "content-error" : undefined}
                                  />
                                  {errors.content && (
                                    <p
                                      id="content-error"
                                      className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200"
                                    >
                                      {errors.content}
                                    </p>
                                  )}
                                </div>

                                {/* Image Upload Section */}
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-purple-100 shadow-sm">
                                  <Label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Camera className="h-4 w-4" />
                                    Thêm hình ảnh (tối đa 5)
                                  </Label>

                                  <div
                                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-colors min-h-[120px] sm:min-h-[150px] flex items-center justify-center ${isDragging
                                      ? "border-purple-500 bg-purple-50"
                                      : errors.files
                                        ? "border-red-300 bg-red-25"
                                        : "border-purple-200 hover:border-purple-500 hover:bg-purple-25"
                                      }`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    role="region"
                                    aria-label="Khu vực tải lên hình ảnh"
                                  >
                                    {selectedFiles.length === 0 ? (
                                      <div>
                                        <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-3" />
                                        <p className="text-sm text-gray-600 mb-1">
                                          {isDragging ? "Thả ảnh tại đây" : "Kéo thả hoặc click để chọn ảnh"}
                                        </p>
                                        <p className="text-xs text-gray-500">Hỗ trợ: JPG, PNG, GIF</p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 w-full">
                                        {selectedFiles.map((file, index) => (
                                          <div key={index} className="relative group">
                                            <img
                                              src={file.preview}
                                              alt={file.file.name}
                                              className="w-full h-20 sm:h-24 object-cover rounded-lg border-2 border-purple-200 group-hover:shadow-md transition-all duration-200"
                                            />
                                            <Button
                                              onClick={(e) => {
                                                e.stopPropagation(); // tránh trigger click mở input
                                                removeFile(index);
                                              }}
                                              className="absolute -top-2 -right-2 w-7 h-9 flex items-center justify-center
                                                        bg-white border-2 border-red-500 text-red-500 rounded-full
                                                        hover:bg-red-500 hover:text-white transition-colors shadow-md"
                                              aria-label={`Xóa hình ảnh ${file.file.name}`}
                                            >
                                              <X className="w-4 h-4" />
                                            </Button>


                                          </div>
                                        ))}

                                        {/* Nút thêm ảnh */}
                                        {selectedFiles.length < 5 && (
                                          <div className="flex items-center justify-center border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition cursor-pointer">
                                            <Plus className="h-6 w-6 text-purple-500" />
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <Input
                                      ref={fileInputRef}
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleFileChange}
                                      disabled={isSubmitting}
                                    />
                                  </div>

                                  {errors.files && (
                                    <p className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                                      {errors.files}
                                    </p>
                                  )}
                                </div>


                                {/* Auth Error */}
                                {errors.auth && (
                                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-500 text-sm font-medium">
                                      {errors.auth}
                                    </p>
                                  </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-4">
                                  <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  >
                                    {isSubmitting ? (
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-t-white border-gray-300 rounded-full animate-spin"></div>
                                        <span>Đang gửi...</span>
                                      </div>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Gửi đánh giá
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
                <CardContent className="p-4 sm:p-6">
                  {isLoadingComments ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-purple-700 text-sm sm:text-base font-medium">
                        Đang tải bình luận...
                      </p>
                    </div>
                  ) : commentsError ? (
                    <div className="text-center py-12">
                      <p className="text-red-500 text-sm sm:text-base font-medium bg-red-50 p-4 rounded-lg border border-red-200">
                        {commentsError}
                      </p>
                    </div>
                  ) : paginatedComments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-sm sm:text-base font-medium">
                        {selectedFilter === null
                          ? "Chưa có bình luận nào cho sản phẩm này."
                          : `Không có bình luận ${selectedFilter} sao.`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {paginatedComments.map((comment) => (
                        <div
                          key={comment.maBinhLuan}
                          className="bg-white rounded-xl p-4 sm:p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                              <img
                                src={`${API_URL}${comment.avt}`}
                                alt={comment.hoTen}
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-200"
                                onError={(e) =>
                                (e.currentTarget.src =
                                  "https://via.placeholder.com/48?text=User")
                                }
                              />
                              <div>
                                <p className="text-sm font-bold text-purple-700">
                                  {comment.hoTen}
                                </p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i <= comment.danhGia
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                          }`}
                                        aria-hidden="true"
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs sm:text-sm font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                                    {getRatingText(comment.danhGia)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(comment.ngayTao).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <p className="text-gray-800 font-bold text-sm sm:text-base mb-2">
                            {comment.tieuDe}
                          </p>
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                            {comment.noiDung}
                          </p>
                          {comment.medias.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                              {comment.medias
                                .filter(
                                  (media) => media.loaiMedia === "image" && media.trangThai === 1
                                )
                                .map((media) => (
                                  <div key={media.maMedia} className="relative group">
                                    <img
                                      src={`${API_URL}${media.duongDan}`}
                                      alt={
                                        media.altMedia ||
                                        `Hình ảnh bình luận ${comment.maBinhLuan}`
                                      }
                                      className="w-full h-20 sm:h-24 object-cover rounded-lg border border-purple-200 group-hover:scale-105 transition-transform duration-200"
                                      onError={(e) =>
                                      (e.currentTarget.src =
                                        "https://via.placeholder.com/150?text=No+Image")
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {filteredComments.length > currentPage * commentsPerPage && (
                    <div className="text-center mt-6">
                      <Button
                        onClick={handleLoadMore}
                        className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 hover:scale-105"
                      >
                        Xem thêm
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cmt;