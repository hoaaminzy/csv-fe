import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sv from "../images/sv.png";
const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/students/login-student",
        values
      );
      if (response.data.message === "Login successful") {
        const userInfo = {
          student_id: values.student_id,
          name: response.data.data.full_name,
          image: response.data.data.image,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        message.success("Đăng nhập thành công!");
        navigate("/dashboard");
      } else {
        message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-400">
      <div className="hidden sm:block md:w-1/2 bg-white">
        <div className="flex justify-center items-center h-full ">
          <img src={sv} alt="Logo" className="h-200 object-cover" />
        </div>
      </div>

      <div className="w-full  sm:w-full md:w-1/2 p-3 flex justify-center flex-col gap-4 items-center">
        <div>
          <img
            src="https://media.dau.edu.vn/Media/2_SVDAU/Images/logo-csv-dau285fe8505-a-e.png"
            className="w-[350px]"
          />
        </div>
        <Card className="w-full max-w-md shadow-lg rounded-lg">
          <div className="text-center mb-6">
            <Title level={4} className="text-[#044eb7]">
              Sinh viên đăng nhập
            </Title>
          </div>

          <Form form={form} layout="vertical" onFinish={handleLogin}>
            <Form.Item
              name="student_id"
              label="Mã số sinh viên"
              rules={[
                { required: true, message: "Vui lòng nhập mã số sinh viên!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập mã số sinh viên"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#005ab7]"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
