import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Chart = ({ data, selectedSemester }) => {
  const groupedData = useMemo(() => {
    const regex = /HK (\d+) - NH (\d{4})/;
    const match = selectedSemester?.match(regex);

    // Kiểm tra xem match có phải là null hay không trước khi tiếp tục
    if (!match) return []; // Nếu không có match, trả về mảng rỗng

    const semesterData = data?.find(
      (item) => item.hCK === match[1] && item.nMHC === match[2]
    );

    if (!semesterData) return []; // Nếu không tìm thấy semesterData, trả về mảng rỗng

    return semesterData.itemPoints.map((subject) => ({
      name: subject.mNHC, // Tên môn học
      y: parseFloat(subject.tongket), // Điểm tổng kết
    }));
  }, [data, selectedSemester]);

  const options = {
    chart: {
      type: "column",
      zooming: {
        type: "xy",
      },
    },
    title: {
      text: `Thống kê điểm tổng kết - Học kỳ ${selectedSemester}`,
    },

    yAxis: [
      {
        // Primary yAxis
        title: {
          text: "Điểm TB lớp học phần",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
      },
      {
        // Secondary yAxis
        title: {
          text: "Điểm của bạn",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: " điểm",
    },
    legend: {
      align: "left",
      verticalAlign: "bottom",
    },
    series: [
      {
        name: "Điểm tổng kết",
        data: groupedData,
        color: "orange",
      },
    ],
  };

  // Kiểm tra xem groupedData có rỗng không
  if (groupedData.length === 0) {
    return (
      <div className="no-data">
        <img
          src="https://sinhvien.dau.edu.vn/Content/ThemeMXH/img/tkkqht.png"
          alt=""
        />
      </div>
    );
  }

  return (
    <div className="chart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Chart;
