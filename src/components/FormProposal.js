import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Table } from "antd";

import { Col, Row } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import { FaDownload } from "react-icons/fa";
import HeadingTitle from "./HeadingTitle";
const FormProposal = ({ student }) => {
  const [forms, setForms] = useState([]);

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/forms/forms/${id}/download`,
        {
          responseType: "blob",
        }
      );

      // Get file name from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      let fileName = "form.doc"; // Default value

      if (disposition && disposition.indexOf("filename=") !== -1) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "");
      } else {
        // Get file name from the form data if header doesn't contain it
        const name = forms.find((item) => item._id === id);
        const trimmedPath = name?.fileUrl
          ? name.fileUrl.replace("/uploads/", "").replace(".doc", "")
          : "form";
        fileName = `${trimmedPath}.doc`; // Ensure the default .doc extension
      }

      // Create a Blob URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element and trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();

      // Revoke the Blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Error downloading file");
    }
  };
  const getAllForms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/forms/forms");
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      message.error("Error fetching forms");
    }
  };
  useEffect(() => {
    getAllForms();
  }, []);
  const dataSource = forms?.map((item, index) => ({
    key: item._id,
    index: index + 1,
    name: item.name,
    price: "0 VND",
    _id: item._id,
  }));

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      align: "center",
    },
    {
      title: "Tên biểu mẫu đề xuất",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Tải xuống",
      dataIndex: "download",
      key: "download",
      align: "center",
      render: (_, record) => (
        <FaDownload
          className="cursor-pointer w-full text-center"
          onClick={() => handleDownload(record._id)}
        />
      ),
    },
  ];
  return (
    <div className="w-1240 p-2 w-full" style={{ minHeight: "100vh" }}>
      <div className="flex gap-2">
        <div className="hidden sm:block md:w-2/12">
          <FixedSidebar />
        </div>
        <div className="w-full sm:w-full md:w-10/12">
          <div className="bg-white p-3 rounded-md">
            <HeadingTitle title="Đề xuất biểu mẫu" />
            <hr />
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProposal;
