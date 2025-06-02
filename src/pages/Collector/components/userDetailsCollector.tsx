import type React from "react";
import { useState, useEffect } from "react";
import { Modal, Spin, Table, message, Input, Select } from "antd";
// import { Edit2, Save, X } from "lucide-react";
// import {
//   User,
//   Package,
//   DollarSign,
//   Phone,
//   Briefcase,
//   MapPin,
//   UserCheck,
//   CreditCard,
//   FileText,
//   Calendar,
// } from "lucide-react";
// import { BASE_URL } from "../../config";
import api from "../../../Api/Api";

interface UserDetails {
  id: number;
  name: string;
  product_name: string;
  cost: number;
  phone_number: string;
  phone_number2: string;
  workplace_name: string;
  time: number;
  zone_name: string;
  seller: string;
  passport_series: string;
  description: string;
  given_day: string;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserDetails | null;
  loading?: boolean;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  userData,
  loading,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [editingKey] = useState<string | null>(null);

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

  const isEditing = (record: any) => record.id === editingKey;

  //   const edit = (record: any) => {
  //     setEditingKey(record.id);
  //   };

  //   const cancel = () => {
  //     setEditingKey(null);
  //   };

  //   const save = async (id: string) => {
  //     try {
  //       const row = paymentHistory.find((item) => item.id === id);
  //       const response = await fetch(`${BASE_URL}/payment/update-history/${id}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           amount: row.payment_amount,
  //           payment_month: row.payment_month,
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to update payment history");
  //       }

  //       const updatedData = await response.json();
  //       setPaymentHistory((prevHistory) =>
  //         prevHistory.map((item) =>
  //           item.id === id ? { ...item, ...updatedData } : item
  //         )
  //       );
  //       setEditingKey(null);
  //       message.success("Payment history updated successfully");
  //     } catch (error) {
  //       console.error("Error updating payment history:", error);
  //       message.error("Failed to update payment history");
  //     }
  //   };

