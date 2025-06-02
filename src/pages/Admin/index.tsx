import { Button, Table } from "antd";
import { MainLayout } from "../../components/mainlayout";
import CardsStatistic from "./components/cardsStatistic";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../config";
// import PaymentModal from "./components/paymenModal";
import TableHeader from "./components/header";
import DashboardCard from "./components/cardResponsiv";
import { useNavigate } from "react-router-dom";
import { BsPeople } from "react-icons/bs";

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [zones, setZones] = useState([]);
  // const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [_, setError] = useState("");
  // const [selectPayUser] = useState("");
  const [__, setTotalPages] = useState(1);
  const itemsPerPage = 20;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!BASE_URL) {
      setError("API URL aniqlanmagan! Iltimos, .env faylni tekshiring.");
      return;
    }

    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/count`);
        if (!response.ok) {
          throw new Error("Foydalanuvchilar sonini olishda xatolik yuz berdi");
        }
        const { count } = await response.json();
        setTotalPages(Math.ceil(count / itemsPerPage));
      } catch (error: any) {
        setError(error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        await fetchUserCount();

        let url = `${BASE_URL}/zone/about`;
        if (selectedZone) {
          url += `?zone=${selectedZone}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        }
        const responseData = await response.json();

        setData(responseData.zones || []);

        // Zonalar ma'lumotlarini olish
        const zonesResponse = await fetch(`${BASE_URL}/zone`);
        if (!zonesResponse.ok) {
          throw new Error("Zonelarni yuklashda xatolik yuz berdi");
        }
        const zonesData = await zonesResponse.json();
        setZones(zonesData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedZone]);

  const filteredData = data.filter((item: any) => {
    const matchesSearch =
      searchTerm.length >= 2
        ? item.zone_name &&
          item.zone_name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    const matchesZone = selectedZone
      ? item.zone_id === Number.parseInt(selectedZone)
      : true;

    return matchesSearch && matchesZone;
  });

  const columns = [
    {
      title: "Id",
      dataIndex: "zone_id",
      key: "zone_id",
    },
    {
      title: "Hudud nomi",
      dataIndex: "zone_name",
      key: "zone_name",
    },
    {
      title: "Jami narx",
      dataIndex: "total_cost",
      key: "total_cost",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "Umumiy hisob",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "Oylik hisob",
      dataIndex: "monthly_amount",
      key: "monthly_amount",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "Umumiy xaridor",
      dataIndex: "total_users",
      key: "total_users",
    },
    {
      title: "Tolamagan xaridor",
      dataIndex: "unpaid_users",
      key: "unpaid_users",
    },
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<BsPeople size={16} />}
          onClick={() => handleRowClick(record)}
        >
          Xaridorlar
        </Button>
      ),
    },
  ];

  const handleRowClick = (record: any) => {
    navigate(`/users/${record.zone_id}?title=${record.zone_name}`);
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>

      <CardsStatistic />
      <TableHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        zones={zones}
        setData={setData}
      />

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 1000 }}
          dataSource={filteredData}
          rowClassName="cursor-pointer hover:bg-gray-50"
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>

      {/* Mobile and Tablet view */}
      <div className="md:hidden">
        <div>
          {filteredData.map((item: any) => (
            <DashboardCard key={item.zone_id} item={item} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
