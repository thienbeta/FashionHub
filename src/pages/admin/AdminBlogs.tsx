import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/pages/ui/dialog";
import { Button } from "@/pages/ui/button";
import { Input } from "@/pages/ui/input";
import { Label } from "@/pages/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/pages/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/pages/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/pages/ui/card";
import Swal from "sweetalert2";
import {
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Search,
  X,
  Plus,
  Loader,
  Save,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle,
  RotateCcw,
  BarChart,
  Filter,
} from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/pages/ui/tabs";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Định nghĩa các interface cho dữ liệu blog và hình ảnh
interface BlogView {
  maBlog: number;
  tieuDe: string;
  moTa: string;
  duongDan: string;
  noiDung: string;
  trangThai: number;
  ngayTao: string;
  luotXem: number;
  like: number;
  share: number;
  noiBat: number;
  tuKhoa: string;
  maNguoiDung: string;
  maSanPham: string;
  maComBo: number;
  hinhAnhs: string[]; // Base64 strings
}

interface BlogCreate {
  tieuDe: string;
  moTa: string;
  duongDan: string;
  noiDung: string;
  trangThai: number;
  tuKhoa: string;
  noiBat: number;
  maNguoiDung: string;
  maSanPham: string;
  maComBo: number;
  hinhAnhs: string[]; // Base64 strings
}

interface BlogEdit {
  maBlog: number;
  tieuDe: string;
  moTa: string;
  duongDan: string;
  noiDung: string;
  trangThai: number;
  tuKhoa: string;
  noiBat: number;
  maNguoiDung: string;
  maSanPham: string;
  maComBo: number;
  hinhAnhs: string[]; // Base64 strings
}

