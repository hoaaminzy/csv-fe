import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Space, message } from "antd";
import { MdHome } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import {} from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
    <div className="bg-white shadow-[10px_10px_10px_rgba(0,0,0,0.5)]">
      <div className="w-1240 h-[55px] flex items-center justify-between ">
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
          <div>
            <Input placeholder="Tìm kiếm" className="rounded-2xl w-[300px]" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MdHome className="text-[20px]" />
            Trang chủ
          </div>
          <div className="flex items-center gap-2">
            <IoMdNotifications className="text-[20px]" />
            Tin tức
          </div>
          <div className="flex items-center gap-2">
            <Avatar size="large" src={userInfo?.image} />
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {userInfo?.name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
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
