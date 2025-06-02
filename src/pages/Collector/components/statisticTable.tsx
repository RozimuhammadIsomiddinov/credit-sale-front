import { Table, Card, Space, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarSign, MapPin, Briefcase, CreditCard } from "lucide-react";

interface CollectorData {
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
  updatedat: string;
  last_payment_amount: number;
}

interface CollectorTableProps {
  data: CollectorData[];
}

const { Text } = Typography;

export default function ResponsiveCollectorTable({
  data,
}: CollectorTableProps) {
  const columns: ColumnsType<CollectorData> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mahsulot",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Narx",
      dataIndex: "cost",
      key: "cost",
      render: (value) => `${Number(value).toLocaleString()}`,
    },
    {
      title: "Hudud",
      dataIndex: "zone_name",
      key: "zone_name",
    },
    {
      title: "Ish joyi",
      dataIndex: "workplace_name",
      key: "workplace_name",
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
      title: "Oylik daromad",
      dataIndex: "monthly_income",
      key: "monthly_income",
      render: (value) => `${value ? value?.toFixed(2) : "-"}`,
    },
    {
      title: "To'lo'v",
      dataIndex: "payment",
      key: "payment",
      render: (value) => `${value ? value.toFixed(2) : "-"}`,
    },
  ];

  const CardView = ({ item }: { item: CollectorData }) => (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col space-y-2">
        <p className="text-[20px] font-bold">{item.name}</p>
        <p className="text-gray-500 font-semibold text-[16px]">
          {item.product_name}
        </p>
        <Space className="items-center">
          <DollarSign className="w-4 h-4 text-green-500" />
          <Text>{`${Number(item.cost).toLocaleString()} `}</Text>
        </Space>
        <Space className="items-center">
          <MapPin className="w-4 h-4 text-blue-500" />
          <Text>{item.zone_name}</Text>
        </Space>
        <Space className="items-center">
          <Briefcase className="w-4 h-4 text-purple-500" />
          <Text>{item.workplace_name}</Text>
        </Space>
        <Space className="items-center">
          <CreditCard className="w-4 h-4 text-yellow-500" />
          <Text>
            {
              <span
                className={` ${
                  item.payment_status ? " text-green-800" : " text-red-800"
                }`}
              >
                {Number(item.last_payment_amount).toLocaleString()}
              </span>
            }
          </Text>
        </Space>
        <p>
          Oylik daromad:{" "}
          <span className=" font-semibold text-[16px]">
            {Number(item.monthly_income).toLocaleString()}
          </span>
        </p>
        <p>
          To'lo'v:{" "}
          <span className=" font-semibold text-[16px]">
            {Number(item.payment).toLocaleString()}
          </span>
        </p>
      </div>
    </Card>
  );
  console.log("data", data);

  return (
    <div>
      {/* Desktop view */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          scroll={{ x: true }}
          className="shadow-md"
        />
      </div>

      {/* Mobile and Laptop view */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <CardView key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
