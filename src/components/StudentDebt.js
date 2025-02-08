import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import { Table, Typography, Divider } from "antd";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
const { Title } = Typography;

const processData = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const { courseHK } = item.course;
    if (!groupedData[courseHK]) {
      groupedData[courseHK] = [];
    }
    groupedData[courseHK].push(item);
  });

  return groupedData;
};

const StudentDebt = () => {
  const [registerCourses, setRegisterCourses] = useState([]);

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
  const groupedData = processData(registerCourses);

  const columns = [
    {
      title: "STT",
      dataIndex: "dot",
      key: "dot",
    },
    {
      title: "Mã môn học",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Tên môn học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Mức phí",
      dataIndex: "mucphi",
      key: "mucphi",
    },
    {
      title: "Số tiền miễn giảm",
      dataIndex: "stmg",
      key: "stmg",
    },
    {
      title: "Mức nộp",
      dataIndex: "mucnap",
      key: "mucnap",
    },
    {
      title: "Ngày nộp",
      dataIndex: "ngaynap",
      key: "ngaynap",
    },
    {
      title: "Số tiền nạp",
      dataIndex: "sotiennap",
      key: "sotiennap",
    },
    {
      title: "Khấu trừ (+)",
      dataIndex: "khautru",
      key: "khautru",
    },
    {
      title: "Trự nợ (-)",
      dataIndex: "truno",
      key: "truno",
    },
    {
      title: "Công nợ",
      dataIndex: "congno",
      key: "congno",
    },
    {
      title: "Trạng thái",
      dataIndex: "trangthai",
      key: "trangthai",
    },
  ];

  const data = Object.entries(groupedData).flatMap(
    ([semester, courses], semesterIndex) => {
      const totalCredits = courses.reduce(
        (sum, course) => sum + course.course.course.credits,
        0
      );
      const totalFee = totalCredits * 680000;
      return [
        {
          key: `${semesterIndex}-header`,
          dot: <span className="text-red-500 font-bold">{semester}</span>,
          isHeader: true,
        },
        ...courses.map((item, index) => ({
          key: `${semesterIndex}-${index}`,
          dot: index + 1,
          courseCode: item.course.course.code,
          courseName: item.course.course.name,
          credits: item.course.course.credits,
          mucphi: item.course.course.credits * 680000,
          stmg: 0,
          mucnap: item.course.course.credits * 680000,
          ngaynap: "23-2-2002",
          sotiennap: item.course.course.credits * 680000,
          khautru: 0,
          truno: 0,
          congno: 0,
          trangthai: <FaCheckCircle className="text-green-500 text-[20px] text-center w-full"/>,
          date: item.course.date,
          slot: item.course.slot,
        })),
        {
          key: `${semesterIndex}-total`,
          dot: <strong>Tổng cộng</strong>,
          courseCode: null,
          courseName: null,
          credits: totalCredits,
          mucphi: totalFee,
          stmg: null,
          mucnap: totalFee,
          ngaynap: null,
          sotiennap: totalFee,
          khautru: null,
          truno: null,
          congno: null,
          trangthai: null,
          date: null,
          slot: null,
        },
      ];
    }
  );

  return (
    <div className=" p-2 fix-side" style={{ minHeight: "100vh" }}>
      {/* <div style={{ padding: 20 }}>
        {Object.keys(groupedData).map((hk) => {
          const semesterData = groupedData[hk];
          const totalCredits = semesterData.reduce(
            (sum, item) => sum + item.course.course.credits,
            0
          );
          const totalFee = totalCredits * 1000000; // Giả định học phí là 1 triệu/tín chỉ

          return (
            <div key={hk}>
              <Title level={4}>{`Đợt: ${hk}`}</Title>
              <Table
                columns={columns}
                dataSource={semesterData}
                rowKey="_id"
                pagination={false}
              />
              <Title
                level={5}
              >{`Tổng số tín chỉ: ${totalCredits} | Tổng học phí: ${totalFee.toLocaleString()} VND`}</Title>
              <Divider />
            </div>
          );
        })}
      </div> */}
      <h4 className=" uppercase font-bold text-[25px]  mb-3 mt-5 text-center">
        công nợ sinh viên
      </h4>
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  );
};

export default StudentDebt;
