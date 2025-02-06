// File: App.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
const Result = ({ student }) => {
  const [points, setPoints] = useState([]);
  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/points/point/all`);
      setPoints(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchStudent();
  }, []);

  // const studentPointInfo = points.filter(
  //   (point) => point.mLP === student?.education_info?.class
  // );

  const result = points?.flatMap((item) =>
    item.members
      .filter((member) => member.mssv === student.student_id)
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

  groupedData.forEach((group) => {
    const totalCredits = group.itemPoints.reduce(
      (sum, point) => sum + Number(point.sTNCh),
      0
    );
    const totalScores = group.itemPoints.reduce(
      (sum, point) => sum + Number(point.tongket),
      0
    );
    const averageScore = totalScores / group.itemPoints.length;

    // Gộp vào chính groupedData
    group.totalCredits = totalCredits;
    group.averageScore = averageScore.toFixed(2); // Format to 2 decimal places
  });

  return (
    <div className="learning-result  px-3 py-3" style={{ minHeight: "100vh" }}>
      <h4 className="font-bold text-[20px] text-[#667580]">Kết quả học tập</h4>

      {groupedData.length ? (
        <table className="data-table">
          {/* Table Header */}
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã lớp học phần</th>
              <th>Tên môn học</th>
              <th>Số tín chỉ</th>
              <th>KTTX</th>
              <th>
                <div className="header-group py-3 flex flex-col">
                  <span>NTTD</span>
                  <hr />
                  <span>LT Hệ số 1</span>
                </div>
              </th>
              <th>Giữa kỳ</th>
              <th>Thực hành</th>
              <th>Cuối kỳ</th>
              <th>Điểm tổng kết</th>
              <th>Thang điểm 4</th>
              <th>Điểm chữ</th>
              <th>Ghi chú</th>
              <th>Ghi chú CK</th>
              <th>Ghi chú TK</th>
              <th>Đạt</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {groupedData.map((semester, index) => (
              <>
                {/* Semester Row */}
                <tr key={index} className="semester-row">
                  <td
                    colSpan="16"
                    className="semester-title text-start px-2 text-[#578ebe]"
                  >
                    Học kỳ {semester.hCK} - Năm {semester.nMHC}
                  </td>
                </tr>

                {semester?.itemPoints.map((subject, idx) => (
                  <tr
                    key={idx}
                    className={subject.status === "fail" ? "fail-row" : ""}
                  >
                    <td>{idx + 1}</td>
                    <td>{subject.lPHCPhN}</td>
                    <td>{subject.mNHC}</td>
                    <td>{subject.sTNCh}</td>
                    <td>{subject.kttx}</td>

                    <td>{subject.nttd}</td>
                    <td>{subject.giuaky}</td>

                    <td>{subject.thuchanh}</td>
                    <td>{subject.cuoiky}</td>
                    <td>{subject.tongket}</td>
                    <td>
                      {(() => {
                        const gpa =
                          Number(subject.tongket) >= 9
                            ? 4.0
                            : Number(subject.tongket) >= 8.5
                            ? 3.7
                            : Number(subject.tongket) >= 8
                            ? 3.5
                            : Number(subject.tongket) >= 7
                            ? 3.0
                            : Number(subject.tongket) >= 6.5
                            ? 2.5
                            : Number(subject.tongket) >= 5.5
                            ? 2.0
                            : Number(subject.tongket) >= 5
                            ? 1.5
                            : Number(subject.tongket) >= 4
                            ? 1.0
                            : 0;

                        return gpa;
                      })()}
                    </td>

                    <td>
                      {(() => {
                        const letterGrade =
                          Number(subject.tongket) >= 9
                            ? "A"
                            : Number(subject.tongket) >= 8
                            ? "B+"
                            : Number(subject.tongket) >= 7
                            ? "B"
                            : Number(subject.tongket) >= 6
                            ? "C+"
                            : Number(subject.tongket) >= 5
                            ? "C"
                            : Number(subject.tongket) >= 4
                            ? "D"
                            : "F";

                        return letterGrade;
                      })()}
                    </td>

                    <td>{subject.note || ""}</td>
                    <td>{subject.noteCK || ""}</td>
                    <td>{subject.noteTK || ""}</td>
                    <td>
                      {(() => {
                        const letterGrade =
                          Number(subject.tongket) >= 9
                            ? "A"
                            : Number(subject.tongket) >= 8
                            ? "B+"
                            : Number(subject.tongket) >= 7
                            ? "B"
                            : Number(subject.tongket) >= 6
                            ? "C+"
                            : Number(subject.tongket) >= 5
                            ? "C"
                            : Number(subject.tongket) >= 4
                            ? "D"
                            : "F";

                        return (
                          <>
                            {letterGrade === "F" ? (
                              <IoClose className="text-red-500 text-[30px]" />
                            ) : (
                              <TiTick className="text-green-400 text-[30px]" />
                            )}
                          </>
                        );
                      })()}
                    </td>
                  </tr>
                ))}

                <tr className="">
                  <td colSpan="3" className="text-start px-2">
                    Điểm trung bình học kỳ: {semester.averageScore}
                  </td>
                  <td colSpan="2" className="text-start px-2">
                    Điểm trung bình học kỳ: {semester.averageScore}
                  </td>
                  <td colSpan="11"></td>
                </tr>

                <tr>
                  <td colSpan="3" className="text-start px-2">
                    Tổng số tín chỉ: {semester.totalCredits}
                  </td>
                  <td colSpan="2" className="text-start px-2">
                    Tổng số tín chỉ: {semester.totalCredits}
                  </td>
                  <td colSpan="11"></td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black font-bold text-center block mt-4 ">
          Chưa có dữ liệu
        </p>
      )}
    </div>
  );
};

export default Result;
