import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const handleLogin = async (values) => {
    try {
      // Gửi thông tin đăng nhập đến API

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
      console.error("Error:", error);
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div
        className="bg-[#005ab7] h-[100px] flex items-center justify-center"
        style={{ boxShadow: "0px 1px 5px 2px rgb(191, 211, 222)" }}
      >
        <img
          src="https://media.dau.edu.vn/Media/2_SVDAU/Images/logo-csv-dau285fe8505-a-e.png"
          className="w-[500px]"
        />
      </div>
      <div className="flex justify-between p-3">
        <div className="w-[80%]"></div>
        <div className="w-[20%]">
          <div className="bg-white p-1">
            <div
              className="h-[630px] px-4 flex flex-col justify-center items-center"
              style={{
                backgroundSize: "cover",
                background:
                  "url('https://sinhvien.dau.edu.vn/Content/loginnews/images/backgroundform.jpg') center center no-repeat",
              }}
            >
              <img
                src="https://sinhvien.dau.edu.vn/Content/loginnews/images/congthongtinsinhvien.png"
                alt=""
              />
              <h4 className="text-[#044eb7] block py-3">Đăng nhập hệ thống</h4>
              <Form
                form={form}
                onFinish={handleLogin}
                className="w-full flex flex-col items-center"
              >
                <Form.Item
                  name="student_id"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã số sinh viên!",
                    },
                  ]}
                >
                  <Input
                    className="py-3 w-full"
                    placeholder="Nhập mã số sinh viên"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    className="py-3 w-full"
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ padding: "30px 0px " }}
                  className="w-full  rounded-md  font-bold bg-orange-400"
                >
                  Đăng nhập
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
