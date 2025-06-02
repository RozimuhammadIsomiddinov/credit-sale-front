import { Button, Divider } from "antd";
import type React from "react";
import { BsPeople } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface DashboardCardProps {
  item: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/users/${item.zone_id}?title=${item.zone_name}`)}
      className="bg-white shadow-lg rounded-xl p-6 mb-4 border border-gray-200 cursor-pointer transition-transform transform hover:scale-105"
    >
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Hudud nomi:</p>
        <h3 className=" font-bold text-gray-800">{item.zone_name}</h3>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Jami narx:</p>
        <p className="text-gray-600">
          {Number(item.total_cost).toLocaleString()}
        </p>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Umumiy hisob:</p>
        <p className="text-gray-600 ">
          {Number(item.total_amount).toLocaleString()}
        </p>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Oylik hisob:</p>
        <p className="text-gray-600 ">
          {Number(item.monthly_amount).toLocaleString()}
        </p>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Umumiy xaridorlar:</p>
        <p className="text-gray-600 ">{item.total_users}</p>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className=" flex justify-between items-center">
        <p className="text-sm text-gray-500">Tolamagan xaridorlar:</p>
        <p className="text-gray-600 ">{item.unpaid_users}</p>
      </div>
      <Divider style={{ marginBlock: 4 }} />
      <div className="mt-3">
        <Button
          type="primary"
          icon={<BsPeople size={16} />}
          onClick={() =>
            navigate(`/users/${item.zone_id}?title=${item.zone_name}`)
          }
        >
          Xaridorlar
        </Button>
      </div>
    </div>
  );
};

export default DashboardCard;
