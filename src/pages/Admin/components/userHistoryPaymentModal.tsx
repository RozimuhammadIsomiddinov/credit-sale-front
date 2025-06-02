import type React from "react";

import { useState, useEffect } from "react";
import { Modal, Table, message } from "antd";

import { BASE_URL } from "../../../config";

interface UserDetails {
  id: number;
  name: string;
  product_name: string;
  cost: number;
  phone_number: string;
  phone_number2: string;
  workplace_id: string;
  time: number;
  zone_id: string;
  seller: string;
  passport_series: string;
  description: string;
  given_day: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserDetails | null;
}

const UserHistoryPaymentModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const id = localStorage.getItem("collectorId");
  // console.log("paymentHistory", paymentHistory);

  useEffect(() => {
    const handleResize = () => {
      setIsFullScreen(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  const paymentColumns = [
    {
      title: "Sana",
      dataIndex: "payment_date",
      key: "payment_date",
      render: formatDate,
    },
    {
      title: "Manzili",
      dataIndex: "zone_name",
      key: "zone_name",
    },
    { title: "Oy", dataIndex: "payment_month", key: "payment_month" },
    { title: "To'lov haqida", dataIndex: "description", key: "description" },
    { title: "Yig'uvchi", dataIndex: "login", key: "login" },
  ];

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(`${BASE_URL}/payment/history/${id}`);
        const data = await response.json();

        setPaymentHistory(data.result || []);
      } catch (err) {
        message.error("To'lov tarixini olishda xatolik yuz berdi");
      }
    };
    fetchPaymentHistory();
  }, []);

  return (
    <Modal
      className="min-w-[600px]"
      title={<h2 className="text-2xl font-bold mb-4">To'lo'v tarixi</h2>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      style={{ top: isFullScreen ? "4px" : "24px", padding: 0 }}
      bodyStyle={{
        overflowY: "auto",
        padding: isFullScreen ? "4px" : "24px",
      }}
    >
      <Table
        dataSource={paymentHistory}
        columns={paymentColumns}
        pagination={false}
        bordered
      />
    </Modal>
  );
};

export default UserHistoryPaymentModal;
