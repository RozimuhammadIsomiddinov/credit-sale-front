import { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { MainLayout } from "../../components/mainlayout";
import api from "../../Api/Api";
import { Banknote, MapPin, Calendar } from "lucide-react";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const Collector = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/collector/all-money");
        setData(res.data.result);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Hudud", dataIndex: "zone_name", key: "zone_name" },
    { title: "Yig'uvchi", dataIndex: "login", key: "login" },
    {
      title: "Oy",
      dataIndex: "month",
      key: "month",
      render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
    },
    {
      title: "Jami yig'ilgan",
      dataIndex: "total_collected",
      key: "total_collected",
      render: (text: any) => Number(text).toLocaleString(),
    },
    {
      title: "Jami to'lo'vlar",
      dataIndex: "total_payments",
      key: "total_payments",
      render: (value: number) => `${value.toLocaleString()} `,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
    }).format(value);
  };

  if (error) {
    return (
      <MainLayout>
        <div className="text-red-500 text-center">{error}</div>
      </MainLayout>
    );
  }
  console.log("data", data);

  const formattedData = data.map((item: any) => ({
    ...item,
    uuid: uuidv4(), // Agar `id` yo‘q bo‘lsa, unikal id beramiz
  }));

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-5">Yig'uvchilar ro'yxati</h1>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table
          dataSource={formattedData}
          columns={columns}
          loading={loading}
          rowKey="uuid"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="space-y-4">
            {formattedData.map((item: any) => (
              <div className="my-2">
                <Card key={item.id} className="bg-white shadow-md">
                  <p className="text-2xl my-2 font-semibold">{item.login}</p>

                  <div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{item.zone_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        <span>{dayjs(item.month).format("YYYY-MM-DD")}</span>
                      </div>
                      <div className="flex items-center">
                        <Banknote className="w-5 h-5 mr-2 text-green-500" />
                        <span>
                          Yig'ilgan: {formatCurrency(item.total_collected)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Banknote className="w-5 h-5 mr-2 text-blue-500" />
                        <span>
                          To'lo'vlar: {formatCurrency(item.total_payments)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Collector;
