import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import InforStudent from "./pages/InforStudent";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import MenuDashboard from "./components/MenuDashboard";
import Result from "./pages/Result";
import Schedule from "./components/Schedule";
import ProgramFarmwork from "./components/ProgramFarmwork";
import FormProposal from "./components/FormProposal";
import RegisterCourse from "./components/RegisterCourse";
import PaymentOnline from "./components/PaymentOnline";
import StudentDebt from "./components/StudentDebt";
import BillOnline from "./components/BillOnline";
import Footer from "./components/Footer";
function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();

  const [student, setStudent] = useState(null); // Initialize as null to check if data is loaded
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getStudentById = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/students/student/${userInfo.student_id}` // Make sure this URL is correct
        );
        setStudent(response.data); // Only set the data part
        Modal.success({
          content: "Dữ liệu sinh viên đã được lưu thành công",
        });
      } catch (error) {
        Modal.error({
          content: "Lưu dữ liệu sinh viên thất bại",
        });
      }
      setLoading(false);
    };
    getStudentById();
  }, []);

  return (
    <div
      className={` ${
        location.pathname === "/dashboard" ? "h-screen bg-[#e7ecf0]" : ""
      }`}
    >
      {location.pathname === "/sinh-vien-dang-nhap" ? "" : <Header />}

      <div
        className={`${
          location.pathname === "/sinh-vien-dang-nhap"
            ? " "
            : " h-max bg-[#e7ecf0] "
        }`}
      >
        {location.pathname === "/dashboard" ||
        location.pathname === "/ket-qua-hoc-tap" ? (
          <div className="fixed left-0 top-24">
            <MenuDashboard />
          </div>
        ) : (
          ""
        )}

        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard student={student} />
              </PrivateRoute>
            }
          />
          <Route
            path="/thong-tin-sinh-vien"
            element={
              <PrivateRoute>
                <InforStudent student={student} loading={loading} />
              </PrivateRoute>
            }
          />
          <Route
            path="/lich-hoc"
            element={
              <PrivateRoute>
                <Schedule student={student} loading={loading} />
              </PrivateRoute>
            }
          />
          <Route path="/sinh-vien-dang-nhap" element={<Login />} />
          <Route
            path="/chuong-trinh-khung"
            element={<ProgramFarmwork student={student} />}
          />
          <Route
            path="/de-xuat-bieu-mau"
            element={<FormProposal student={student} />}
          />
          <Route
            path="/dang-ky-hoc-phan"
            element={<RegisterCourse student={student} />}
          />
          <Route
            path="/ket-qua-hoc-tap"
            element={<Result student={student} />}
          />
          <Route
            path="/cong-no-sinh-vien"
            element={<StudentDebt student={student} />}
          />
          <Route
            path="/thanh-toan-truc-tuyen"
            element={<PaymentOnline student={student} />}
          />
          <Route path="/phieu-thu" element={<BillOnline student={student} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
