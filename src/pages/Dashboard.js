import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import SolidGaugeChart from "../components/SolidGaugeChart";
import Chart from "../components/Chart";
import { Table, Tag } from "antd";

import { GiProgression } from "react-icons/gi";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { SiGoogleforms } from "react-icons/si";
import { IoLogoUsd } from "react-icons/io";
import { MdPayments } from "react-icons/md";
import { RiLayoutHorizontalLine } from "react-icons/ri";

import { RiWalletFill } from "react-icons/ri";
import axios from "axios";
const { Column, ColumnGroup } = Table;
const Dashboard = ({ student }) => {
  const [points, setPoints] = useState([]);
  const [registerCourses, setRegisterCourses] = useState([]);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/points/point/all`);
      setPoints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRegisterCourses = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/registerCourse/get-all-registerCourse"
      );
      setRegisterCourses(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khóa học:", error);
    }
  };

  useEffect(() => {
    fetchRegisterCourses();
    fetchStudent();
  }, []);

  function isDateInThisWeek(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();

    // Xác định ngày đầu tiên của tuần (Thứ Hai)
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

    // Xác định ngày cuối cùng của tuần (Chủ Nhật)
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    return inputDate >= firstDayOfWeek && inputDate <= lastDayOfWeek;
  }

  const filteredCourses = registerCourses.filter((item) =>
    isDateInThisWeek(item.course.date)
  );

  const filterLoaiLichHoc = filteredCourses.filter(
    (item) => item.course.loaiLichHoc !== "Lịch thi"
  );

  const filterLoaiLichThi = filteredCourses.filter(
    (item) => item.course.loaiLichHoc === "Lịch thi"
  );

  const result = points?.flatMap((item) =>
    item.members
      .filter((member) => member?.mssv === student?.student_id)
      .map((member) => ({
        ...member,
        lPHCPhN: item.lPHCPhN,
        mLP: item.mLP,
        sTNCh: item.sTNCh,
        tNGiOViN: item.tNGiOViN,
        nMHC: item.nMHC,
        mNHC: item.mNHC,
        hCK: item.hCK,
      }))
  );

  const groupedData = Object.values(
    result.reduce((acc, curr) => {
      const key = `${curr.hCK}-${curr.nMHC}`;
      if (!acc[key]) {
        acc[key] = {
          hCK: curr.hCK,
          nMHC: curr.nMHC,
          itemPoints: [],
        };
      }
      acc[key].itemPoints.push(curr);
      return acc;
    }, {})
  );

  const [selectedSemester, setSelectedSemester] = useState("Chọn năm học");
  const [selectedSemester3, setSelectedSemester3] = useState("Chọn năm học");
  const [abc, setABC] = useState([]);

  const handleMenuClick3 = ({ key }) => {
    const selectedItem = groupedData.find(
      (item) => `${item.hCK}-${item.nMHC}` === key
    );
    if (selectedItem) {
      setSelectedSemester3(`HK ${selectedItem.hCK} - NH ${selectedItem.nMHC}`);

      const semesterData = groupedData?.find(
        (item) =>
          item.hCK === selectedItem.hCK && item.nMHC === selectedItem.nMHC
      );
      setABC(semesterData);
    }
  };

  const data = abc?.itemPoints?.map((item, index) => ({
    key: index + 1,
    firstName: (
      <div className="flex flex-col items-start">
        <span className="text-[#578ebe] font-bold">{item.mNHC}</span>
        <span>{item.lPHCPhN}</span>
      </div>
    ),
    lastName: item.sTNCh,
  }));

  const items3 = groupedData.map((item) => ({
    label: `HK ${item.hCK} - NH ${item.nMHC}`,
    key: `${item.hCK}-${item.nMHC}`,
    onClick: handleMenuClick3,
  }));

  const handleMenuClick = ({ key }) => {
    const selectedItem = groupedData.find(
      (item) => `${item.hCK}-${item.nMHC}` === key
    );
    if (selectedItem) {
      setSelectedSemester(`HK ${selectedItem.hCK} - NH ${selectedItem.nMHC}`);
    }
  };

  const items = groupedData.map((item) => ({
    label: `HK ${item.hCK} - NH ${item.nMHC}`,
    key: `${item.hCK}-${item.nMHC}`,
    onClick: handleMenuClick,
  }));

  return (
    <div className="w-1240 py-2  flex flex-col gap-3 dashboard">
      <Row className="sm:h-full md:h-[242px] xl:h-[242px] lg:h-[242px] ">
        <Col sm={7} className="h-full">
          <div className="bg-white h-full p-2 rounded-md">
            <span className="text-[#667580] block pb-2 w-full border-b font-bold text-[20px]">
              Thông tin sinh viên
            </span>
            <Row className="mt-3">
              <Col sm={3}>
                <div className="flex flex-col gap-2 justify-center items-center h-full">
                  <img
                    src={student?.image}
                    alt=""
                    className="w-[130px] h-[130px] "
                    style={{ borderRadius: "50%" }}
                  />
                  <Link
                    to="/thong-tin-sinh-vien"
                    className="text-[#4da1e7] text-[14px]"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </Col>
              <Col sm={5}>
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] text-[#667580]">
                    MSSV: <strong>{student?.student_id}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Họ tên: <strong>{student?.full_name}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Giới tính: <strong>{student?.gender}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Ngày sinh:{" "}
                    <strong>
                      {student?.personal_info?.birth_date?.slice(0, 10)}
                    </strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Nơi sinh:
                    <strong>
                      {student?.personal_info.permanent_address}
                    </strong>{" "}
                  </span>
                </div>
              </Col>
              <Col sm={4}>
                <div className="flex flex-col gap-2">
                  <span className="text-[13px] text-[#667580]">
                    Lớp học: <strong>{student?.education_info.class}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    {" "}
                    Khóa học: <strong>{student?.education_info.course}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    {" "}
                    Bậc đào tạo:{" "}
                    <strong>{student?.education_info.degree}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    {" "}
                    Loại hình đào tạo:{" "}
                    <strong>{student?.education_info.education_type}</strong>
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    {" "}
                    Ngành: <strong>{student?.education_info.major}</strong>
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={5} className="flex flex-col h-full sm:mt-5  gap-3 ">
          <div className="w-full h-[50%] ">
            <div className="bg-white flex h-full flex-col justify-center p-2.5 rounded-md">
              <span className="text-[13px] text-[#667580]">
                Nhắc nhở mới, chưa xem
              </span>
              <span className="text-[30px]">10</span>
              <Link to="/" className="text-[13px]">
                Xem chi tiết
              </Link>
            </div>
          </div>
          <div className="flex gap-3 h-[50%]">
            <div className="bg-[#e0fbff] h-full justify-center w-full text-[#4da1e7] flex flex-col p-2.5 rounded-md">
              <span className="text-[13px] text-[#4da1e7] ">
                Lịch thi trong tuần
              </span>
              <span className="text-[30px]">{filterLoaiLichThi.length}</span>
              <Link to="/lich-hoc" className="text-[#4da1e7] text-[13px]">
                Xem chi tiết
              </Link>
            </div>
            <div className="bg-[#fff2d4] h-full justify-center w-full text-[#ff9206] flex flex-col p-2.5 rounded-md">
              <span className="text-[13px] text-[#ff9206]">
                Lịch học trong tuần
              </span>
              <span className="text-[30px]">{filterLoaiLichHoc.length}</span>
              <Link to="/lich-hoc" className="text-[#ff9206] text-[13px]">
                Xem chi tiết
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-8  xl:grid-cols-8  gap-3">
          <div className="bg-white  gap-3 w-[full] h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/ket-qua-hoc-tap"
              className="flex flex-col justify-center items-center gap-3"
            >
              <GiProgression className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Kết quả học tập
              </span>
            </Link>
          </div>
          <div className="bg-white   gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/lich-hoc"
              className="flex flex-col justify-center items-center gap-3"
            >
              <FaCalendarAlt className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">Lịch theo tuần</span>
            </Link>
          </div>
          <div className="bg-white gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              className="flex flex-col justify-center items-center gap-3"
              to="/chuong-trinh-khung"
            >
              <FaClipboardList className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Lịch theo tiến độ
              </span>
            </Link>
          </div>
          <div className="bg-white  gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/de-xuat-bieu-mau"
              className="flex flex-col justify-center items-center gap-3"
            >
              <SiGoogleforms className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Đề xuất biểu mẫu
              </span>
            </Link>
          </div>
          <div className="bg-white  gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/cong-no-sinh-vien"
              className="flex flex-col justify-center items-center gap-3"
            >
              <IoLogoUsd className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Tra cứu công nợ
              </span>
            </Link>
          </div>

          <div className="bg-white gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/thanh-toan-truc-tuyen"
              className="flex flex-col justify-center items-center gap-3"
            >
              <MdPayments className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Thanh toán trực tuyến
              </span>
            </Link>
          </div>
          <div className="bg-white  gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <RiLayoutHorizontalLine className="text-[25px] text-[#4da1e7]" />
            <span className="text-[13px] text-[#667580]">
              Phiếu thu tổng hợp
            </span>
          </div>

          <div className="bg-white gap-3 w-full h-[130px]  rounded-md flex flex-col justify-center items-center">
            <Link
              to="/phieu-thu"
              className="flex flex-col justify-center items-center gap-3"
            >
              <RiWalletFill className="text-[25px] text-[#4da1e7]" />
              <span className="text-[13px] text-[#667580]">
                Phiếu thu trực tuyến
              </span>
            </Link>
          </div>
        </div>
      </Row>
      <Row className="h-[350px]">
        <Col sm={5} className="h-full">
          <div className="bg-white flex flex-col justify-between h-full rounded-md p-3">
            <div
              style={{ borderBottom: "1px solid silver" }}
              className="flex pb-2   justify-between items-center "
            >
              {" "}
              <span className="text-[18px] font-bold">Kết quả học tập</span>
              <Dropdown menu={{ items }} trigger={["click"]}>
                <span onClick={(e) => e.preventDefault()}>
                  <Space className="border p-2 px-4 rounded-md hover:bg-gray-100 transition duration-200">
                    {selectedSemester}
                    <DownOutlined />
                  </Space>
                </span>
              </Dropdown>
            </div>
            <div className="h-full">
              <Chart data={groupedData} selectedSemester={selectedSemester} />
            </div>
          </div>
        </Col>
        <Col sm={3} className="h-full">
          <div className="bg-white h-full rounded-md p-3">
            <div className=" pb-2" style={{ borderBottom: "1px solid silver" }}>
              {" "}
              <span className="text-[18px] font-bold">Tiến độ học tập</span>
            </div>
            <SolidGaugeChart data={groupedData} />
          </div>
        </Col>
        <Col sm={4} className="h-full">
          <div className="bg-white h-full rounded-md p-3">
            <div
              style={{ borderBottom: "1px solid silver" }}
              className="flex pb-2 justify-between items-center "
            >
              {" "}
              <span className="text-[18px] font-bold">Lớp học phần</span>
              <Dropdown menu={{ items: items3 }} trigger={["click"]}>
                <span onClick={(e) => e.preventDefault()}>
                  <Space className="border p-2 px-4 rounded-md hover:bg-gray-100 transition duration-200">
                    {selectedSemester3}
                    <DownOutlined />
                  </Space>
                </span>
              </Dropdown>
            </div>
            <div className="mt-2 flex flex-col h-full">
              <div className="mb-3 flex justify-around">
                <span className="text-[12px]">Môn học/học phần</span>
                <span className="text-[12px]">Số tín chỉ</span>
              </div>
              <div className="w-full h-[200px] overflow-y-scroll">
                <Table dataSource={data} showHeader={false} pagination={false}>
                  <Column dataIndex="firstName" key="firstName" />
                  <Column dataIndex="lastName" key="lastName" />
                </Table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
