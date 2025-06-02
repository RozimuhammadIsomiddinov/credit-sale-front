import { useEffect, useState } from "react";
import { Modal, Table, Button, Typography } from "antd";
import { BASE_URL } from "../../../config";

const { Title, Text } = Typography;

const UserModal = ({ user, closeModal }: any) => {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  console.log("paymentHistory", paymentHistory);

  useEffect(() => {
    if (user?.id) {
      fetch(`${BASE_URL}/payment/history/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setPaymentHistory(data.result || []);
        })
        .catch(() => setError("To'lov tarixini olishda xatolik yuz berdi"));
    }
  }, [user?.id]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
  };

  if (!user) return null;

  const givenDayFormatted = formatDate(user.given_day);
  // const paymentStatus = user.payment_status ? "To'landi" : "Qarz";
  // const paymentStatusColor = user.payment_status ? "green" : "red";

  const userInfo = [
    { label: "Ismi", value: user.name },
    {
      label: "Telefon raqami",
      value: (
        <a
          href={`tel:${user.phone_number}`}
          className="text-blue-500 underline"
        >
          {user.phone_number}
        </a>
      ),
    },
    {
      label: "Qo'shimcha telefon raqami",
      value: (
        <a
          href={`tel:${user.phone_number2}`}
          className="text-blue-500 underline"
        >
          {user.phone_number2}
        </a>
      ),
    },
    { label: "Mahsulot nomi", value: user.product_name },
    { label: "Narxi", value: `${Number(user.cost).toLocaleString()} so'm` },
    {
      label: "Oylik to'lov",
      value: `${Number(user.monthly_income).toLocaleString()} so'm`,
    },
    { label: "Hudud", value: user.zone },
    { label: "Berilgan vaqti", value: givenDayFormatted },
    { label: "Ish joyi", value: user.workplace },
    { label: "Olingan muddati", value: `${user.time} oyga` },
    { label: "Malumot", value: user.description },
    {
      label: "So'nggi to'lov",
      value: `${Number(user.last_payment_amount).toLocaleString()} UZS`,
    },
    // {
    //   label: "O'tgan oylik tolov holati",
    //   value: <Text style={{ color: paymentStatusColor }}>{paymentStatus}</Text>,
    // },
  ];

  const paymentColumns = [
    { title: "Yig'uvchi", dataIndex: "collector", key: "collector" },
    {
      title: "Sana",
      dataIndex: "payment_date",
      key: "payment_date",
      render: formatDate,
    },
    {
      title: "Miqdor",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (amount: any) => `${Number(amount).toLocaleString()} so'm`,
    },
    { title: "Oy", dataIndex: "payment_month", key: "payment_month" },
    { title: "To'lov haqida", dataIndex: "description", key: "description" },
  ];

  return (
    <Modal
      open={true}
      onCancel={closeModal}
      footer={null}
      centered
      className=" overflow-y-auto h-[500px] sticky"
      getContainer={false}
      title={<Title level={4}>Mijoz Malumotlari</Title>}
    >
      <Table
        dataSource={userInfo.map((item, index) => ({ key: index, ...item }))}
        columns={[
          { title: "Ma'lumot", dataIndex: "label", key: "label" },
          { title: "Qiymat", dataIndex: "value", key: "value" },
        ]}
        showHeader={false}
        bordered
        pagination={false}
      />

      <Title level={5} style={{ marginTop: 20 }}>
        To'lov Tarixi
      </Title>
      {error && <Text type="danger">{error}</Text>}
      <Table
        dataSource={paymentHistory.map((item, index) => ({
          key: index,
          ...item,
        }))}
        columns={paymentColumns}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <div style={{ textAlign: "right", marginTop: 20 }}>
        <Button type="primary" danger onClick={closeModal}>
          Yopish
        </Button>
      </div>
    </Modal>
  );
};

export default UserModal;
