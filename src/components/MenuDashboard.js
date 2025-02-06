import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
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
        label: "Kết quả học tập",
      },
      {
        key: "11",
        label: "Lịch theo tuần",
      },
      {
        key: "12",
        label: "Lịch theo tiến độ",
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
        label: "Chương trình khung",
      },
      {
        key: "19",
        label: "Đăng ký học phần",
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
      style={{
        width: "100%",
      }}
    >
      <Button
        onClick={toggleCollapsed}
        style={{
          marginBottom: 20,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