  const handleChange = (value: string, id: string, field: string) => {
    setPaymentHistory((prevHistory) =>
      prevHistory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ];

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
    {
      title: "Oy",
      dataIndex: "payment_month",
      key: "payment_month",
      render: (text: string, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={text}
            onChange={(value) =>
              handleChange(value, record.id, "payment_month")
            }
            style={{ width: "100%" }}
          >
            {months.map((month) => (
              <Select.Option key={month} value={month}>
                {month}
              </Select.Option>
            ))}
          </Select>
        ) : (
          Number(text).toLocaleString()
        );
      },
    },
    { title: "Yig'uvchi", dataIndex: "login", key: "login" },
    {
      title: "To'lov miqdori",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (text: string, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={Number(text).toLocaleString()}
            onChange={(e) =>
              handleChange(e.target.value, record.id, "payment_amount")
            }
          />
        ) : (
          Number(text).toLocaleString()
        );
      },
    },
    // {
    //   title: "Amallar",
    //   dataIndex: "operation",
    //   render: (_: any, record: any) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span className="flex space-x-2">
    //         <Button
    //           onClick={() => save(record.id)}
    //           icon={<Save className="w-4 h-4" />}
    //           className="flex items-center"
    //         >
    //           Saqlash
    //         </Button>
    //         <Button
    //           onClick={cancel}
    //           icon={<X className="w-4 h-4" />}
    //           className="flex items-center"
    //         >
    //           Bekor qilish
    //         </Button>
    //       </span>
    //     ) : (
    //       <Button
    //         disabled={editingKey !== null}
    //         onClick={() => edit(record)}
    //         icon={<Edit2 className="w-4 h-4" />}
    //         className="flex items-center"
    //       >
    //         Tahrirlash
    //       </Button>
    //     );
    //   },
    // },
  ];

  // Add a custom renderer for mobile view
  const mobileRenderer = (record: any) => {
    const editable = isEditing(record);
    return (
      <div className="space-y-2 p-4">
        <div className="flex justify-between">
          <span className="font-semibold">Sana:</span>
          <span>{formatDate(record.payment_date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Manzili:</span>
          <span>{record.zone_name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Oy:</span>
          {editable ? (
            <Select
              value={record.payment_month}
              onChange={(value) =>
                handleChange(value, record.id, "payment_month")
              }
              style={{ width: "50%" }}
            >
              {months.map((month) => (
                <Select.Option key={month} value={month}>
                  {month}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <span>{record.payment_month}</span>
          )}
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Yig'uvchi:</span>
          <span>{record.login}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">To'lov miqdori:</span>
          {editable ? (
            <Input
              value={Number(record.payment_amount).toLocaleString()}
              onChange={(e) =>
                handleChange(e.target.value, record.id, "payment_amount")
              }
              style={{ width: "50%" }}
            />
          ) : (
            <span>{Number(record.payment_amount).toLocaleString()}</span>
          )}
        </div>
        {/* <div className="flex justify-end space-x-2">
          {editable ? (
            <>
              <Button
                onClick={() => save(record.id)}
                icon={<Save className="w-4 h-4" />}
                className="flex items-center"
              >
                Saqlash
              </Button>
              <Button
                onClick={cancel}
                icon={<X className="w-4 h-4" />}
                className="flex items-center"
              >
                Bekor qilish
              </Button>
            </>
          ) : (
            <Button
              disabled={editingKey !== null}
              onClick={() => edit(record)}
              icon={<Edit2 className="w-4 h-4" />}
              className="flex items-center"
            >
              Tahrirlash
            </Button>
          )}
        </div> */}
      </div>
    );
  };

  const userInfoColumns = [
    { title: "Ma'lumot", dataIndex: "label", key: "label" },
    { title: "Qiymat", dataIndex: "value", key: "value" },
  ];

  const getUserInfo = (user: any) => {
    // const paymentStatus = user.payment_status ? "To'landi" : "Qarz";
    // const paymentStatusColor = user.payment_status ? "green" : "red";

    return [
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
      { label: "Narxi", value: `${Number(user.cost).toLocaleString()} USZ` },
      {
        label: "Oylik to'lov",
        value: `${Number(user.monthly_income).toLocaleString()} UZS`,
      },
      { label: "Manzili", value: user.zone_name },
      { label: "Berilgan vaqti", value: formatDate(user.given_day) },
      { label: "Ish joyi", value: user.workplace_name },
      { label: "Olingan muddati", value: `${user.time} oyga` },
      { label: "Malumot", value: user.description },
      {
        label: "Qolgan summa",
        value: `${Number(user.rest).toLocaleString()} UZS`,
      },
      {
        label: "To'lov",
        value: `${Number(user.payment).toLocaleString()} UZS`,
      },
      {
        label: "So'nggi to'lov",
        value: `${Number(user.last_payment_amount).toLocaleString()} UZS`,
      },
      // {
      //   label: "O'tgan oylik tolov holati",
      //   value: (
      //     <span style={{ color: paymentStatusColor }}>{paymentStatus}</span>
      //   ),
      // },
    ];
  };

  // const renderDetailItem = (
  //   icon: React.ReactNode,
  //   label: string,
  //   value: string | number
  // ) => (
  //   <div className="mb-4 p-4 bg-gray-50 rounded-lg">
  //     <div className="flex items-center mb-2 text-gray-600">
  //       {icon}
  //       <span className="ml-2 font-medium">{label}</span>
  //     </div>
  //     <div className="text-lg">{value}</div>
  //   </div>
  // );

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await api.get(`/payment/history/${userData?.id}`);

        setPaymentHistory(response.data || []);
      } catch (err) {
        console.log(err);

        // setError("To'lov tarixini olishda xatolik yuz berdi");
        message.error("To'lov tarixini olishda xatolik yuz berdi");
      }
    };
    fetchPaymentHistory();
  }, [userData?.id]);

  return (
    <Modal
      className="xl:min-w-[1000px]"
      title={
        <h2 className="text-2xl font-bold mb-4">Foydalanuvchi ma'lumotlari</h2>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      style={{ top: isFullScreen ? "4px" : "24px", padding: 0 }}
      bodyStyle={{
        height: "80vh",
        overflowY: "auto",
        padding: isFullScreen ? "4px" : "24px",
      }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : userData ? (
        <div className="min-w-full">
          <h3 className="font-bold text-[20px] my-5" style={{ marginTop: 20 }}>
            To'liq malumot
          </h3>
          <Table
            dataSource={getUserInfo(userData)}
            columns={userInfoColumns}
            showHeader={false}
            pagination={false}
            bordered
            loading={loading}
          />
          <h3 className="font-bold text-[20px] my-5" style={{ marginTop: 20 }}>
            To'lov Tarixi
          </h3>
          <Table
            // style={{ minWidth: "100%" }}
            dataSource={paymentHistory}
            columns={paymentColumns}
            pagination={{ pageSize: 10 }}
            bordered
            loading={loading}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: mobileRenderer,
              showExpandColumn: false,
            }}
            className="hidden md:block !min-w-full"
          />
          <div className="md:hidden min-w-full">
            {paymentHistory.map((record) => (
              <div
                key={record.id}
                className="mb-4 min-w-full border rounded-lg shadow"
              >
                {mobileRenderer(record)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg">Ma'lumot topilmadi</p>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
