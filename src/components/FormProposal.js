import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

import { Col, Row } from "react-bootstrap";
import FixedSidebar from "./FixedSidebar";
import { FaDownload } from "react-icons/fa";
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
  // Fetch forms when the component is mounted
  useEffect(() => {
    getAllForms();
  }, []);
  return (
    <div className="w-1240 p-2 fix-side" style={{ minHeight: "100vh" }}>
      <Row>
        <Col sm={2}>
          <FixedSidebar />
        </Col>
        <Col sm={10}>
          <div className="bg-white p-3 rounded-md">
            <span className="font-bold mb-3 block text-[20px]">
              Đề xuất biểu mẫu
            </span>
            <hr />
            <table className="data-table">
              {/* Table Header */}
              <thead className="h-14">
                <tr>
                  <th className="">STT</th>
                  <th>Tên biểu mẫu đề xuất</th>
                  <th>Đơn gía</th>
                  <th></th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {forms?.map((item, index) => {
                  return (
                    <tr key={item._id} className="h-8">
                      <td className="">{index + 1}</td>
                      <td>{item.name}</td>
                      <td>0 VND</td>
                      <td onClick={() => handleDownload(item._id)}>
                        <FaDownload className="flex justify-center items-center w-full" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FormProposal;
