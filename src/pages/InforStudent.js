import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Layout, Button, Menu } from "antd";
import { IoMdHome } from "react-icons/io";
import { MdComputer } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa6";
import { HiDocumentCheck } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import FixedSidebar from "../components/FixedSidebar";
const { Header, Content } = Layout;
const InforStudent = ({ student, loading }) => {
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      icon: <IoMdHome />,
      label: <span onClick={() => navigate("/dashboard")}>Trang chủ</span>,
    },
    {
      key: "2",
      icon: <MdComputer />,
      label: (
        <span onClick={() => navigate("/thong-tin-sinh-vien")}>
          Thông tin chung
        </span>
      ),
    },
    {
      key: "sub3",
      icon: <FaGraduationCap />,
      label: "Học tập",
      children: [
        {
          key: "13",
          label: "Kết quả học tập",
        },
        {
          key: "14",
          label: "Lịch theo tuần",
        },
        {
          key: "15",
          label: "Lịch theo tiến độ",
        },
        {
          key: "16",
          label: "Lịch toàn trường",
        },
        {
          key: "17",
          label: "Kết quả rèn luyện",
        },
      ],
    },
    {
      key: "sub1",
      label: "Học phí",
      icon: <FaCcVisa />,
      children: [
        {
          key: "5",
          label: "Tra cứu công nợ",
        },
        {
          key: "6",
          label: "Phiếu thu tổng hợp",
        },
        {
          key: "7",
          label: "Thanh toán trực tuyến",
        },
      ],
    },
    {
      key: "sub2",
      label: "Đăng ký học phần",
      icon: <HiDocumentCheck />,
      children: [
        {
          key: "9",
          label: "Chương trình khung",
        },
        {
          key: "10",
          label: "Đăng ký học phần",
        },
      ],
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  // Ensure student data is present before attempting to display it
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return <div>No student data found</div>;
  }

  return (
    <div className="w-1240  " style={{ padding: "12px 0" }}>
      <Row className="">
        <Col sm={2}>
          <FixedSidebar />
        </Col>
        <Col sm={10} xs={12} className="bg-white p-4 rounded-md">
          <Row className="pb-14 ">
            <Col sm={3}>
              <div className="flex  flex-col gap-3">
                <div className="flex justify-center items-center">
                  <img
                    src={student?.image}
                    alt=""
                    className="w-[130px] h-[130px] "
                    style={{ borderRadius: "50%" }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[13px] text-[#667580]">
                    MSSV: <strong>{student?.student_id} </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Mã hồ sơ:{" "}
                    <strong>{student?.education_info.student_code} </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Họ tên: <strong>{student.full_name} </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Giới tính: <strong>{student.gender} </strong>{" "}
                  </span>
                </div>
              </div>
            </Col>
            <Col sm={9}>
              <span className="border-b  text-[#667580] pb-2 font-bold text-[18px] block">
                Thông tin học vấn
              </span>
              <Row className="mt-2">
                <Col sm={6}>
                  <div className="flex flex-col gap-2">
                    <span className="text-[13px] text-[#667580]">
                      Trạng thái:{" "}
                      <strong>{student?.education_info.status} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Lớp học: <strong>{student?.education_info.class} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Bậc đào tạo:{" "}
                      <strong>{student?.education_info.degree} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Khoa: <strong>{student?.education_info.faculty} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Chuyên nghành:{" "}
                      <strong>{student?.education_info.major} </strong>{" "}
                    </span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="flex flex-col gap-2">
                    <span className="text-[13px] text-[#667580]">
                      Ngày vào trường:{" "}
                      <strong>
                        {(student?.education_info.admission_date).slice(0, 10)}{" "}
                      </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Cơ sở: <strong>{student?.education_info.campus}</strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Loại hình đào tạo:{" "}
                      <strong>{student?.education_info.education_type} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Ngành: <strong>{student?.education_info.major} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Khóa học:{" "}
                      <strong>{student?.education_info.course} </strong>{" "}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="pb-14">
            <span className="border-b text-[#667580] pb-2 font-bold text-[18px] block">
              Thông tin cá nhân
            </span>
            <div className="flex mt-3 flex-col gap-3">
              <Row>
                <div className="flex items-center gap-14  ">
                  <span className="text-[13px] text-[#667580]">
                    Ngày sinh:{" "}
                    <strong>
                      {(student?.personal_info.birth_date).slice(0, 10)}{" "}
                    </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Dân tộc: <strong>{student?.personal_info.ethnicity}</strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Tôn giáo:{" "}
                    <strong>{student?.personal_info.religion} </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Quốc tịch:{" "}
                    <strong>{student?.personal_info.nationality} </strong>{" "}
                  </span>
                  <span className="text-[13px] text-[#667580]">
                    Khu vực: <strong>{student?.personal_info.region} </strong>{" "}
                  </span>
                </div>
              </Row>
              <Row className="">
                <Col sm={4}>
                  <div className="flex flex-col gap-3">
                    <span className="text-[13px] text-[#667580]">
                      Số CCCD:{" "}
                      <strong>{student?.personal_info.id_card.number} </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Đối tượng: <strong> </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Ngày vào đoàn: <strong> </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Điện thoại: <strong>Nam </strong>{" "}
                    </span>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="flex flex-col w-full gap-3">
                    <div className="flex items-center w-full gap-5">
                      <div className="flex items-center text-[13px] text-[#667580]  w-full gap-2">
                        <span className="block w-max">Ngày cấp: </span>
                        <strong>
                          {(student?.personal_info.id_card.issue_date).slice(
                            0,
                            10
                          )}{" "}
                        </strong>
                      </div>
                      <div className="text-[13px] text-[#667580] flex items-center w-full gap-2">
                        <span className="block w-max">Nơi cấp:</span>
                        <strong>
                          {student?.personal_info.id_card.issue_place}
                        </strong>
                      </div>
                    </div>
                    <span className="text-[13px] text-[#667580]">
                      Diện chính sách: <strong> </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Ngày vào Đảng:<strong> </strong>{" "}
                    </span>
                    <span className="text-[13px] text-[#667580]">
                      Email: <strong>{student?.personal_info.email} </strong>{" "}
                    </span>
                  </div>
                </Col>
                <Col sm={2}></Col>
              </Row>
              <Row className="flex flex-col gap-3">
                <span className="text-[13px] text-[#667580]">
                  Địa chỉ liên hệ:{" "}
                  <strong>{student?.personal_info.permanent_address} </strong>{" "}
                </span>
                <span className="text-[13px] text-[#667580]">
                  Nơi sinh:
                  <strong>
                    {student?.personal_info.permanent_address}{" "}
                  </strong>{" "}
                </span>
                <span className="text-[13px] text-[#667580]">
                  Hộ khẩu thường trú:{" "}
                  <strong>{student?.personal_info.current_address} </strong>{" "}
                </span>
              </Row>
            </div>
          </Row>
          <Row className="pb-14">
            <span className="border-b text-[#667580] pb-2 font-bold text-[18px] block">
              Quan hệ gia đình
            </span>
            {student?.family_info.map((item) => {
              return (
                <div className="mt-3 flex">
                  <Col sm={4}>
                    <div className="flex flex-col  gap-3 ">
                      <span className="text-[13px] text-[#667580]">
                        Họ tên Cha: <strong>{item.name} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Quốc tịch:<strong>{item.nationality} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Cơ quan công tác:<strong>{item.organization} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Hộ khẩu: <strong>{item.relation} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Chỗ ở hiện nay: <strong>{item.address} </strong>{" "}
                      </span>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="flex flex-col gap-3  ">
                      <span className="text-[13px] text-[#667580]">
                        Năm sinh: <strong>{item.birth_year} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Dân tộc: <strong>{item.ethnicity} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Chức vụ: <strong>{item.position} </strong>{" "}
                      </span>
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="flex flex-col gap-3   ">
                      <span className="text-[13px] text-[#667580]">
                        Nghề nghiệp: <strong>{item.job} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Tôn giáo: <strong>{item.religion} </strong>{" "}
                      </span>
                      <span className="text-[13px] text-[#667580]">
                        Số điện thoại: <strong>{item.phone} </strong>{" "}
                      </span>
                    </div>
                  </Col>
                </div>
              );
            })}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default InforStudent;
