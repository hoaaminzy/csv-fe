import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Modal } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Space, message } from "antd";
import { MdHome } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import {} from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { Button, Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const itemsMenu = [
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
      icon: <MenuUnfoldOutlined />,
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
      icon: <MenuFoldOutlined />,
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
  const [form] = Form.useForm();
  const [toggleClick, setToggleClick] = useState(false);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setToggleClick(false);
  }, [location]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleClick(false);
      }
    };

    if (toggleClick) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleClick]);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("userInfo");

    message.success("Đăng xuất thành công!");

    navigate("/sinh-vien-dang-nhap");
  };
  const items = [
    {
      label: (
        <span onClick={() => navigate("/thong-tin-sinh-vien")}>
          Thông tin cá nhân
        </span>
      ),
      key: "0",
    },
    {
      label: <span onClick={showModal}>Đổi mật khẩu</span>,
      key: "1",
    },

    {
      label: <span onClick={handleLogout}>Đăng xuất</span>,
      key: "2",
    },
  ];

  const handleSubmit = () => {};
  return (
    <div className=" bg-white shadow-[10px_10px_10px_rgba(0,0,0,0.5)]">
      <div className=" w-1240 h-[55px] flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <div>
            <Link to="/dashboard">
              <img
                src="https://media.dau.edu.vn/Media/2_SVDAU/Images/dau-csv12982278-5-e.png"
                alt=""
                className="w-[250px] object-cover"
              />
            </Link>
          </div>
          <div className="hidden sm:block">
            <Input placeholder="Tìm kiếm" className="rounded-2xl w-[300px]" />
          </div>
        </div>
        <div className="hidden sm:block">
          <div className=" flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MdHome className="text-[20px]" />
              Trang chủ
            </div>
            <div className="flex items-center gap-2">
              <IoMdNotifications className="text-[20px]" />
              Tin tức
            </div>
            <div className="flex items-center gap-2">
              <Avatar
                size="large"
                src={userInfo?.image}
                className="block sm:hidden"
              />
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {userInfo?.name}
                    <FaChevronDown />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="block sm:hidden flex items-center gap-3">
          <div className=" flex items-center gap-2">
            <Avatar
              size="large"
              src={userInfo?.image}
              className="hidden sm:block"
            />
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space className="font-bold ">
                  {userInfo?.name}
                  <FaChevronDown />
                </Space>
              </a>
            </Dropdown>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              setToggleClick(!toggleClick);
            }}
          >
            <IoMenu className="text-[20px] font-bold" />
          </div>
        </div>
        {toggleClick && (
          <div
            // ref={menuRef}
            className="py-5 z-50 fixed top-0 bottom-0 bg-white shadow-2xl left-0"
          >
            <Menu
              className="rounded-md"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              theme="light"
              items={itemsMenu}
            />
          </div>
        )}

        <Modal
          open={isModalOpen}
          onOk={handleOk}
          centered
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Mật khẩu cũ"
              name="password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu mới"
              name="new_password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nhập lại mật khẩu"
              name="confirm_password"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Header;
