import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Table, Alert, Select, Button, Input, message } from "antd";
import { MainLayout } from "../../../components/mainlayout";
import { BASE_URL } from "../../../config";
import { User, Building2, Phone, DollarSign, Search, X } from "lucide-react";
import { ProductFilled } from "@ant-design/icons";
import { PiUniteSquare } from "react-icons/pi";
import { BsCash, BsCashCoin } from "react-icons/bs";
// import UserDetailsModal from "../dashboard/userDetails";
import UserHistoryPaymentModal from "../../Admin/components/userHistoryPaymentModal";
import { CollectorLayout } from "../../../components/collectorLayout";
import UserDetailsModal from "./userDetailsCollector";
import PaymentModal from "./paymentModal";

interface UserData {
  id: number;
  name: string;
  product_name: string;
  phone_number: string;
  address: string;
  payment_status: boolean;
  created_at: string;
  workplace_name: string;
  cost: any;
  zone_id: number;
  workplace_id: number;
  last_payment_amount: number;
}

interface Workplace {
  id: number;
  workplace_name: string;
}

export default function UsersCollec() {
  const { id } = useParams();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [isOpenUserHistoryModalOpen, setIsOpenUserHistoryModal] =
    useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");

  const [workplaceId, setWorkplaceId] = useState<number | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [workplaceError, setWorkplaceError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  console.log("id", id);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/filter/${id}?page=${1}`);
      if (!response.ok)
        throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchWorkplaces = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/workplace`);
      if (!response.ok)
        throw new Error("Ish joylarini yuklashda xatolik yuz berdi");
      const data = await response.json();
      setWorkplaces(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchWorkplaces();
  }, [fetchUsers, fetchWorkplaces]);

  const handleFilterWorkplace = async (selectedWorkplaceId?: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/users/filter-workplace?page=1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zone_id: Number(id),
            workplace_id: selectedWorkplaceId ?? workplaceId, // Agar `selectedWorkplaceId` kelsa, shuni ishlatamiz
          }),
        }
      );
      if (!response.ok) throw new Error("Filtrlashda xatolik yuz berdi");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterUsers = async () => {
    if (!workplaceId) {
      setWorkplaceError("Ish joyini ham tanlang");
      return;
    }
    setWorkplaceError(null);
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/filter?page=${1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone_id: Number(id),
          workplace_id: workplaceId,
          payment_status: paymentStatus,
        }),
      });
      if (!response.ok) throw new Error("Filtrlashda xatolik yuz berdi");
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPaymentModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedUserId(null);
  };

  const handleOpenUserDetailsModal = async (userId: number) => {
    setUserDetailsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      if (!response.ok)
        throw new Error(
          "Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi"
        );
      const data = await response.json();
      setSelectedUserDetails(data);
      setIsUserDetailsModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUserDetailsLoading(false);
    }
  };

  // const handleOpenUserHistoryModal = async (userId: number) => {
  //   setUserDetailsLoading(true);
  //   try {
  //     const response = await fetch(`${BASE_URL}/users/${userId}`);
  //     if (!response.ok)
  //       throw new Error(
  //         "Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi"
  //       );
  //     const data = await response.json();
  //     setSelectedUserDetails(data);
  //     setIsOpenUserHistoryModal(true);
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setUserDetailsLoading(false);
  //   }
  // };

  const handleCloseUserDetailsModal = () => {
    setIsUserDetailsModalOpen(false);
    setSelectedUserDetails(null);
  };
  const handleCloseUserHistoryModal = () => {
    setIsOpenUserHistoryModal(false);
    setSelectedUserDetails(null);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ism",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Narxi",
      dataIndex: "cost",
      key: "cost",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "Raqam 1",
      dataIndex: "phone_number",
      key: "phone",
      render: (phone: any) => (
        <a href={`tel:${phone}`} className="text-blue-500 underline">
          {phone}
        </a>
      ),
    },
    {
      title: "So'nggi to'lov miqdori",
      dataIndex: "last_payment_amount",
      key: "last_payment_amount",
      render: (amount: string, record: { payment_status: boolean }) => (
        <span
          className={`font-medium ${
            record.payment_status ? "text-green-500" : "text-red-500"
          }`}
        >
          {amount ? Number(amount).toLocaleString() + " UZS" : "0 UZS"}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      render: (_: any, record: UserData) => (
        <div className="flex  gap-4 items-center">
          <button
            className=" cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenPaymentModal(record.id);
            }}
          >
            <span
              className={`text-2xl ${
                record.payment_status ? "text-green-800" : "text-red-800"
              }`}
            >
              <BsCash />
            </span>
          </button>
          <button
            className="bg-blue-600 py-1 px-3 text-white rounded-md cursor-pointer"
            onClick={() => handleOpenUserDetailsModal(record.id)}
          >
            Batafsil
          </button>
          {/* <button
            className="bg-blue-600 py-1 px-3 text-white rounded-md cursor-pointer"
            onClick={() => handleOpenUserHistoryModal(record.id)}
          >
            To'lov tarixi
          </button> */}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <MainLayout>
        <Alert message="Xatolik" description={error} type="error" showIcon />
      </MainLayout>
    );
  }

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${BASE_URL}/users/search/${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (response.status === 404 || !Array.isArray(data)) {
        setUsers([]);
        message.error("Topilmadi");
        return;
      }

      setUsers(data);
    } catch (err: any) {
      setUsers([]);
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <CollectorLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Xaridorlar ro'yxati</h1>
        <p className="text-gray-600">
          <span className="capitalize font-bold">{title}</span> tanlangan hudud
          bo'yicha Xaridorlar
        </p>
      </div>
      <div className="flex justify-between xl:flex-row flex-col xl:items-center items-start">
        <div className="mb-4 flex items-center gap-1">
          <Input
            placeholder="Qidirish (telefon, ism yoki ID)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" onClick={handleSearch} loading={isSearching}>
            <Search className="size-4" />
          </Button>
          <Button
            onClick={() => {
              setSearchQuery("");
              handleSearch();
              fetchUsers();
            }}
          >
            <X />
          </Button>
        </div>
        <div className="flex gap-2 xl:flex-row flex-col xl:items-center items-start">
          <div className="mb-4 flex items-center flex-col gap-1">
            <div className="flex items-center gap-1">
              <Select
                showSearch
                optionFilterProp="label"
                filterSort={(optionA: any, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                placeholder="Ishxona"
                value={workplaceId}
                onChange={(value) => {
                  setWorkplaceId(value);
                  handleFilterWorkplace(value);
                }}
                style={{ width: 180 }}
              >
                {workplaces.map((workplace) => (
                  <Select.Option
                    key={workplace.id}
                    value={workplace.id}
                    label={workplace.workplace_name}
                  >
                    {workplace.workplace_name}
                  </Select.Option>
                ))}
              </Select>
              <Button
                onClick={() => {
                  setWorkplaceId(null);
                  fetchUsers();
                }}
              >
                <X />
              </Button>
            </div>
            {workplaceError && (
              <p className="text-red-500 text-sm mt-1">{workplaceError}</p>
            )}
          </div>

          <div className="mb-4 flex items-center gap-1">
            <Select
              placeholder="To'lov holati"
              value={paymentStatus}
              onChange={(value) => setPaymentStatus(value)}
              style={{ width: 180 }}
            >
              <Select.Option value={true}>To'langan</Select.Option>
              <Select.Option value={false}>To'lanmagan</Select.Option>
            </Select>
            <Button
              type="primary"
              onClick={() => {
                setWorkplaceError(null);
                handleFilterUsers();
              }}
            >
              <Search className="size-4" />
            </Button>
            <Button
              onClick={() => {
                setPaymentStatus(null);
              }}
            >
              <X />
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          className="shadow-sm"
          loading={loading}
        />
      </div>
      <div className="md:hidden space-y-4">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">
                    Ism{" "}
                    <span
                      className="font-bold cursor-pointer text-blue-600 underline"
                      onClick={() => handleOpenUserDetailsModal(user.id)}
                    >
                      {user.name}
                    </span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm ">
                <div className="flex items-center space-x-2">
                  <PiUniteSquare className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">
                    ID: <span className="font-bold">{user.id}</span>
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>
                    Ish joyi{" "}
                    <span className="font-bold">{user.workplace_name}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>
                    Raqam:{" "}
                    <a
                      href={`tel:${user.phone_number}`}
                      className="text-blue-500 !underline font-bold"
                    >
                      {user.phone_number}
                    </a>
                    {/* <span className="font-bold">{user.phone_number}</span> */}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ProductFilled className="w-4 h-4" />
                  <span>
                    Maxsulot nomi:{" "}
                    <span className="font-bold">{user.product_name}</span>
                  </span>
                </div>
                <span
                  className={` py-1 rounded-full flex items-center gap-2 font-bold ${
                    user.payment_status ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <BsCashCoin className="w-4 h-4 mt-1 text-black" />
                  <span>
                    <span className="font-medium text-black mr-1">
                      So'ngi To'lov:
                    </span>{" "}
                    {Number(user.last_payment_amount).toLocaleString()}
                  </span>
                </span>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Narxi{" "}
                      <span className="font-bold">
                        {Number(user.cost).toLocaleString()}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 items-center">
                    <button
                      className=" cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPaymentModal(user.id);
                      }}
                    >
                      <span
                        className={`text-2xl ${
                          user.payment_status
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        <BsCash />
                      </span>
                    </button>
                    <button
                      className="bg-blue-600 py-1 px-3 text-white rounded-md cursor-pointer"
                      onClick={() => handleOpenUserDetailsModal(user.id)}
                    >
                      To'liq malumot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Foydalanuvchi topilmadi</p>
        )}
      </div>
      {selectedUserId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={handleClosePaymentModal}
          userId={selectedUserId}
          fetchUsers={fetchUsers}
        />
      )}
      <UserHistoryPaymentModal
        isOpen={isOpenUserHistoryModalOpen}
        onClose={handleCloseUserHistoryModal}
        userData={selectedUserDetails}
      />
      <UserDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={handleCloseUserDetailsModal}
        userData={selectedUserDetails}
        loading={userDetailsLoading}
      />
    </CollectorLayout>
  );
}
