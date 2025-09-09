import { Input } from "@/pages/ui/input";
import { Button } from "@/pages/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/pages/ui/dialog";
import { X } from "lucide-react";

interface SanPham {
  maSanPham: number;
  tenSanPham: string;
  moTa: string | null;
  slug: string | null;
  chatLieu: string | null;
  gioiTinh: number;
  maLoai: number;
  tenLoai: string | null;
  maThuongHieu: number;
  tenThuongHieu: string | null;
  maHashtag: number | null;
  tenHashtag: string | null;
  ngayTao: string;
  trangThai: number;
  medias: {
    maMedia: number;
    loaiMedia: string;
    duongDan: string;
    altMedia: string | null;
    linkMedia: string | null;
    ngayTao: string;
    trangThai: number;
    maSanPham: number;
    tenSanPham: string;
  }[];
}

interface BienThe {
  maBienThe: number;
  maSanPham: number;
  giaBan: number;
  giaNhap: number | null;
  soLuongNhap: number;
  soLuongBan: number;
  maMau: number;
  tenMau: string | null;
  maKichThuoc: number;
  tenKichThuoc: string | null;
  maVach: string | null;
  khuyenMai: number | null;
  giaTri: number | null;
  hinhAnh: string | null;
  trangThai: number;
  ngayTao: string;
}

interface ChiTietSanPhamProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sanPhamChiTiet: SanPham | null;
  bienTheList: BienThe[] | null;
  isProcessing: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5083";

const ChiTietSanPham: React.FC<ChiTietSanPhamProps> = ({
  open,
  onOpenChange,
  sanPhamChiTiet,
  bienTheList,
  isProcessing,
}) => {
  const getGioiTinhText = (gioiTinh: number | undefined) => {
    switch (gioiTinh) {
      case 0:
        return "Mặc định";
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      case 3:
        return "Khác";
      default:
        return "Không xác định";
    }
  };

  const calculateGiaTri = (giaBan: number, khuyenMai: number | null) => {
    if (khuyenMai !== null && khuyenMai >= 0 && khuyenMai <= 100) {
      return (giaBan - (giaBan * khuyenMai) / 100).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
    return giaBan.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl bg-white rounded-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-gray-800">Chi Tiết Sản Phẩm</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết của sản phẩm và các biến thể liên quan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {/* Tên Sản Phẩm */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Tên Sản Phẩm
            </label>
            <Input
              value={sanPhamChiTiet?.tenSanPham || "Không xác định"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Loại Sản Phẩm và Thương Hiệu */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Loại Sản Phẩm
            </label>
            <Input
              value={sanPhamChiTiet?.tenLoai || "Không xác định"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Thương Hiệu
            </label>
            <Input
              value={sanPhamChiTiet?.tenThuongHieu || "Không xác định"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Hashtag và Giới Tính */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Hashtag
            </label>
            <Input
              value={sanPhamChiTiet?.tenHashtag || "Không có"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Giới Tính
            </label>
            <Input
              value={sanPhamChiTiet ? getGioiTinhText(sanPhamChiTiet.gioiTinh) : "Không xác định"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Chất Liệu */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Chất Liệu
            </label>
            <Input
              value={sanPhamChiTiet?.chatLieu || "Không xác định"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          {/* Hình Ảnh */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Hình Ảnh
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {sanPhamChiTiet?.medias?.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {sanPhamChiTiet.medias
                    .filter((media) => media.loaiMedia === "image" && media.trangThai === 1)
                    .map((media, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`${API_URL}${media.duongDan}`}
                          alt={media.altMedia || sanPhamChiTiet.tenSanPham}
                          className="h-24 w-full object-cover rounded"
                          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Không có hình ảnh</p>
              )}
            </div>
          </div>

          {/* Biến Thể */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Biến Thể
            </label>
            {Array.isArray(bienTheList) && bienTheList.length > 0 ? (
              bienTheList.map((bienThe, index) => (
                <div
                  key={bienThe.maBienThe}
                  className="bg-white shadow-md rounded-lg border-2 border-gray-300 p-4 mb-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                          Màu Sắc
                        </label>
                        <Input
                          value={bienThe.tenMau || "Không xác định"}
                          disabled
                          className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1 row-span-2">
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                          Hình Ảnh
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          {bienThe.hinhAnh ? (
                            <div className="relative mx-auto w-32 sm:w-64">
                              <img
                                src={`${API_URL}${bienThe.hinhAnh}`}
                                alt={`${bienThe.tenKichThuoc} - ${bienThe.tenMau}`}
                                className="h-24 sm:h-48 w-56 object-cover rounded"
                                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image")}
                              />
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Không có hình ảnh</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 rounded-lg border-gray-300">
                      <div className="space-y-4">
                        <div className="border-2 border-gray-300 rounded-md p-4 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Giá Nhập
                              </label>
                              <Input
                                value={
                                  bienThe.giaNhap
                                    ? bienThe.giaNhap.toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    })
                                    : "Không xác định"
                                }
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Kích Thước
                              </label>
                              <Input
                                value={bienThe.tenKichThuoc || "Không xác định"}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Mã Vạch
                              </label>
                              <Input
                                value={bienThe.maVach || "Không có"}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            {bienThe.khuyenMai !== null && (
                              <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                  Giá Trị Sau Khuyến Mãi
                                </label>
                                <Input
                                  value={calculateGiaTri(bienThe.giaBan, bienThe.khuyenMai)}
                                  disabled
                                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                                />
                              </div>
                            )}
                            {bienThe.khuyenMai !== null && (
                              <div>
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                  Khuyến Mãi (%)
                                </label>
                                <Input
                                  value={bienThe.khuyenMai.toString()}
                                  disabled
                                  className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                                />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Giá Bán
                              </label>
                              <Input
                                value={bienThe.giaBan.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Số Lượng Nhập
                              </label>
                              <Input
                                value={bienThe.soLuongNhap.toString()}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Số Lượng Bán
                              </label>
                              <Input
                                value={bienThe.soLuongBan.toString()}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Trạng Thái
                              </label>
                              <Input
                                value={bienThe.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
                                Ngày Tạo
                              </label>
                              <Input
                                value={new Date(bienThe.ngayTao).toLocaleDateString("vi-VN")}
                                disabled
                                className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">Không có biến thể nào để hiển thị.</p>
            )}
          </div>

          {/* Mô Tả */}
          <div className="md:col-span-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              value={sanPhamChiTiet?.moTa || "Không có mô tả"}
              disabled
              className="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md bg-gray-50"
              rows={4}
            />
          </div>

          {/* Trạng Thái và Ngày Tạo */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Trạng Thái
            </label>
            <Input
              value={sanPhamChiTiet?.trangThai === 1 ? "Kích hoạt" : "Vô hiệu hóa"}
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Ngày Tạo
            </label>
            <Input
              value={
                sanPhamChiTiet
                  ? new Date(sanPhamChiTiet.ngayTao).toLocaleDateString("vi-VN")
                  : "Không xác định"
              }
              disabled
              className="text-sm sm:text-base text-black border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm py-2 px-4 rounded-md"
          >
            <X className="h-4 w-4 mr-2" /> Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChiTietSanPham;