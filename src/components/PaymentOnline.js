import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { TiTick } from "react-icons/ti";
import axios from "axios";

import { Table, Button, Radio, Select, Tag, message } from "antd";
import HeadingTitle from "./HeadingTitle";
const { Option } = Select;

const PaymentOnline = ({ student }) => {
  const [registerCourses, setRegisterCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 60,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nội dung thu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      key: "credits",
      width: 100,
    },
    {
      title: "Bắt buộc",
      dataIndex: "mandatory",
      key: "mandatory",
      align: "center",
      width: 100,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
  ];
  const fetchRegisterCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/registerCourse/get-all-registerCourse"
      );
      setRegisterCourses(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRegisterCourses();
  }, []);

  const filterRegisterCoursesStudent = registerCourses.filter(
    (item) => item?.inforStudent?.student === student?.student_id
  );

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    setFilteredCourses(
      filterRegisterCoursesStudent?.filter(
        (item) => item.course.courseHK === value
      )
    );
  };

  const dataSource = filteredCourses?.map((item, index) => ({
    key: index,
    stt: index + 1,
    code: item?.course?.course?.code,
    name: item?.course?.course?.name,
    credits: item?.course?.course?.credits,
    mandatory: <TiTick className="text-green-400 text-[24px]" />,
    amount: `${item?.course?.course?.credits * 680000} VNĐ`,
  }));

  console.log(filteredCourses);

  return (
    <div className="w-1240" style={{ padding: "12px 0", minHeight: "100vh" }}>
      <Row>
        <Col sm={2} className="fside">
          <FixedSidebar />
        </Col>
        <Col sm={10} xs={12} className="h-full">
          <div className="bg-white h-max p-3 rounded-md">
            <div className="flex justify-between items-center">
              <HeadingTitle title="Thanh toán trực tuyến" />
              <div>
                <Select
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  className="w-64"
                >
                  {[
                    ...new Set(
                      filterRegisterCoursesStudent?.map(
                        (sem) => sem.course.courseHK
                      )
                    ),
                  ].map((uniqueHK, index) => (
                    <Option key={index} value={uniqueHK}>
                      {uniqueHK}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <hr />
            <div>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                footer={() => (
                  <div className="flex flex-col items-start p-2">
                    <span>
                      1. Để thanh toán trực tuyến qua ngân hàng{" "}
                      <strong className="text-red-500">thẻ ATM</strong> phải
                      đăng ký{" "}
                      <strong className="text-red-500">
                        Thanh toán online.
                      </strong>
                    </span>
                    <span>
                      2. Vui lòng kiểm tra{" "}
                      <strong className="text-red-500">HẠN MỨC THẺ</strong>{" "}
                      trước khi thanh toán
                    </span>
                    <span>3. Xem hướng dẫn thanh toán tại đây</span>
                    <span>
                      4. Để hủy giao dịch chờ gạch nợ, vui lòng bấm vào đây.
                    </span>
                    <span>
                      5. Khuyến cáo thanh toán qua{" "}
                      <strong className="text-red-500">QR-Code</strong>, thẻ ATM
                      nội địa.
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentOnline;
