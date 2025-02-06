import React from "react";
import { Menu } from "antd";
import { IoMdHome } from "react-icons/io";
import { MdComputer } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa6";
import { HiDocumentCheck } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";

const FixedSidebar = () => {
  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      icon: <IoMdHome />,
      label: <span onClick={() => navigate("/dashboard")}>Trang chủ</span>,
    },
    {
      key: "2",
      icon: <MdComputer />,
      label: (
        <span onClick={() => navigate("/thong-tin-sinh-vien")}>
          Thông tin chung
        </span>
      ),
    },
    {
      key: "sub3",
      icon: <FaGraduationCap />,
      label: "Học tập",
      children: [
        {
          key: "13",
          label: "Kết quả học tập",
        },
        {
          key: "14",
          label: "Lịch theo tuần",
        },
        {
          key: "15",
          label: "Lịch theo tiến độ",
        },
        {
          key: "16",
          label: "Lịch toàn trường",
        },
        {
          key: "17",
          label: "Kết quả rèn luyện",
        },
      ],
    },
    {
      key: "sub1",
      label: "Học phí",
      icon: <FaCcVisa />,
      children: [
        {
          key: "5",
          label: "Tra cứu công nợ",
        },
        {
          key: "6",
          label: "Phiếu thu tổng hợp",
        },
        {
          key: "7",
          label: "Thanh toán trực tuyến",
        },
      ],
    },
    {
      key: "sub2",
      label: "Đăng ký học phần",
      icon: <HiDocumentCheck />,
      children: [
        {
          key: "9",
          label: (
            <Link to="/chuong-trinh-khung">
              <span className="text-black">Chương trình khung</span>
            </Link>
          ),
        },
        {
          key: "10",
          label: "Đăng ký học phần",
        },
      ],
    },
  ];
  return (
    <div>
      <div className="w-[100%] rounded-md bg-white">
        <div
          style={{
            width: "100%",
          }}
        >
          {/* <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{
                  marginBottom: 16,
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button> */}
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="white"
            // inlineCollapsed={collapsed}
            items={items}
          />
        </div>
      </div>
    </div>
  );
};

export default FixedSidebar;
