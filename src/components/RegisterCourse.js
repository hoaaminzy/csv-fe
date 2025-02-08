import React, { useEffect, useState } from "react";
import { Table, Button, Radio, Select, Tag, message } from "antd";
import { TiTick } from "react-icons/ti";

import axios from "axios";

const { Option } = Select;

export default function RegisterCourse({ student }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedStudyType, setSelectedStudyType] = useState("Học mới");
  const [schedule, setSchedule] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [registerCourses, setRegisterCourses] = useState([]);
  const [selectedHK, setSelectedHK] = useState(null);

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
    const fetchOpenSemester = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/registrationStatus/get-all"
        );
        if (res.data) setSelectedHK(res.data.openSemester);
      } catch (error) {
        console.error("Lỗi khi lấy học kỳ mở:", error);
      }
    };

    fetchOpenSemester();
  }, []);

  const filterRegisterCoursesStudent = registerCourses.filter(
    (item) => item?.inforStudent?.student === student?.student_id
  );

  // Chuyển đổi học kỳ thành định dạng `HK1 - YYYY`
  // const semesterMapping = schedule.map((item) => {
  //   const hkNumber = Number(item.courseHK.replace("Học kỳ ", ""));
  //   const year = 2024 + Math.floor((hkNumber - 1) / 2);
  //   const semester = hkNumber % 2 === 1 ? 1 : 2;
  //   return { ...item, courseHK: `HK${semester} - ${year}` };
  // });

  const semesterMapping = () => {
    const semesters = [];
    const hkNumber = Number(selectedHK?.replace("Học kỳ ", "")); // Chuyển "Học kỳ X" thành số
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

    // Nếu học kỳ lẻ → HK1, nếu chẵn → HK2
    const semester = hkNumber % 2 === 1 ? 1 : 2;

    // Nếu học kỳ >= 3 thì tăng năm lên 1
    const year = currentYear + Math.floor((hkNumber - 1) / 2);

    // Thêm vào danh sách và trả về
    semesters.push({ courseHK: `HK${semester} - ${year}`, hk: selectedHK });

    return semesters;
  };
  const semesterOptions = semesterMapping();

  // Loại bỏ trùng lặp cho Select

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    setFilteredCourses(schedule?.filter((item) => item.courseHK === value));
  };

  const mergeCourses = (courses) => {
    const mergedData = {};

    courses.forEach((course) => {
      const key = `${course.course}-${course.courseHK}`;

      if (!mergedData[key]) {
        mergedData[key] = {
          ...course,
          slot: [course.slot],
          room: [course.room],
          time: [course.time],
          date: [course.date],
        };
      } else {
        mergedData[key].room.push(course.room);
        mergedData[key].slot.push(course.slot);

        mergedData[key].time.push(course.time);
        mergedData[key].date.push(course.date);
      }
    });

    return Object.values(mergedData);
  };

  // Dữ liệu đã gộp
  const mergedCourses = mergeCourses(filteredCourses);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/schedule/get-all-schedule"
      );
      setSchedule(res.data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchRegisterCourses();
  }, []);

  const handleDK = async (record) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/registerCourse/create",
        {
          inforStudent: {
            student: student.student_id,
            name: student.full_name,
          },
          course: record,
          status: true,
        }
      );
      message.success("Đăng ký thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "STT", dataIndex: "_id", render: (_, __, index) => index + 1 },
    { title: "Tên môn học/học phần", dataIndex: ["course", "name"] },

    {
      title: "Mã môn",
      dataIndex: ["course", "code"],
      key: "code",
    },
    {
      title: "Số tín chỉ",
      dataIndex: ["course", "credits"],
      key: "credits",
    },
    {
      title: "Ngày học",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Bắt buộc",
      dataIndex: "loaiLichHoc",
      render: () => <TiTick className="text-green-500 text-[30px]" />,
    },
  ];

  const columnsRegister = [
    { title: "STT", dataIndex: "_id", render: (_, __, index) => index + 1 },
    { title: "Tên môn học/học phần", dataIndex: ["course", "course", "name"] },
    {
      title: "Buổi",
      dataIndex: "timed",
      render: (_, record) =>
        record.course.afternoon
          ? "Buổi chiều"
          : record.morning
          ? "Buổi sáng"
          : "Buổi tối",
    },

    { title: "Thời gian", dataIndex: ["course", "time"] },
    { title: "Ngày học", dataIndex: ["course", "date"] },

    { title: "Phòng", dataIndex: ["course", "room"] },
  ];

  const classColumns = [
    {
      title: "Đã đăng ký",
      dataIndex: "slot",
      render: (_, record) => {
        const check = registerCourses.filter(
          (item) => item?.course?.course._id === record?.course._id
        );
        return (
          <>
            <span>
              {check.length} / {record.slot}
            </span>
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const check = filterRegisterCoursesStudent.find(
          (item) => item?.course?.course._id === record?.course._id
        );

        return (
          <>
            <Tag color="red">
              {check?.status === true ? "Đã đăng ký" : "Chưa đăng ký"}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Buổi",
      dataIndex: "time",
      render: (_, record) =>
        record.afternoon
          ? "Buổi chiều"
          : record.morning
          ? "Buổi sáng"
          : "Buổi tối",
    },

    { title: "Thời gian", dataIndex: "time" },
    { title: "Ngày học", dataIndex: "date" },

    { title: "Phòng", dataIndex: "room" },
    {
      title: "Đăng ký",
      dataIndex: "dk",
      render: (_, record) => {
        const check = registerCourses.filter(
          (item) => item?.course?.course._id === record?.course._id
        );
        const checka = filterRegisterCoursesStudent.find(
          (item) => item?.course?.course._id === record?.course._id
        );
        return (
          <>
            {check.length === Number(record.slot) ? (
              "Số lượng đã đầy"
            ) : checka?.status ? (
              "Đã đăng ký"
            ) : (
              <Button onClick={() => handleDK(record)}>Đăng ký</Button>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="p-4 w-1240" style={{ minHeight: "100vh" }}>
      <h2 className="text-lg font-bold">Đăng ký học phần</h2>

      <div className="flex items-center gap-4 mt-4">
        <Select
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="w-64"
        >
          {semesterOptions?.map((sem, index) => (
            <Option key={index} value={sem.hk}>
              {sem.courseHK}
            </Option>
          ))}
        </Select>
        <Radio.Group
          value={selectedStudyType}
          onChange={(e) => setSelectedStudyType(e.target.value)}
        >
          <Radio value="Học mới">Học mới</Radio>
          <Radio value="Học lại">Học lại</Radio>
          <Radio value="Học cải thiện">Học cải thiện</Radio>
        </Radio.Group>
      </div>

      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="_id"
          rowSelection={{
            type: "radio",
            onChange: (_, selectedRows) => setSelectedCourse(selectedRows[0]),
          }}
          pagination={false}
        />

        {selectedCourse && (
          <div className="mt-4">
            <Table
              columns={classColumns}
              dataSource={[selectedCourse]} // Chuyển object thành mảng chứa 1 phần tử
              rowKey="_id"
              pagination={false}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-bold">Học phần đã đăng ký</h2>
        <Table
          columns={columnsRegister}
          dataSource={filterRegisterCoursesStudent}
          rowKey="_id"
          pagination={false}
        />
      </div>
    </div>
  );
}
