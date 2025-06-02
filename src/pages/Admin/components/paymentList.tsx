import { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  message,
  List,
  Card,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  CreditCard,
  Clock,
  Hash,
  Users,
} from "lucide-react";
import { BASE_URL } from "../../../config";
import api from "../../../Api/Api";
import { MdOutlineAddShoppingCart } from "react-icons/md";

const { Text, Title } = Typography;

const PaymentList = ({
  type,
  users,
  onClose,
  basket,
  handleAddBasket,
}: {
  type: "notPaid" | "todayPaid" | "monthPaid";
  users: any[];
  onClose: () => void;
  basket?: boolean;
  handleAddBasket?: (id: number) => void;
}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  console.log("paymentHistory", paymentHistory);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const titles = {
    notPaid: "To'lamaganlar Ro'yxati",
    todayPaid: "Bugun To'laganlar Ro'yxati",
    monthPaid: "Bu Oy To'laganlar Ro'yxati",
  };

  const openUserDetails = async (userId: string) => {
    setLoading(true);
    try {
      const userResponse = await fetch(`${BASE_URL}/users/${userId}`);
      // if (!userResponse.ok) {
      //   throw new Error(
      //     "Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi"
      //   );
      // }
      const userData = await userResponse.json();
      setSelectedUser(userData);
      await fetchPaymentHistory(userId);
    } catch (err) {
      setError("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi");
      message.error("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // const fetchNotificationCount = async () => {
  //   try {
  //     await api.get(`/recycle/paid-all`);
  //   } catch (error) {
  //     console.error("Error fetching notification count:", error);
  //   }
  // };

  // const handleAddBasket = async (id: number) => {
  //   try {
  //     await api.put(`/recycle/to/${id}`);

  //     await fetchNotificationCount();
  //     message.success("Muvaffaqiyatli qoshildi");
  //     // fetchUsers();
  //   } catch (error) {
  //     console.log(error);
  //     message.error("An error occurred while adding the user");
  //   }
  // };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setPaymentHistory([]);
    setError("");
  };

  const fetchPaymentHistory = async (userId: string) => {
    try {
      const response = await api.get(`/payment/history/${userId}`);
      setPaymentHistory(response.data || []);
      console.log("response", response);
    } catch (err) {
      setError("To'lov tarixini olishda xatolik yuz berdi");
      message.error("To'lov tarixini olishda xatolik yuz berdi");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}.${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}.${date.getFullYear()}`;
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Ismi", dataIndex: "name", key: "name" },
    { title: "Maxsulot nomi", dataIndex: "product_name", key: "product_name" },
    { title: "Hudud", dataIndex: "zone_name", key: "zone_name" },
    {
      title: "Narxi",
      dataIndex: "cost",
      key: "cost",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "To'lov",
      dataIndex: "payment",
      render: (payment: any) => `${Number(payment).toLocaleString()}`,
    },
    {
      title: "Qolgan summa",
      dataIndex: "rest",
      render: (rest: any) => `${Number(rest).toLocaleString()}`,
    },

    {
      title: "Berilgan vaqti",
      dataIndex: "given_day",
      key: "given_day",
      render: (text: string) => (text ? formatDate(text) : "Noma'lum"),
    },
    { title: "Muddati", dataIndex: "time", key: "time" },
    { title: "Tel nomer", dataIndex: "phone_number", key: "phone_number" },
    { title: "Sotuvchi", dataIndex: "seller", key: "seller" },
  ];

  if (basket) {
    columns.push({
      title: "Qo'shish",
      key: "addToBasket",
      render: (_: any, record: { id: any }) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleAddBasket?.(record.id);
          }}
          className="flex !px-1.5 items-center justify-center"
        >
          <MdOutlineAddShoppingCart className="w-4 h-4" />
        </Button>
      ),
    } as any);
  }

  const todayPaidUsers = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Zona", dataIndex: "zone_name", key: "zone_name" },
    { title: "Yig'uvchi", dataIndex: "login", key: "login" },
    {
      title: "Kun",
      dataIndex: "day",
      key: "day",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Jami yig'ilgan",
      dataIndex: "total_collected",
      key: "total_collected",
      render: (text: any) => Number(text).toLocaleString() + " UZS",
    },
    {
      title: "Jami foydalanuvchi",
      dataIndex: "total_payments",
      key: "total_payments",
    },
    {
      title: "Actions",
    },
  ];

  const renderMobileList = (data: any[], columns: any[]) => {
    const paginatedData = data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <>
        <List
          dataSource={paginatedData}
          renderItem={(item) => (
            <Card
              className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
              onClick={() => type !== "todayPaid" && openUserDetails(item.id)}
            >
              <div className="flex flex-col space-y-2">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center">
                    {column.icon && (
                      <column.icon size={16} className="mr-2 text-blue-500" />
                    )}
                    <Text type="secondary" className="mr-2">
                      {column.title}:
                    </Text>
                    <Text strong>
                      {column.render
                        ? column.render(item[column.dataIndex])
                        : item[column.dataIndex]}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          )}
        />
        <div className="flex justify-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Oldingi
          </Button>
          <Text strong className="mx-4">
            {currentPage} / {Math.ceil(data.length / pageSize)}
          </Text>
          <Button
            disabled={currentPage === Math.ceil(data.length / pageSize)}
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(Math.ceil(data.length / pageSize), prev + 1)
              )
            }
          >
            Keyingi
          </Button>
        </div>
      </>
    );
  };

  const renderUserInfo = (user: any) => {
    // const paymentStatus = user.payment_status ? "To'landi" : "Qarz";
    // const paymentStatusColor = user.payment_status ? "green" : "red";

    const userInfo = [
      { label: "Ismi", value: user.name, icon: User },
      { label: "Telefon raqami", value: user.phone_number, icon: Phone },
      {
        label: "Qo'shimcha telefon raqami",
        value: user.phone_number2,
        icon: Phone,
      },
      { label: "Mahsulot nomi", value: user.product_name, icon: ShoppingBag },
      {
        label: "Narxi",
        value: `${Number(user.cost).toLocaleString()} USZ`,
        icon: DollarSign,
      },
      {
        label: "Jami",
        value: `${Number(user.payment).toLocaleString()} USZ`,
        icon: DollarSign,
      },
      {
        label: "To'lov",
        value: `${Number(user.monthly_income).toLocaleString()} UZS`,
        icon: CreditCard,
      },
      {
        label: "So'nggi to'lov",
        value: `${Number(user.last_payment_amount).toLocaleString()} UZS`,
        icon: CreditCard,
      },
      {
        label: "Qolgan summa",
        value: `${Number(user.rest).toLocaleString()} UZS`,
        icon: CreditCard,
      },
      { label: "Hudud", value: user.zone_name, icon: MapPin },
      {
        label: "Berilgan vaqti",
        value: formatDate(user.given_day),
        icon: Calendar,
      },
      { label: "Ish joyi", value: user.workplace_name, icon: MapPin },
      { label: "Olingan muddati", value: `${user.time} oyga`, icon: Clock },
      { label: "Malumot", value: user.description },
      // {
      //   label: "O'tgan oylik tolov holati",
      //   value: paymentStatus,
      //   color: paymentStatusColor,
      // },
    ];

    return (
      <List
        dataSource={userInfo}
        renderItem={(item: any) => (
          <List.Item>
            <Space align="center">
              {item.icon && <item.icon size={16} className="text-blue-500" />}
              <Text type="secondary">{item.label}:</Text>
              {item.label.includes("telefon") ? (
                <a
                  href={`tel:${item.value}`}
                  className="text-blue-500 underline"
                >
                  {item.value}
                </a>
              ) : (
                <Text strong style={item.color ? { color: item.color } : {}}>
                  {item.value}
                </Text>
              )}
            </Space>
          </List.Item>
        )}
      />
    );
  };

  console.log("selectedUser", selectedUser);

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          {selectedUser && (
            <Button onClick={closeUserDetails} icon={<ArrowLeft size={16} />} />
          )}
          <Title level={4}>{titles[type]}</Title>
        </Space>
      }
      width={isMobile ? "100%" : "80%"}
      style={{ top: 20 }}
    >
      <div className="xl:h-auto !h-[600px] overflow-auto">
        {selectedUser ? (
          <div className="max-h-[70vh] overflow-y-auto px-4">
            <Title level={5} className="mt-4 mb-2">
              To'liq malumot
            </Title>
            {renderUserInfo(selectedUser)}
            <Divider />
            <Title level={5} className="mt-4 mb-2">
              To'lov Tarixi
            </Title>
            {error && <Text type="danger">{error}</Text>}
            {isMobile ? (
              renderMobileList(paymentHistory, [
                {
                  title: "Sana",
                  dataIndex: "payment_date",
                  key: "payment_date",
                  render: formatDate,
                  icon: Calendar,
                },
                {
                  title: "Hudud",
                  dataIndex: "zone_name",
                  key: "zone_name",
                  icon: MapPin,
                },
                {
                  title: "Oy",
                  dataIndex: "payment_month",
                  key: "payment_month",
                  icon: Clock,
                },

                {
                  title: "To'lov",
                  dataIndex: "payment_amount",
                  key: "payment_amount",
                  icon: Clock,
                  render: (t: any) => Number(t).toLocaleString(),
                },
                {
                  title: "To'lov haqida",
                  dataIndex: "description",
                  key: "description",
                  icon: CreditCard,
                },
                {
                  title: "Yig'uvchi",
                  dataIndex: "login",
                  key: "login",
                  icon: User,
                },
              ])
            ) : (
              <Table
                dataSource={paymentHistory}
                columns={[
                  {
                    title: "Sana",
                    dataIndex: "payment_date",
                    key: "payment_date",
                    render: formatDate,
                  },
                  { title: "Hudud", dataIndex: "zone_name", key: "zone_name" },
                  {
                    title: "Oy",
                    dataIndex: "payment_month",
                    key: "payment_month",
                  },
                  {
                    title: "To'lov",
                    dataIndex: "payment_amount",
                    key: "payment_amount",
                    render: (t: any) => Number(t).toLocaleString(),
                  },
                  {
                    title: "To'lov haqida",
                    dataIndex: "description",
                    key: "description",
                  },
                  { title: "Yig'uvchi", dataIndex: "login", key: "login" },
                ]}
                pagination={{ pageSize: 10 }}
                bordered
                loading={loading}
              />
            )}
          </div>
        ) : isMobile ? (
          <div className="px-4">
            {renderMobileList(
              users,
              type === "todayPaid"
                ? [
                    { title: "ID", dataIndex: "id", key: "id", icon: Hash },
                    {
                      title: "Zona",
                      dataIndex: "zone_name",
                      key: "zone_name",
                      icon: MapPin,
                    },
                    {
                      title: "Yig'uvchi",
                      dataIndex: "login",
                      key: "login",
                      icon: User,
                    },
                    {
                      title: "Kun",
                      dataIndex: "day",
                      key: "day",
                      render: formatDate,
                      icon: Calendar,
                    },
                    {
                      title: "Jami yig'ilgan",
                      dataIndex: "total_collected",
                      key: "total_collected",
                      render: (text: any) =>
                        Number(text).toLocaleString() + " UZS",
                      icon: DollarSign,
                    },
                    {
                      title: "Jami foydalanuvchi",
                      dataIndex: "total_payments",
                      key: "total_payments",
                      icon: Users,
                    },
                  ]
                : [
                    { title: "Id", dataIndex: "id", key: "id", icon: Hash },
                    {
                      title: "Ismi",
                      dataIndex: "name",
                      key: "name",
                      icon: User,
                    },
                    {
                      title: "Maxsulot nomi",
                      dataIndex: "product_name",
                      key: "product_name",
                      icon: ShoppingBag,
                    },
                    {
                      title: "Hudud",
                      dataIndex: "zone_name",
                      key: "zone_name",
                      icon: MapPin,
                    },
                    {
                      title: "Narxi",
                      dataIndex: "cost",
                      key: "cost",
                      render: (text: any) =>
                        Number(text).toLocaleString() + " UZS",
                      icon: DollarSign,
                    },

                    {
                      title: "Berilgan vaqti",
                      dataIndex: "given_day",
                      key: "given_day",
                      render: (text: string) =>
                        text ? formatDate(text) : "Noma'lum",
                      icon: Calendar,
                    },
                    {
                      title: "Muddati",
                      dataIndex: "time",
                      key: "time",
                      icon: Clock,
                    },
                    {
                      title: "Tel nomer",
                      dataIndex: "phone_number",
                      key: "phone_number",
                      icon: Phone,
                    },
                    {
                      title: "Sotuvchi",
                      dataIndex: "seller",
                      key: "seller",
                      icon: User,
                    },
                  ]
            )}
          </div>
        ) : (
          <Table
            dataSource={users}
            columns={
              type === "todayPaid"
                ? todayPaidUsers
                : (columns as unknown as any)
            }
            rowKey="id"
            onRow={(record: any) => ({
              onClick: () => type !== "todayPaid" && openUserDetails(record.id),
              style: { cursor: type !== "todayPaid" ? "pointer" : "default" },
            })}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            bordered
          />
        )}
      </div>
    </Modal>
  );
};

export default PaymentList;
