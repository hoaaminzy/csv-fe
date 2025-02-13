import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import HeadingTitle from "./HeadingTitle";
import { Button, Table } from "antd";
import { TiTick } from "react-icons/ti";
import { Navigate, useNavigate } from "react-router-dom";

const BillOnline = ({ student }) => {
  const [paymentBy, setPaymentBy] = useState([]);
  useEffect(() => {
    if (!student?.student_id) return; // Chỉ gọi API nếu có student_id

    const fetcHById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/paymentMomo/payment/${student.student_id}`
        );
        console.log(res);
        setPaymentBy(res.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetcHById();
  }, [student?.student_id]); // Thêm student vào dependency để cập nhật khi nó thay đổi

  console.log(paymentBy);
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã đơn",
      dataIndex: ["pay", 0, "orderId"],
      key: "orderId",
      align: "center",
    },
    {
      title: "Nội dung",
      dataIndex: "Nộp học phí",
      align: "center",

      key: "Nộp học phí",
      render: () => "Nộp học phí",
    },
    {
      title: "Số tiền",
      dataIndex: ["pay", 0, "amount"],

      key: "price",
      align: "center",
    },
    {
      title: "Ngày thanh toán",
      align: "center",
      key: "success",
      render: () => (
        <span className="blocl text-center w-full flex justify-center items-center">
          <TiTick className="text-green-500 outline outline-green-500 rounded-full" />
        </span>
      ),
      dataIndex: "success",
    },
    {
      title: "Đã thanh toán",
      dataIndex: "price",
      align: "center",

      key: "price",
      render: () => (
        <span className="blocl text-center w-full flex justify-center items-center  ">
          <TiTick className="text-green-500 outline outline-green-500 rounded-full" />
        </span>
      ),
    },
    {
      title: "Đã cập nhân công nợ",
      dataIndex: "price",
      align: "center",

      key: "price",
      render: () => (
        <span className=" text-center w-full flex justify-center items-center">
          <TiTick className="text-green-500  outline outline-green-500 rounded-full" />
        </span>
      ),
    },
    {
      title: "Trạng thái giao dịch",
      dataIndex: ["pay", 0, "message"],
      align: "center",

      key: "status",
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="w-1240 p-2 fix-side" style={{ minHeight: "100vh" }}>
      <Row>
        <Col sm={2} className="fside">
          <FixedSidebar />
        </Col>
        <Col sm={10}>
          <div className="bg-white p-3 rounded-md">
            <div className="flex items-center justify-between">
              <HeadingTitle title="Phiếu thu" />
              <Button onClick={() => navigate("/thanh-toan-truc-tuyen")}>
                Tiếp tục thanh toán
              </Button>
            </div>
            <hr />
            <Table
              columns={columns}
              dataSource={paymentBy}
              pagination={false}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BillOnline;
