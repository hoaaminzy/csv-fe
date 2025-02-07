import React, { useEffect, useState } from "react";
import { Table, Collapse, message } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import "tailwindcss/tailwind.css";

import { Col, Row } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import axios from "axios";
const { Panel } = Collapse;

const columns = [
  {
    title: "STT",
    render: (_, __, index) => index + 1, // index là vị trí của dòng trong bảng
    width: 60, // Có thể điều chỉnh chiều rộng cột
  },
  { title: "Tên môn học", dataIndex: "name", key: "name" },
  { title: "Mã học phần", dataIndex: "code", key: "code" },
  { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
  { title: "Số tiết LT", dataIndex: "lectureHours", key: "lectureHours" },
  { title: "Số tiết TH", dataIndex: "practiceHours", key: "practiceHours" },
  {
    title: "Bắt buộc",
    key: "status",
    render: () => <CheckCircleOutlined className="text-green-500" />,
  },
];

const ProgramFarmwork = ({ student }) => {
  const [allCourses, setAllCourses] = useState([]);

  const dataCourses = [
    {
      hk: "Học kỳ 1",
      courses: [
        {
          name: "Triết",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "triet123",
        },
        {
          name: "Tư tưởng HCM",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "hcm123",
        },
        {
          name: "Mac Le nin",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "maclenin123",
        },
      ],
    },
    {
      hk: "Học kỳ 2",
      courses: [
        {
          name: "Đại số",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "daiso123",
        },
        {
          name: "Giải tích",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "giaitich123",
        },
      ],
    },
    {
      hk: "Học kỳ 3",
      courses: [
        {
          name: "GDCD",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "gdcd123",
        },
      ],
    },
    {
      hk: "Học kỳ 4",
      courses: [
        {
          name: "Thể dục thể chất",
          code: "123",
          lectureHours: 30,
          mandatory: true,
          practiceHours: 30,
          credits: 3,
          _id: "gdtc123",
        },
      ],
    },
  ];
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/courses/get-all-course"
        );
        setAllCourses(res.data);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
      }
    };
    fetchCourses();
  }, []);

  const filterCourse = allCourses.find(
    (item) =>
      item.khoa === student?.education_info.faculty ||
      item.nganh === student?.education_info.major
  );

  const mergedSemester = filterCourse?.semesters.map((sem) => {
    const matchedCourse = dataCourses.find((course) => course.hk === sem.hk);
    return {
      ...sem,
      courses: matchedCourse
        ? [...sem.courses, ...matchedCourse.courses]
        : sem.courses,
    };
  });

  const totalCredits = mergedSemester?.map((hk) => {
    const totalCreditsForHk = hk.courses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    return {
      hk: hk.hk,
      totalCredits: totalCreditsForHk,
    };
  });

  return (
    <div className="w-1240 p-2 fix-side" style={{ minHeight: "100vh" }}>
      <Row>
        <Col sm={2}>
          <FixedSidebar />
        </Col>
        <Col sm={10}>
          <div className="bg-white p-3 rounded-md">
            <span className="font-bold mb-3 block text-[20px]">
              Chương trình khung
            </span>
            <Collapse>
              {mergedSemester?.map((semester, index) => {
                // Lấy tổng tín chỉ của học kỳ hiện tại
                const semesterCredits = totalCredits.find(
                  (item) => item.hk === semester.hk
                )?.totalCredits;

                return (
                  <Panel
                    header={
                      <span className="text-[#578ebe] font-bold">
                        {`${semester.hk} - ${semesterCredits} tín chỉ`}
                      </span>
                    }
                    key={index}
                  >
                    <Table
                      columns={columns}
                      dataSource={semester.courses}
                      pagination={false}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProgramFarmwork;
