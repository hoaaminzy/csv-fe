import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { Link } from "react-router-dom";
import { CgMenuGridR } from "react-icons/cg";
const items = [
  {
    key: "1",
    icon: <PieChartOutlined />,
    label: "Trang chủ",
  },

  {
    key: "sub1",
    label: "Thông tin chung",
    icon: <MailOutlined />,
    children: [
      {
        key: "5",
        label: "Thông tin sinh viên",
      },
      {
        key: "6",
        label: "Đề xuất biểu mẫu",
      },
      {
        key: "7",
        label: "Điều xuất cập nhập thông tin",
      },
      {
        key: "8",
        label: "Danh sách hồ sơ cá nhân",
      },
      {
        key: "9",
        label: "Khảo soát sự kiện",
      },
    ],
  },
  {
    key: "sub2",
    label: "Học tập",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "10",
        label: <Link to="/ket-qua-hoc-tap">Kết quả học tập</Link>,
      },
      {
        key: "11",
        label: <Link to="/lich-hoc">Lịch theo tuần</Link>,
      },
      {
        key: "12",
        label: <Link to="/chuong-trinh-khung">Lịch theo tiến độ</Link>,
      },
      {
        key: "13",
        label: "Lịch theo toàn trường",
      },
      {
        key: "14",
        label: "Kết quả rèn luyện",
      },
    ],
  },
  {
    key: "sub3",
    label: "Học phí",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "15",
        label: "Tra cứu công nợ",
      },
      {
        key: "16",
        label: "Phiếu thu tổng hợp",
      },
      {
        key: "17",
        label: "Thanh toán trực tuyến",
      },
    ],
  },
  {
    key: "sub4",
    label: "Đăng ký học phần",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "18",
        label: <Link to="/chuong-trinh-khung">Chương trình khung</Link>,
      },
      {
        key: "19",
        label: <Link to="/dang-ky-hoc-phan">Đăng ký học phần</Link>,
      },
    ],
  },
];
const MenuDashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div
      className="menu-dash hidden sm:block"
      style={{
        width: "100%",
      }}
    >
      <Button
        onClick={toggleCollapsed}
        style={{
          marginBottom: 10,
        }}
      >
        {collapsed ? (
          <CgMenuGridR className="text-[30px]" />
        ) : (
          <CgMenuGridR className="text-[30px]" />
        )}
      </Button>

      {!collapsed && (
        <Menu
          className="rounded-md"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="light"
          inlineCollapsed={collapsed}
          items={items}
        />
      )}
    </div>
  );
};
export default MenuDashboard;
