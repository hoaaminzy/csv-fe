import React, { useEffect, useState } from "react";
import { DatePicker, Radio, Button } from "antd";
import dayjs from "dayjs";
import { Row, Col } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import axios from "axios";
import isBetween from "dayjs/plugin/isBetween";
import HeadingTitle from "./HeadingTitle";

dayjs.extend(isBetween);
const Schedule = ({ student }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("all");
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

  const filterRegisterCoursesStudent = registerCourses.filter(
    (item) => item?.inforStudent?.student === student?.student_id
  );

  const handleDateChange = (date) => {
    setSelectedDate(date || dayjs());
  };

  const handleViewModeChange = (e) => {
    const mode = e.target.value;
    setViewMode(mode);
  };

  const handleCurrentDate = () => {
    setSelectedDate(dayjs());
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  const handlePreviousWeek = () => {
    setSelectedDate(selectedDate.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setSelectedDate(selectedDate.add(1, "week"));
  };

  const renderDayColumn = (day, index) => {
    const dayCourses = filterRegisterCoursesStudent.filter((data) => {
      const startDate = dayjs(data?.course?.date);
      const endDate = startDate.add(data?.course?.course?.credits * 4, "week");

      // Lấy thứ của ngày bắt đầu
      const courseDayOfWeek = startDate.day(); // 0: Chủ Nhật, 1: Thứ 2, ..., 6: Thứ 7
      const selectedDayOfWeek = selectedDate
        .startOf("week")
        .add(index - 1, "day")
        .day();

      // Kiểm tra nếu thứ trong tuần khớp và nằm trong khoảng thời gian học
      return (
        selectedDayOfWeek === courseDayOfWeek &&
        dayjs(selectedDate.startOf("week").add(index - 1, "day")).isBetween(
          startDate,
          endDate - 1,
          "day",
          "[]"
        )
      );
    });

    return (
      <div
        key={index}
        className="border-r border-b border-gray-300 flex flex-col"
      >
        <div className="bg-gray-100 text-[#1ea1f1] h-14 text-center py-1 font-medium">
          {day === "Ca" ? (
            "Ca"
          ) : (
            <>
              {day} <br />
              {selectedDate
                .startOf("week")
                .add(index - 1, "day")
                .format("DD/MM/YYYY")}
            </>
          )}
        </div>
        {day === "Ca" ? (
          <div className="grid grid-rows-3 border-b border-gray-300 flex-grow">
            {["Sáng", "Chiều", "Tối"].map((period, idx) => (
              <div
                key={idx}
                className="h-full border-b flex items-center justify-center bg-yellow-200 border-gray-300"
              >
                {period}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-rows-3 border-b border-gray-300 flex-grow">
            {["morning", "afternoon", "evening"].map((period, idx) => {
              const periodCourse = dayCourses.find(
                (data) => data.course[period]
              );
              return (
                <div
                  key={idx}
                  className="p-2 border-b border-gray-300 flex-grow"
                >
                  {periodCourse ? (
                    <div
                      className={`h-full rounded-md flex flex-col p-2 ${
                        periodCourse.course.loaiLichHoc === "Lịch thi"
                          ? "bg-yellow-300"
                          : periodCourse.course.loaiLichHoc ===
                            "Lịch học thực hành"
                          ? "bg-green-300"
                          : periodCourse.course.loaiLichHoc === "Lịch tạm ngưng"
                          ? "bg-red-300"
                          : periodCourse.course.loaiLichHoc ===
                            "Lịch học trực tuyến"
                          ? "bg-blue-300"
                          : "bg-gray-300"
                      } 
`}
                    >
                      <span className="text-[13px] font-bold">
                        {periodCourse?.course?.course?.name}
                      </span>
                      <span className="text-[13px] ">
                        Phòng: {periodCourse.course.room}
                      </span>
                      <span className="text-[13px]">
                        Giờ: {periodCourse.course.time}
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-400 w-full h-full text-[13px] py-4 flex items-center justify-center text-center">
                      Không có lịch
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchRegisterCourses();
  }, []);
  return (
    <div className="w-1240" style={{ padding: "12px 0", minHeight: "100vh" }}>
      <Row>
        <Col sm={2} className="fside">
          <FixedSidebar />
        </Col>
        <Col sm={10} xs={12} className="h-full">
          <div className="bg-white h-max p-3 rounded-md">
            <div className="">
              <span className="font-bold mb-3 block text-[20px]">
                <HeadingTitle title=" Lịch học, lịch thi theo tuần" />
              </span>
              <div className="flex items-center justify-between">
                <Radio.Group
                  value={viewMode}
                  onChange={handleViewModeChange}
                  className="flex gap-2"
                >
                  <Radio.Button value="all">Tất cả</Radio.Button>
                  <Radio.Button value="schedule">Lịch học</Radio.Button>
                  <Radio.Button value="exam">Lịch thi</Radio.Button>
                </Radio.Group>
                <div className="flex gap-2">
                  <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    format="DD/MM/YYYY"
                    className="w-40"
                  />
                  <Button type="primary" onClick={handleCurrentDate}>
                    Hiện tại
                  </Button>
                  <Button onClick={handlePrintSchedule}>In lịch</Button>
                  <Button onClick={handlePreviousWeek}>Trở về</Button>
                  <Button onClick={handleNextWeek}>Tiếp</Button>
                </div>
              </div>
            </div>
            <div className="w-full mt-4 h-full flex border border-gray-300">
              <div className="grid grid-cols-8 w-full border-t h-full border-gray-300">
                {[
                  "Ca",
                  "Thứ 2",
                  "Thứ 3",
                  "Thứ 4",
                  "Thứ 5",
                  "Thứ 6",
                  "Thứ 7",
                  "Chủ nhật",
                ].map((day, index) => renderDayColumn(day, index))}
              </div>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-gray-300 inline-block" /> Lịch học
                lý thuyết
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-green-300 inline-block" /> Lịch học
                thực hành
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-blue-300 inline-block" /> Lịch học
                trực tuyến
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-yellow-300 inline-block" /> Lịch thi
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-red-300 inline-block" /> Lịch tạm
                ngưng
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Schedule;
