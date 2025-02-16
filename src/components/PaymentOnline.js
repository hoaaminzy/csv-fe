import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import { TiTick } from "react-icons/ti";
import axios from "axios";

import { Table, Select } from "antd";
import HeadingTitle from "./HeadingTitle";
import { Link, useNavigate } from "react-router-dom";
const { Option } = Select;

const PaymentOnline = ({ student }) => {
  const [registerCourses, setRegisterCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [paymentMomo, setPaymentMomo] = useState([]);

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

  const checkPaymentStudent = paymentMomo.filter(
    (item) => item.student.student_id === student?.student_id
  );
  const filterPayment = checkPaymentStudent.find(
    (item) => item?.semester === selectedSemester
  );

  const fetchPaymentMomos = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/paymentMomo/get-all-payment"
      );
      setPaymentMomo(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPaymentMomos();
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

  const navigate = useNavigate();
  const dataSource = filteredCourses?.map((item, index) => ({
    key: index,
    stt: index + 1,
    code: item?.course?.course?.code,
    name: item?.course?.course?.name,
    credits: item?.course?.course?.credits,
    mandatory: <TiTick className="text-green-400 text-[24px]" />,
    amount: `${item?.course?.course?.credits * 680000} VNĐ `,
  }));

  const totalAmount = dataSource.reduce((sum, item) => {
    const numericValue = parseInt(item.amount.replace(/\D/g, ""), 10);
    return sum + numericValue;
  }, 0);

  const handlePayment = async () => {
    try {
      const res = await axios.post("http://localhost:8080/payment", {
        courses: filteredCourses,
        semester: selectedSemester,
        amount: totalAmount,
        student: student,
      });
      if (res.data.payUrl) {
        window.location.href = res.data.payUrl;
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className=" w-full md:w-[1240px] m-auto p-2 "
      style={{ minHeight: "100vh" }}
    >
      <div className="flex gap-2 ">
        <div className="hidden sm:block md:w-2/12">
          <FixedSidebar />
        </div>
        <div className="w-full  sm:w-full md:w-10/12">
          <div className="bg-white h-max p-3 rounded-md">
            <div className="flex flex-col md:flex-row justify-between sm:items-start md:items-center">
              <HeadingTitle title="Thanh toán trực tuyến" />
              <div>
                <span>Đợt: </span>
                <Select
                  value={selectedSemester}
                  onChange={handleSemesterChange}
                  className="w-64"
                  placeholder="Chọn học kỳ"
                >
                  <Option value="" disabled>
                    Chọn học kỳ
                  </Option>
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
                    {filterPayment ? (
                      <span className="font-bold">
                        Đã thanh toán - Kiểm tra hóa đơn{" "}
                        <Link to={`/phieu-thu`}>tại đây</Link>
                      </span>
                    ) : (
                      <div className="">
                        Tổng số tiền cần thanh toán:{" "}
                        <strong className="text-red-500 font-bold">
                          {totalAmount} VND
                        </strong>
                      </div>
                    )}

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
                    <span>
                      6. Dễ dàng và tiện lợi khi thanh toán qua
                      <strong className="text-red-500"> Ví Momo</strong>
                      {filterPayment ? (
                        ""
                      ) : selectedSemester ? (
                        <span
                          onClick={handlePayment}
                          className="cursor-pointer"
                        >
                          {" "}
                          , thanh toán ngay
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOnline;