interface ImageData {
  data: string; // Base64 string
  anhAlt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5261";
const DEFAULT_IMAGE = "https://gockienthuc.edu.vn/wp-content/uploads/2024/07/hinh-anh-avatar-trang-mac-dinh-doc-dao-khong-lao-nhao_6690f0076072b.webp";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [highlightFilter, setHighlightFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("danhSachBaiViet");
  const pageSize = 10; // 10 blogs per page
  const [openModal, setOpenModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmStatusModalOpen, setConfirmStatusModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<"hide" | "restore" | "delete" | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogView | null>(null);
  const [newStatus, setNewStatus] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newBlog, setNewBlog] = useState<BlogCreate>({
    tieuDe: "",
    moTa: "",
    duongDan: "",
    noiDung: "",
    trangThai: 1, // Default to Hoạt động
    tuKhoa: "",
    noiBat: 0,
    maNguoiDung: "",
    maSanPham: "",
    maComBo: 0,
    hinhAnhs: [],
  });
  const [editBlog, setEditBlog] = useState<BlogEdit | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stats, setStats] = useState({
    totalBlogs: 0,
    activeBlogs: 0,
    inactiveBlogs: 0,
    hiddenBlogs: 0,
    highlightedBlogs: 0,
  });
  const [images, setImages] = useState<ImageData[]>([{ data: "", anhAlt: "" }]); // Default with one image slot
  const [editImages, setEditImages] = useState<ImageData[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Lấy userId từ localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setNewBlog(prev => ({ ...prev, maNguoiDung: storedUserId }));
    } else {
      setError("Vui lòng đăng nhập để quản lý bài viết");
    }
  }, []);

  // Hàm chuyển byte[] thành Base64 string
  const byteArrayToBase64 = (byteArray: string): string => {
    try {
      const binaryString = atob(byteArray);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const base64String = btoa(String.fromCharCode(...bytes));
      return `data:image/png;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting byte array to Base64:", error);
      return DEFAULT_IMAGE;
    }
  };

  // Hàm chuyển Base64 string thành byte[] (loại bỏ prefix)
  const base64ToByteArray = (base64: string): string => {
    try {
      // Loại bỏ tiền tố "data:image/...;base64," nếu có
      const base64Data = base64.includes("base64,") ? base64.split("base64,")[1] : base64;
      return base64Data;
    } catch (error) {
      console.error("Error converting Base64 to byte array:", error);
      throw new Error("Invalid Base64 string");
    }
  };

  // Hàm lấy danh sách blog từ API
  const fetchBlogs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/Blog`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        console.log("API Response:", text);
        throw new Error(`Lỗi khi tải danh sách bài viết: ${response.status} ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.log("Non-JSON Response:", text);
        throw new Error("Phản hồi không phải JSON");
      }
      const data: BlogView[] = await response.json();
      // Chuyển byte[] thành Base64 để hiển thị
      const processedData = data.map(blog => ({
        ...blog,
        hinhAnhs: blog.hinhAnhs.map(h => byteArrayToBase64(h))
      }));
      setBlogs(processedData);

      setStats({
        totalBlogs: processedData.length,
        activeBlogs: processedData.filter((blog) => blog.trangThai === 1).length,
        inactiveBlogs: processedData.filter((blog) => blog.trangThai === 0).length,
        hiddenBlogs: processedData.filter((blog) => blog.trangThai === 2).length,
        highlightedBlogs: processedData.filter((blog) => blog.noiBat === 1).length,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = [blog.tieuDe, blog.moTa, blog.noiDung, blog.tuKhoa].some((field) =>
      field?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let matchesStatus = true;
    if (activeTab === "danhSachBaiViet") {
      matchesStatus = blog.trangThai === 0 || blog.trangThai === 1;
      if (statusFilter !== "all") {
        matchesStatus =
          statusFilter === "active" ? blog.trangThai === 1 :
          statusFilter === "inactive" ? blog.trangThai === 0 : false;
      }
    } else if (activeTab === "khoiPhuc") {
      matchesStatus = blog.trangThai === 2;
      if (statusFilter !== "all") {
        matchesStatus = statusFilter === "hidden" ? blog.trangThai === 2 : false;
      }
    }

    const matchesHighlight =
      highlightFilter === "all" ||
      (highlightFilter === "highlighted" && blog.noiBat === 1) ||
      (highlightFilter === "notHighlighted" && blog.noiBat === 0);

    return matchesSearch && matchesStatus && matchesHighlight;
  });

  const sortedBlogs = filteredBlogs.sort(
    (a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
  );

  const totalPages = Math.ceil(sortedBlogs.length / pageSize);
  const currentBlogs = sortedBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusChartData = {
    labels: ["Hoạt động", "Không hoạt động", "Ẩn"],
    datasets: [
      {
        label: "Số bài viết",
        data: [stats.activeBlogs, stats.inactiveBlogs, stats.hiddenBlogs],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const highlightChartData = {
    labels: ["Nổi bật", "Không nổi bật"],
    datasets: [
      {
        data: [stats.highlightedBlogs, stats.totalBlogs - stats.highlightedBlogs],
        backgroundColor: ["#4BC0C0", "#9966FF"],
      },
    ],
  };

  const validateBlog = (blog: BlogCreate | BlogEdit) => {
    const newErrors: { [key: string]: string } = {};
    if (!blog.tieuDe || blog.tieuDe.length < 5) newErrors.tieuDe = "Tiêu đề phải dài hơn 5 ký tự";
    if (!blog.noiDung) newErrors.noiDung = "Nội dung là bắt buộc";
    return newErrors;
  };

  const validateImages = (images: ImageData[]) => {
    const newErrors: { [key: string]: string } = {};
    images.forEach((image, index) => {
      if (!image.data) newErrors[`image_${index}`] = `Hình ảnh ${index + 1} là bắt buộc`;
      if (!image.anhAlt) newErrors[`anhAlt_${index}`] = `Văn bản thay thế cho hình ảnh ${index + 1} là bắt buộc`;
    });
    return newErrors;
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng đăng nhập để thêm bài viết",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    const blogErrors = validateBlog(newBlog);
    const imageErrors = validateImages(images);
    const allErrors = { ...blogErrors, ...imageErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    try {
      const blogToSubmit = {
        ...newBlog,
        hinhAnhs: images.map(img => base64ToByteArray(img.data))
      };
      const response = await fetch(`${API_URL}/api/Blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(blogToSubmit),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Lỗi khi thêm bài viết");
      }
      await fetchBlogs();
      setOpenModal(false);
      setNewBlog({
        tieuDe: "",
        moTa: "",
        duongDan: "",
        noiDung: "",
        trangThai: 1,
        tuKhoa: "",
        noiBat: 0,
        maNguoiDung: userId || "",
        maSanPham: "",
        maComBo: 0,
        hinhAnhs: [],
      });
      setImages([{ data: "", anhAlt: "" }]);
      setErrors({});
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm bài viết thành công",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message || "Lỗi khi thêm bài viết",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBlog) return;

    const blogErrors = validateBlog(editBlog);
    const imageErrors = validateImages(editImages);
    const allErrors = { ...blogErrors, ...imageErrors };
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setLoading(true);
    try {
      const blogToSubmit = {
        ...editBlog,
        hinhAnhs: editImages.map(img => base64ToByteArray(img.data))
      };
      const response = await fetch(`${API_URL}/api/Blog/${editBlog.maBlog}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(blogToSubmit),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Lỗi khi cập nhật bài viết");
      }
      await fetchBlogs();
      setEditModalOpen(false);
      setEditBlog(null);
      setEditImages([]);
      setErrors({});
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật bài viết thành công",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message || "Lỗi khi cập nhật bài viết",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const performAction = async () => {
    if (!selectedBlog || !confirmationAction) return;

    setLoading(true);
    try {
      if (confirmationAction === "hide") {
        const updatedBlog: BlogEdit = {
          ...selectedBlog,
          trangThai: 2,
          hinhAnhs: selectedBlog.hinhAnhs.map(h => base64ToByteArray(h))
        };
        const response = await fetch(`${API_URL}/api/Blog/${selectedBlog.maBlog}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedBlog),
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Lỗi khi ẩn bài viết");
        }
      } else if (confirmationAction === "restore") {
        const updatedBlog: BlogEdit = {
          ...selectedBlog,
          trangThai: 0,
          hinhAnhs: selectedBlog.hinhAnhs.map(h => base64ToByteArray(h))
        };
        const response = await fetch(`${API_URL}/api/Blog/${selectedBlog.maBlog}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedBlog),
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Lỗi khi khôi phục bài viết");
        }
      } else if (confirmationAction === "delete") {
        const response = await fetch(`${API_URL}/api/Blog/${selectedBlog.maBlog}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Lỗi khi xóa bài viết");
        }
      }
      await fetchBlogs();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Đã ${
          confirmationAction === "hide" ? "ẩn" :
          confirmationAction === "restore" ? "khôi phục" : "xóa vĩnh viễn"
        } bài viết thành công`,
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
      setConfirmationOpen(false);
      setSelectedBlog(null);
      setConfirmationAction(null);
    }
  };

  const openConfirmStatusModal = (blog: BlogView, newStatus: number) => {
    setSelectedBlog(blog);
    setNewStatus(newStatus);
    setConfirmStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedBlog || newStatus === null) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xác định bài viết hoặc trạng thái",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBlog: BlogEdit = {
        ...selectedBlog,
        trangThai: newStatus,
        hinhAnhs: selectedBlog.hinhAnhs.map(h => base64ToByteArray(h))
      };
      const response = await fetch(`${API_URL}/api/Blog/${selectedBlog.maBlog}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedBlog),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Lỗi khi cập nhật trạng thái");
      }
      await fetchBlogs();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật trạng thái thành công",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: (err as Error).message || "Lỗi khi cập nhật trạng thái",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
      setConfirmStatusModalOpen(false);
      setSelectedBlog(null);
      setNewStatus(null);
    }
  };

  const openViewModal = (blog: BlogView) => {
    setSelectedBlog(blog);
    setViewModalOpen(true);
  };

  const openEditModal = (blog: BlogView) => {
    setEditBlog({
      maBlog: blog.maBlog,
      tieuDe: blog.tieuDe,
      moTa: blog.moTa,
      duongDan: blog.duongDan,
      noiDung: blog.noiDung,
      trangThai: blog.trangThai,
      tuKhoa: blog.tuKhoa,
      noiBat: blog.noiBat,
      maNguoiDung: blog.maNguoiDung,
      maSanPham: blog.maSanPham,
      maComBo: blog.maComBo,
      hinhAnhs: blog.hinhAnhs
    });
    setEditImages(blog.hinhAnhs.map(h => ({
      data: h,
      anhAlt: "Hình ảnh blog" // Mặc định vì không còn trường anhAlt trong model mới
    })));
    setErrors({});
    setEditModalOpen(true);
  };

  const openConfirmation = (blog: BlogView, action: "hide" | "restore" | "delete") => {
    setSelectedBlog(blog);
    setConfirmationAction(action);
    setConfirmationOpen(true);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN")}`;
  };

  // Image handling
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, setImagesFn: React.Dispatch<React.SetStateAction<ImageData[]>>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagesFn(prev => {
            const newImages = [...prev];
            const firstEmptyIndex = newImages.findIndex(img => !img.data);
            if (firstEmptyIndex !== -1) {
              newImages[firstEmptyIndex] = { data: reader.result as string, anhAlt: newImages[firstEmptyIndex].anhAlt };
            } else {
              newImages.push({ data: reader.result as string, anhAlt: "" });
            }
            return newImages;
          });
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng chọn file hình ảnh",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setImagesFn: React.Dispatch<React.SetStateAction<ImageData[]>>, index: number) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagesFn(prev => {
          const newImages = [...prev];
          newImages[index] = { ...newImages[index], data: reader.result as string };
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn file hình ảnh",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleImageClick = (id: string) => {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const addImageSlot = (setImagesFn: React.Dispatch<React.SetStateAction<ImageData[]>>) => {
    setImagesFn(prev => [...prev, { data: "", anhAlt: "" }]);
  };

  const removeImage = (index: number, setImagesFn: React.Dispatch<React.SetStateAction<ImageData[]>>) => {
    setImagesFn(prev => prev.filter((_, i) => i !== index));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`image_${index}`];
      delete newErrors[`anhAlt_${index}`];
      return newErrors;
    });
  };

  const updateImageAlt = (index: number, value: string, setImagesFn: React.Dispatch<React.SetStateAction<ImageData[]>>) => {
    setImagesFn(prev => prev.map((img, i) => i === index ? { ...img, anhAlt: value } : img));
    setErrors(prev => {
      const newErrors = { ...prev };
      if (value) delete newErrors[`anhAlt_${index}`];
      return newErrors;
    });
  };

  if (!userId) return <div className="text-center py-10 text-red-500">Vui lòng đăng nhập để quản lý bài viết</div>;
  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="py-6 space-y-6 container mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">Quản Lý Bài Viết Blog</h1>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-crocus-500 hover:bg-crocus-600 text-white">
              <Plus className="h-4 w-4 mr-2" /> Thêm Bài Viết
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm Bài Viết Mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBlog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tieuDe">Tiêu Đề</Label>
                  <Input
                    id="tieuDe"
                    placeholder="Nhập tiêu đề"
                    value={newBlog.tieuDe}
                    onChange={(e) => setNewBlog({ ...newBlog, tieuDe: e.target.value })}
                    required
                  />
                  {errors.tieuDe && <p className="text-red-500 text-sm mt-1">{errors.tieuDe}</p>}
                </div>
                <div>
                  <Label htmlFor="moTa">Mô Tả</Label>
                  <Input
                    id="moTa"
                    placeholder="Nhập mô tả"
                    value={newBlog.moTa}
                    onChange={(e) => setNewBlog({ ...newBlog, moTa: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duongDan">Đường Dẫn</Label>
                  <Input
                    id="duongDan"
                    placeholder="Nhập đường dẫn"
                    value={newBlog.duongDan}
                    onChange={(e) => setNewBlog({ ...newBlog, duongDan: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="trangThai">Trạng Thái</Label>
                  <select
                    id="trangThai"
                    value={newBlog.trangThai}
                    onChange={(e) => setNewBlog({ ...newBlog, trangThai: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="noiBat">Nổi Bật</Label>
                  <select
                    id="noiBat"
                    value={newBlog.noiBat}
                    onChange={(e) => setNewBlog({ ...newBlog, noiBat: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                  >
                    <option value={0}>Không nổi bật</option>
                    <option value={1}>Nổi bật</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tuKhoa">Từ Khóa</Label>
                  <Input
                    id="tuKhoa"
                    placeholder="Nhập từ khóa"
                    value={newBlog.tuKhoa}
                    onChange={(e) => setNewBlog({ ...newBlog, tuKhoa: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="noiDung">Nội Dung</Label>
                  <textarea
                    id="noiDung"
                    placeholder="Nhập nội dung"
                    value={newBlog.noiDung}
                    onChange={(e) => setNewBlog({ ...newBlog, noiDung: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                    rows={5}
                    required
                  />
                  {errors.noiDung && <p className="text-red-500 text-sm mt-1">{errors.noiDung}</p>}
                </div>
                <div>
                  <Label htmlFor="maNguoiDung">Mã Người Dùng</Label>
                  <Input
                    id="maNguoiDung"
                    value={userId}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="maSanPham">Mã Sản Phẩm</Label>
                  <Input
                    id="maSanPham"
                    placeholder="Nhập mã sản phẩm"
                    value={newBlog.maSanPham}
                    onChange={(e) => setNewBlog({ ...newBlog, maSanPham: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maComBo">Mã Combo</Label>
                  <Input
                    id="maComBo"
                    type="number"
                    placeholder="Nhập mã combo"
                    value={newBlog.maComBo}
                    onChange={(e) => setNewBlog({ ...newBlog, maComBo: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Hình Ảnh</Label>
                  {images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-24 h-24 border-2 border-dashed rounded-lg relative flex items-center justify-center cursor-pointer ${
                          isDragging ? "border-crocus-500 bg-crocus-50" : "border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, setImages)}
                        onClick={() => handleImageClick(`fileInput_new_${index}`)}
                      >
                        {image.data ? (
                          <>
                            <img
                              src={image.data}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index, setImages);
                              }}
                            >
                              X
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm text-center">Kéo hoặc chọn hình ảnh</span>
                        )}
                      </div>
                      <Input
                        placeholder="Nhập văn bản thay thế"
                        value={image.anhAlt}
                        onChange={(e) => updateImageAlt(index, e.target.value, setImages)}
                        className="flex-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id={`fileInput_new_${index}`}
                        onChange={(e) => handleFileChange(e, setImages, index)}
                        className="hidden"
                      />
                      {errors[`image_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`image_${index}`]}</p>
                      )}
                      {errors[`anhAlt_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`anhAlt_${index}`]}</p>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addImageSlot(setImages)}
                    className="bg-crocus-500 hover:bg-crocus-600 text-white w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm hình ảnh
                  </Button>
                </div>
              </div>
              <div className="col-span-2 flex justify-end space-x-2 mt-6">
                <Button type="button" onClick={() => { setOpenModal(false); setImages([{ data: "", anhAlt: "" }]); }} disabled={loading} variant="outline">
                  <X className="h-4 w-4 mr-2" /> Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" /> Đang lưu...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Thêm
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 gap-1">
          <TabsTrigger value="danhSachBaiViet" className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Danh sách bài viết
          </TabsTrigger>
          <TabsTrigger value="khoiPhuc" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Khôi phục
          </TabsTrigger>
          <TabsTrigger value="thongKe" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Thống kê
          </TabsTrigger>
        </TabsList>

        <TabsContent value="danhSachBaiViet">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={highlightFilter}
                onChange={(e) => setHighlightFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả nổi bật</option>
                <option value="highlighted">Nổi bật</option>
                <option value="notHighlighted">Không nổi bật</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="w-[100px]">Hình Ảnh</TableHead>
                  <TableHead>Tiêu Đề</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Nổi Bật</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="w-[120px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog, index) => (
                    <TableRow key={blog.maBlog} className="hover:bg-muted/50">
                      <TableCell align="center">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                      <TableCell align="center">
                        <img
                          src={blog.hinhAnhs[0] || DEFAULT_IMAGE}
                          alt="Blog Image"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>{blog.tieuDe}</TableCell>
                      <TableCell>{blog.moTa || "Chưa có mô tả"}</TableCell>

                      <TableCell>{blog.noiBat === 1 ? "Nổi bật" : "Không nổi bật"}</TableCell>
                      <TableCell>{formatDateTime(blog.ngayTao)}</TableCell>
                                            <TableCell>
                        <label className="relative inline-block w-[60px] h-[34px]">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            checked={blog.trangThai === 1}
                            onChange={(e) => openConfirmStatusModal(blog, e.target.checked ? 1 : 0)}
                            disabled={isSubmitting}
                          />
                          <span
                            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                              before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                              before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                              ${blog.trangThai === 1 ? "bg-crocus-500 before:translate-x-[26px]" : "bg-gray-400"}
                              hover:scale-110 shadow-sm hover:shadow-md`}
                          ></span>
                          <span className="sr-only">
                            {blog.trangThai === 1 ? "Hoạt động" : blog.trangThai === 0 ? "Không hoạt động" : "Ẩn"}
                          </span>
                        </label>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewModal(blog)} className="text-green-700">
                              <Eye className="mr-2 h-4 w-4" /> Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(blog)} className="text-blue-700">
                              <Edit className="mr-2 h-4 w-4" /> Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openConfirmation(blog, "hide")}
                              className="text-red-700"
                            >
                              <Trash className="mr-2 h-4 w-4" /> Ẩn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy bài viết nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {currentBlogs.map((blog) => (
              <Card key={blog.maBlog}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog.hinhAnhs[0] || DEFAULT_IMAGE}
                        alt="Blog Image"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <span>{blog.tieuDe}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(blog)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(blog)}>
                          <Edit className="mr-2 h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openConfirmation(blog, "hide")}>
                          <Trash className="mr-2 h-4 w-4" /> Ẩn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <div className="text-sm text-muted-foreground">{blog.moTa || "Chưa có mô tả"}</div>
                  <div className="flex justify-between text-sm">
                    <span>{formatDateTime(blog.ngayTao)}</span>
                    <label className="relative inline-block w-[60px] h-[34px]">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        checked={blog.trangThai === 1}
                        onChange={(e) => openConfirmStatusModal(blog, e.target.checked ? 1 : 0)}
                        disabled={isSubmitting}
                      />
                      <span
                        className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                          before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                          before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                          ${blog.trangThai === 1 ? "bg-crocus-500 before:translate-x-[26px]" : "bg-gray-400"}
                          hover:scale-110 shadow-sm hover:shadow-md`}
                      ></span>
                      <span className="sr-only">
                        {blog.trangThai === 1 ? "Hoạt động" : blog.trangThai === 0 ? "Không hoạt động" : "Ẩn"}
                      </span>
                    </label>
                  </div>
                  <div className="text-sm">{blog.noiBat === 1 ? "Nổi bật" : "Không nổi bật"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="khoiPhuc">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-8 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả trạng thái</option>
              </select>
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <select
                value={highlightFilter}
                onChange={(e) => setHighlightFilter(e.target.value)}
                className="border rounded-md p-2 pl-8"
              >
                <option value="all">Tất cả nổi bật</option>
                <option value="highlighted">Nổi bật</option>
                <option value="notHighlighted">Không nổi bật</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">STT</TableHead>
                  <TableHead className="w-[100px]">Hình Ảnh</TableHead>
                  <TableHead>Tiêu Đề</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Nổi Bật</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="w-[120px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog, index) => (
                    <TableRow key={blog.maBlog} className="hover:bg-muted/50">
                      <TableCell align="center">{(currentPage - 1) * pageSize + index + 1}</TableCell>
                      <TableCell align="center">
                        <img
                          src={blog.hinhAnhs[0] || DEFAULT_IMAGE}
                          alt="Blog Image"
                          className="w-16 h-16 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>{blog.tieuDe}</TableCell>
                      <TableCell>{blog.moTa || "Chưa có mô tả"}</TableCell>
                      <TableCell>{blog.noiBat === 1 ? "Nổi bật" : "Không nổi bật"}</TableCell>
                      <TableCell>{formatDateTime(blog.ngayTao)}</TableCell>
                                            <TableCell>
                        <label className="relative inline-block w-[60px] h-[34px]">
                          <input
                            type="checkbox"
                            className="opacity-0 w-0 h-0"
                            checked={blog.trangThai === 1}
                            onChange={(e) => openConfirmStatusModal(blog, e.target.checked ? 1 : 2)}
                            disabled={isSubmitting}
                          />
                          <span
                            className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                              before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                              before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                              ${blog.trangThai === 1 ? "bg-crocus-500 before:translate-x-[26px]" : "bg-gray-400"}
                              hover:scale-110 shadow-sm hover:shadow-md`}
                          ></span>
                          <span className="sr-only">Ẩn</span>
                        </label>
                      </TableCell>
                      <TableCell align="center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openViewModal(blog)} className="text-green-700">
                              <Eye className="mr-2 h-4 w-4" /> Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openConfirmation(blog, "restore")}
                              className="text-blue-700"
                            >
                              <RotateCcw className="mr-2 h-4 w-4" /> Khôi phục
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openConfirmation(blog, "delete")}
                              className="text-red-700"
                            >
                              <Trash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Không tìm thấy bài viết nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {currentBlogs.map((blog) => (
              <Card key={blog.maBlog}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog.hinhAnhs[0] || DEFAULT_IMAGE}
                        alt="Blog Image"
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <span>{blog.tieuDe}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(blog)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openConfirmation(blog, "restore")}>
                          <RotateCcw className="mr-2 h-4 w-4" /> Khôi phục
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openConfirmation(blog, "delete")}>
                          <Trash className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1">
                  <div className="text-sm text-muted-foreground">{blog.moTa || "Chưa có mô tả"}</div>
                  <div className="flex justify-between text-sm">
                    <span>{formatDateTime(blog.ngayTao)}</span>
                    <label className="relative inline-block w-[60px] h-[34px]">
                      <input
                        type="checkbox"
                        className="opacity-0 w-0 h-0"
                        checked={blog.trangThai === 1}
                        onChange={(e) => openConfirmStatusModal(blog, e.target.checked ? 1 : 2)}
                        disabled={isSubmitting}
                      />
                      <span
                        className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ease-in-out
                          before:absolute before:h-[30px] before:w-[30px] before:left-[2px] before:bottom-[2px]
                          before:bg-white before:rounded-full before:shadow-md before:transition-all before:duration-300 before:ease-in-out
                          ${blog.trangThai === 1 ? "bg-crocus-500 before:translate-x-[26px]" : "bg-gray-400"}
                          hover:scale-110 shadow-sm hover:shadow-md`}
                      ></span>
                      <span className="sr-only">Ẩn</span>
                    </label>
                  </div>
                  <div className="text-sm">{blog.noiBat === 1 ? "Nổi bật" : "Không nổi bật"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="thongKe">
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Thống kê bài viết</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Tổng số bài viết</h3>
                <p className="text-2xl font-bold">{stats.totalBlogs}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Bài viết hoạt động</h3>
                <p className="text-2xl font-bold">{stats.activeBlogs}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold">Bài viết nổi bật</h3>
                <p className="text-2xl font-bold">{stats.highlightedBlogs}</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Biểu đồ thống kê</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Số bài viết theo trạng thái</h3>
                <Bar data={statusChartData} options={{ responsive: true }} />
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Tỷ lệ bài viết nổi bật</h3>
                <div style={{ height: "300px" }}>
                  <Pie data={highlightChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Trước
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              className={currentPage === page ? "bg-crocus-500 text-white hover:bg-crocus-600" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            className="flex items-center"
          >
            Sau <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi Tiết Bài Viết</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Tiêu Đề</Label>
                  <Input value={selectedBlog.tieuDe} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Mô Tả</Label>
                  <Input value={selectedBlog.moTa || "Chưa có mô tả"} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Đường Dẫn</Label>
                  <Input value={selectedBlog.duongDan || "Chưa có đường dẫn"} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Trạng Thái</Label>
                  <Input
                    value={
                      selectedBlog.trangThai === 1 ? "Hoạt động" :
                      selectedBlog.trangThai === 0 ? "Không hoạt động" : "Ẩn"
                    }
                    disabled
                    className="text-black border-2 border-crocus-500"
                  />
                </div>
                <div>
                  <Label>Nổi Bật</Label>
                  <Input
                    value={selectedBlog.noiBat === 1 ? "Nổi bật" : "Không nổi bật"}
                    disabled
                    className="text-black border-2 border-crocus-500"
                  />
                </div>
                <div>
                  <Label>Hình Ảnh</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.hinhAnhs.length > 0 ? (
                      selectedBlog.hinhAnhs.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Hình ảnh ${index + 1}`}
                          className="w-24 h-24 rounded-md object-cover"
                        />
                      ))
                    ) : (
                      <p className="text-muted-foreground">Không có hình ảnh</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Nội Dung</Label>
                  <textarea
                    value={selectedBlog.noiDung}
                    disabled
                    className="w-full p-2 border rounded text-black border-2 border-crocus-500"
                    rows={5}
                  />
                </div>
                <div>
                  <Label>Từ Khóa</Label>
                  <Input value={selectedBlog.tuKhoa || "Chưa có từ khóa"} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Mã Người Dùng</Label>
                  <Input value={selectedBlog.maNguoiDung} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Mã Sản Phẩm</Label>
                  <Input value={selectedBlog.maSanPham || "Chưa có mã sản phẩm"} disabled className="text-black border-2 border-crocus-500" />
                </div>
                <div>
                  <Label>Ngày Tạo</Label>
                  <Input value={formatDateTime(selectedBlog.ngayTao)} disabled className="text-black border-2 border-crocus-500" />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button type="button" onClick={() => setViewModalOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa Bài Viết</DialogTitle>
          </DialogHeader>
          {editBlog && (
            <form onSubmit={handleEditBlog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tieuDe">Tiêu Đề</Label>
                  <Input
                    id="tieuDe"
                    value={editBlog.tieuDe}
                    onChange={(e) => setEditBlog({ ...editBlog, tieuDe: e.target.value })}
                    required
                  />
                  {errors.tieuDe && <p className="text-red-500 text-sm mt-1">{errors.tieuDe}</p>}
                </div>
                <div>
                  <Label htmlFor="moTa">Mô Tả</Label>
                  <Input
                    id="moTa"
                    value={editBlog.moTa}
                    onChange={(e) => setEditBlog({ ...editBlog, moTa: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="duongDan">Đường Dẫn</Label>
                  <Input
                    id="duongDan"
                    value={editBlog.duongDan}
                    onChange={(e) => setEditBlog({ ...editBlog, duongDan: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="trangThai">Trạng Thái</Label>
                  <select
                    id="trangThai"
                    value={editBlog.trangThai}
                    onChange={(e) => setEditBlog({ ...editBlog, trangThai: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="noiBat">Nổi Bật</Label>
                  <select
                    id="noiBat"
                    value={editBlog.noiBat}
                    onChange={(e) => setEditBlog({ ...editBlog, noiBat: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                  >
                    <option value={0}>Không nổi bật</option>
                    <option value={1}>Nổi bật</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tuKhoa">Từ Khóa</Label>
                  <Input
                    id="tuKhoa"
                    value={editBlog.tuKhoa}
                    onChange={(e) => setEditBlog({ ...editBlog, tuKhoa: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="noiDung">Nội Dung</Label>
                  <textarea
                    id="noiDung"
                    value={editBlog.noiDung}
                    onChange={(e) => setEditBlog({ ...editBlog, noiDung: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-crocus-500"
                    rows={5}
                    required
                  />
                  {errors.noiDung && <p className="text-red-500 text-sm mt-1">{errors.noiDung}</p>}
                </div>
                <div>
                  <Label htmlFor="maNguoiDung">Mã Người Dùng</Label>
                  <Input
                    id="maNguoiDung"
                    value={editBlog.maNguoiDung}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="maSanPham">Mã Sản Phẩm</Label>
                  <Input
                    id="maSanPham"
                    value={editBlog.maSanPham}
                    onChange={(e) => setEditBlog({ ...editBlog, maSanPham: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maComBo">Mã Combo</Label>
                  <Input
                    id="maComBo"
                    type="number"
                    value={editBlog.maComBo}
                    onChange={(e) => setEditBlog({ ...editBlog, maComBo: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Hình Ảnh</Label>
                  {editImages.map((image, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-24 h-24 border-2 border-dashed rounded-lg relative flex items-center justify-center cursor-pointer ${
                          isDragging ? "border-crocus-500 bg-crocus-50" : "border-gray-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, setEditImages)}
                        onClick={() => handleImageClick(`fileInput_edit_${index}`)}
                      >
                        {image.data ? (
                          <>
                            <img
                              src={image.data}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index, setEditImages);
                              }}
                            >
                              X
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm text-center">Kéo hoặc chọn hình ảnh</span>
                        )}
                      </div>
                      <Input
                        placeholder="Nhập văn bản thay thế"
                        value={image.anhAlt}
                        onChange={(e) => updateImageAlt(index, e.target.value, setEditImages)}
                        className="flex-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        id={`fileInput_edit_${index}`}
                        onChange={(e) => handleFileChange(e, setEditImages, index)}
                        className="hidden"
                      />
                      {errors[`image_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`image_${index}`]}</p>
                      )}
                      {errors[`anhAlt_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`anhAlt_${index}`]}</p>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => addImageSlot(setEditImages)}
                    className="bg-crocus-500 hover:bg-crocus-600 text-white w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Thêm hình ảnh
                  </Button>
                </div>
              </div>
              <div className="col-span-2 flex justify-end space-x-2 mt-6">
                <Button type="button" onClick={() => { setEditModalOpen(false); setEditImages([]); }} disabled={loading} variant="outline">
                  <X className="h-4 w-4 mr-2" /> Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Cập nhật
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="p-6">
          <DialogTitle>
            {confirmationAction === "hide" && "Xác nhận ẩn bài viết"}
            {confirmationAction === "restore" && "Xác nhận khôi phục bài viết"}
            {confirmationAction === "delete" && "Xác nhận xóa vĩnh viễn bài viết"}
          </DialogTitle>
          <p>
            Bạn có chắc chắn muốn {confirmationAction === "hide" ? "ẩn" :
            confirmationAction === "restore" ? "khôi phục" : "xóa vĩnh viễn"} bài viết này không?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" onClick={() => setConfirmationOpen(false)} variant="outline">
              <XCircle className="w-4 h-4 mr-2" /> Hủy
            </Button>
            <Button type="button" onClick={performAction} variant="destructive">
              <CheckCircle className="w-4 h-4 mr-2" /> Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmStatusModalOpen} onOpenChange={setConfirmStatusModalOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
          </DialogHeader>
          <p>
            Bạn có chắc chắn muốn {newStatus === 1 ? "kích hoạt" : newStatus === 0 ? "vô hiệu hóa" : "ẩn"} bài viết{" "}
            <strong>{selectedBlog?.tieuDe}</strong> không?
          </p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button type="button" onClick={() => setConfirmStatusModalOpen(false)} disabled={isSubmitting} variant="outline">
              <XCircle className="h-4 w-4 mr-2" /> Hủy
            </Button>
            <Button type="button" onClick={confirmStatusChange} disabled={isSubmitting}>
              <CheckCircle className="h-4 w-4 mr-2" /> {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogs;