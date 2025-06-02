import { useEffect, useState } from "react";
import { Modal, Table, Typography, Badge, Spin } from "antd";
import type { TableColumnsType } from "antd";

interface PaymentData {
  id: number;
  name: string;
  product_name: string;
  cost: number;
  phone_number: string;
  phone_number2: string;
  time: number;
  seller: string;
  zone_name: string;
  workplace_name: string;
  payment_status: boolean;
  monthly_income: number;
  payment: number;
  passport_series: string;
  description: string;
  given_day: string;
  recycle: boolean;
  updatedat: string;
  last_payment_amount: string;
  last_payment_date: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
    }
  }, [isOpen]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://creditsale.uz/recycle/paid-all", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment data");
      }

      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumnsType<PaymentData> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Product",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (value) => new Intl.NumberFormat("uz-UZ").format(value) + " sum",
    },
    {
      title: "Phone",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
    },
    {
      title: "Hudud",
      dataIndex: "zone_name",
      key: "zone_name",
    },
    {
      title: "Ishxona",
      dataIndex: "workplace_name",
      key: "workplace_name",
    },
    {
      title: "Last Payment",
      dataIndex: "last_payment_amount",
      key: "last_payment_amount",
      render: (value) =>
        new Intl.NumberFormat("uz-UZ").format(Number(value)) + " sum",
    },
    {
      title: "Last Payment Date",
      dataIndex: "last_payment_date",
      key: "last_payment_date",
      //   render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => (
        <Badge
          status={status ? "success" : "error"}
          text={status ? "Paid" : "Unpaid"}
        />
      ),
    },
  ];

  return (
    <Modal
      title="Payment Notifications"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          scroll={{ x: 800, y: 400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      )}
    </Modal>
  );
}
