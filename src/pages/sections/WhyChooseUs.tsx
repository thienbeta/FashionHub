import React from "react";

const WhyChooseUs = () => {
  const features = [
    {
      title: "Chất Lượng Cao Cấp",
      description: "Được làm từ những chất liệu tốt nhất cho sự thoải mái và độ bền",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      ),
    },
    {
      title: "Giao Hàng Nhanh",
      description: "Vận chuyển nhanh chóng và đổi trả dễ dàng cho tất cả đơn hàng",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      title: "Thời Trang Bền Vững",
      description: "Quy trình và vật liệu thân thiện với môi trường cho một hành tinh tốt đẹp hơn",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      ),
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Tại Sao Chọn Fashion</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center"
          >
            <div className="w-12 h-12 bg-crocus-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-crocus-600"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
