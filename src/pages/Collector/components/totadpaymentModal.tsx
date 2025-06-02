import { useState, useEffect } from "react";
import { Modal, Table, Card, List, Typography } from "antd";
import { DollarSign, MapPin, Calendar, CreditCard } from "lucide-react";
import dayjs from "dayjs";

interface TodayPayment {
  zone_name: string;
  login: string;
  id: number;
  day: string;
  total_collected: string;
  total_payments: string;
}

interface TodayPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payments: TodayPayment[];
}

export default function TodayPaymentsModal({
  isOpen,
  onClose,
  payments,
}: TodayPaymentsModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Zona",
      dataIndex: "zone_name",
      key: "zone_name",
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Sana",
      dataIndex: "day",
      key: "day",
      render: (text: any) => (text ? dayjs(text).format("DD.MM.YYYY") : "-"),
    },
    {
      title: "Yig'ilgan Summa",
      dataIndex: "total_collected",
      key: "total_collected",
      render: (amount: string) => Number(amount).toLocaleString(),
    },
    {
      title: "To'lovlar Soni",
      dataIndex: "total_payments",
      key: "total_payments",
    },
  ];

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.total_collected),
    0
  );

  const renderMobileView = () => (
    <List
      dataSource={payments}
      renderItem={(payment) => (
        <div className="my-3 shadow-lg rounded-2xl">
          <Card
            className="mb-4 rounded-lg shadow-2xl hover:shadow-lg transition-shadow duration-300"
            bodyStyle={{ padding: "16px" }}
            bordered={false}
            key={payment.id}
          >
            <div className="flex flex-col">
              {/* Header with ID and Date */}
              <div className="flex justify-end items-center mb-3">
                {/* <div className="flex items-center">
                  <Hash size={16} className="text-blue-500 mr-2" />
                  <Typography.Text strong>{payment.id}</Typography.Text>
                </div> */}
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-lg">
                  <Calendar size={14} className="text-gray-500 mr-1" />
                  <Typography.Text type="secondary" className="text-xs">
                    {payment.day
                      ? dayjs(payment.day).format("DD.MM.YYYY HH:mm:ss")
                      : "-"}
                  </Typography.Text>
                </div>
              </div>

              {/* Zone and Login Info */}

              <div className=" rounded-lg mb-3">
                <div className="flex items-center ">
                  <MapPin size={16} className="text-green-500 mr-2" />
                  <Typography.Text strong className="text-gray-700">
                    {payment.zone_name}
                  </Typography.Text>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <Typography.Text type="secondary" className="text-xs mb-1">
                    Yig'ilgan Summa
                  </Typography.Text>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-red-500 mr-1" />
                    <Typography.Text strong className="text-lg">
                      {Number(payment.total_collected).toLocaleString()}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="ml-1 text-xs">
                      UZS
                    </Typography.Text>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <Typography.Text type="secondary" className="text-xs mb-1">
                    To'lovlar Soni
                  </Typography.Text>
                  <div className="flex items-center">
                    <CreditCard size={16} className="text-blue-500 mr-1" />
                    <Typography.Text strong>
                      {payment.total_payments}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="ml-1 text-xs">
                      ta
                    </Typography.Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      pagination={{ pageSize: 10 }}
    />
  );

  return (
    <Modal
      style={{ top: 10 }}
      title={
        <span style={{ fontWeight: 700, fontSize: isMobile ? 20 : 24 }}>
          Bugungi To'lovlar
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "95%" : 800}
    >
      <div className="mb-4">
        <p className="text-gray-500 font-semibold text-[16px]">
          Jami:{" "}
          <span className="text-black font-bold">
            {" "}
            {payments.length} ta to'lov
          </span>
        </p>
        <p className="text-gray-500 font-semibold text-[16px]">
          Jami summa:{" "}
          <span className="text-black font-bold">
            {" "}
            {totalAmount.toLocaleString()} so'm
          </span>
        </p>
      </div>

      {isMobile ? (
        renderMobileView()
      ) : (
        <Table
          dataSource={payments.map((payment) => ({
            ...payment,
            key: payment.id,
          }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
        />
      )}
    </Modal>
  );
}
