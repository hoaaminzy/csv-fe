import React, { useEffect, useState, useMemo } from "react";
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
  const [schedule, setSchedule] = useState([]);

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

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/schedule/get-all-schedule"
      );
      setSchedule(res.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };
  useEffect(() => {
    fetchRegisterCourses();
    fetchSchedule();
  }, []);
  // Lọc danh sách khóa học của sinh viên hiện tại

  const checkLichHocStudent = schedule.filter(
    (item) =>
      item.major === student?.education_info?.major &&
      item.faculty === student?.education_info?.faculty
  );

  const filterLichThi = checkLichHocStudent?.filter(
    (item) => item.loaiLichHoc === "Lịch thi"
  );
  const addStatus = filterLichThi?.map((item) => ({
    _id: item._id,
    course: { ...item },
    status: true,
  }));

  const studentCourses = useMemo(() => {
    if (!student) return [];
    return registerCourses.filter(
      (item) => item?.inforStudent?.student === student?.student_id
    );
  }, [registerCourses, student]);

  const combineArray = [...studentCourses, ...addStatus];
  const handleDateChange = (date) => setSelectedDate(date || dayjs());
  const handleViewModeChange = (e) => setViewMode(e.target.value);
  const handleCurrentDate = () => setSelectedDate(dayjs());
  const handlePrintSchedule = () => window.print();
  const handlePreviousWeek = () =>
    setSelectedDate(selectedDate.subtract(1, "week"));
  const handleNextWeek = () => setSelectedDate(selectedDate.add(1, "week"));

  const renderDayColumn = (day, index) => {
    if (!student) return null;

    const selectedDay = selectedDate.startOf("week").add(index - 1, "day");
    const selectedDayOfWeek = selectedDay.day(); // 0: Chủ Nhật, 1: Thứ 2, ..., 6: Thứ 7

    const dayCourses = combineArray.filter((data) => {
      const startDate = dayjs(data?.course?.date);
      const endDate = startDate.add(data?.course?.course?.credits * 4, "week");
      const courseDayOfWeek = startDate.day();
      if (data?.course?.loaiLichHoc === "Lịch thi") {
        return selectedDay.isSame(startDate, "day");
      }
      return (
        selectedDayOfWeek === courseDayOfWeek &&
        selectedDay.isBetween(startDate, endDate, "day", "[]")
      );
    });

    return (
      <div
        key={index}
        className="border-r border-b border-gray-300 flex flex-col"
      >
        <div className="bg-gray-100 text-[#1ea1f1] h-14 text-center py-1 font-medium">
          {day === "Ca"
            ? "Ca"
            : `${day} \n ${selectedDay.format("DD/MM/YYYY")}`}
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
                      }`}
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

  return (
    <div className="w-1240 p-2 w-full" style={{ minHeight: "100vh" }}>
      <div className="flex gap-2">
        <div className="hidden sm:block md:w-2/12">
          <FixedSidebar />
        </div>
        <div className="h-full sm:w-full md:w-10/12 w-full ">
          <div className="bg-white h-max p-3 rounded-md">
            <span className="font-bold mb-3 block text-[20px]">
              <HeadingTitle title=" Lịch học, lịch thi theo tuần" />
            </span>
            <div className="flex flex-col sm:flex-col gap-2 sm:gap-2 md:gap-0 md:flex-row sm:items-start md:items-center justify-between">
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
            <div className="w-full overflow-x-auto sm:overflow-x-visible ">
              <div className="w-full sm:min-w-0 min-w-[1200px] mt-4 h-full flex border border-gray-300">
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
                  ].map(renderDayColumn)}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-col md:flex-row gap-4 text-sm">
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
        </div>
      </div>
    </div>
  );
};

export default Schedule;
