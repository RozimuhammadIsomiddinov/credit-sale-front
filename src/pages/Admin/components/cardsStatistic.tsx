import { Card } from "antd";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";
import PaymentList from "./paymentList";
import api from "../../../Api/Api";

const CardsStatistic = () => {
  const [stats, setStats] = useState<any>({
    allMoney: {},
    headPay: 0,
    payUser: 0,
    monthPay: 0,
    notPaidUsers: [],
    todayPaidUsers: [],
    monthPaidUsers: [],
  });

  const [modalData, setModalData] = useState<any>(null);
  const [totayPaid, setTotayPaid] = useState<any>();

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/main/all`).then((res) => res.json()),
      fetch(`${BASE_URL}/main/notPayed`).then((res) => res.json()),
      fetch(`${BASE_URL}/main/today`).then((res) => res.json()),
      fetch(`${BASE_URL}/main/month`).then((res) => res.json()),
    ])
      .then(([allMoney, notPaid, today, month]) => {
        setStats({
          allMoney,
          headPay: notPaid || 0,
          payUser: today || 0,
          monthPay: month || 0,
          notPaidUsers: notPaid.result || [],
          todayPaidUsers: today.result || [],
          monthPaidUsers: month.result || [],
        });
      })
      .catch((error) => console.error("Xatolik:", error));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/collector/all-money-daily");
      setTotayPaid(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-6">
      <Card style={{ background: "#FFF0F5", border: 0 }}>
        <p className="text-gray-600 text-[18px]">Jami pul</p>
        <h2 className="text-[22px] font-bold w-full">
          {parseInt(stats?.allMoney?.all_income?.sum || 0, 10).toLocaleString()}{" "}
          UZS
        </h2>
        <p className="text-gray-600 text-[18px]">
          {stats?.allMoney?.paid_users_count?.count || 0} /{" "}
          {stats?.allMoney?.income_users_count?.count || 0} kishi
        </p>
      </Card>

      <Card
        onClick={() =>
          setModalData({
            type: "notPaid",
            title: "To'lamaganlar Ro'yxati",
            users: stats.notPaidUsers,
          })
        }
        style={{ background: "#E6F7FF", border: 0 }}
      >
        <p className="text-gray-600 text-[18px]">To'lamaganlar</p>
        <h2 className="text-[22px] font-bold">
          {parseInt(stats?.headPay?.sum || 0, 10).toLocaleString()} UZS
        </h2>
        <p className="text-gray-600 text-[18px]">
          {stats.headPay?.count || 0} /{" "}
          {stats.allMoney?.income_users_count?.count || 0} kishi
        </p>
      </Card>

      <Card
        onClick={() =>
          setModalData({
            type: "monthPaid",
            title: "Bu oy to'laganlar",
            users: stats.monthPaidUsers,
          })
        }
        style={{ background: "#F6FFED", border: 0 }}
      >
        <p className="text-gray-600 text-[18px]">Bu oydagi to'lov</p>
        <h2 className="text-[22px] font-bold">
          {parseInt(stats?.monthPay?.sum || 0, 10).toLocaleString()} UZS
        </h2>
        <p className="text-gray-600 text-[18px]">
          {stats.monthPay?.count || 0} kishi
        </p>
      </Card>

      <Card
        onClick={() =>
          setModalData({
            type: "todayPaid",
            title: "Bugun to'laganlar",
            users: totayPaid,
          })
        }
        style={{ background: "#FFF7E6", border: 0 }}
      >
        <p className="text-gray-600 text-[18px]">Bugungi to'lov</p>
        <h2 className="text-[22px] font-bold">
          {parseInt(stats?.payUser?.sum || 0, 10).toLocaleString()} UZS
        </h2>
        <p className="text-gray-600 text-[18px]">
          {stats.payUser?.count || 0} kishi
        </p>
      </Card>

      {modalData && (
        <PaymentList
          type={modalData.type}
          users={modalData.users}
          onClose={() => setModalData(null)}
          basket={false}
        />
      )}
    </div>
  );
};

export default CardsStatistic;
