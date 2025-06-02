import { useState, useEffect } from "react";
import { Select, Button, Spin, Empty } from "antd";
import { BarChart2, Filter } from "lucide-react";
import { FaUser, FaUsers } from "react-icons/fa";
import StatisticCard from "./components/statisticCard";
import CollectorTable from "./components/statisticTable";
import { CollectorLayout } from "../../components/collectorLayout";
import { BASE_URL } from "../../config";
import TodayPaymentsModal from "./components/totadpaymentModal";
import axios from "axios";

interface TodayPayment {
  zone_name: string;
  login: string;
  id: number;
  day: string;
  total_collected: string;
  total_payments: string;
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [thisMonthStats, setThisMonthStats] = useState([]);
  const [oldMonthStats, setOldMonthStats] = useState([]);
  const [todayStats, setTodayStats] = useState<TodayPayment[]>([]);
  const [collectorStats, setCollectorStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [zones, setZones] = useState([]);
  const [rowCount1, setRowCount1] = useState<number | null>(null);
  const [rowCount2, setRowCount2] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState(undefined);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isTodayModalOpen, setIsTodayModalOpen] = useState(false);

  const collectorId =
    typeof window !== "undefined" ? localStorage.getItem("collectorId") : null;

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/collector/statistic/${collectorId}`
      );
      const res = await axios.get(
        `${BASE_URL}/collector/all-money-daily-by-collector/${collectorId}`
      );

      const data = await response.json();
      // const data1 = await res.json();
      setThisMonthStats(data.this_month.rows);
      setOldMonthStats(data.old_month.rows);
      setRowCount1(data.this_month.rowCount);
      setRowCount2(data.old_month.rowCount);
      setTodayStats(res.data);

      const collectorResponse = await fetch(
        `${BASE_URL}/collector/statistic-by-users-all/${collectorId}?page=${1}`,
        {
          method: "POST",
        }
      );
      const collectorData = await collectorResponse.json();
      setCollectorStats(collectorData);

      const zonesResponse = await fetch(`${BASE_URL}/zone`);
      if (!zonesResponse.ok) {
        throw new Error("Zonelarni yuklashda xatolik yuz berdi");
      }
      const zonesData = await zonesResponse.json();
      setZones(zonesData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
    setLoading(false);
  };

  const handleFilter = async () => {
    if (!selectedZone) {
      setIsFiltered(false);
      setFilteredStats([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/collector/statistic-by-users-zone?page=${1}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collector_id: Number(collectorId),
            zone_id: selectedZone,
          }),
        }
      );

      const data = await response.json();
      setFilteredStats(data);
      setIsFiltered(true);
    } catch (error) {
      console.error("Error filtering statistics:", error);
    }
    setLoading(false);
  };

  const handleClearFilter = () => {
    setSelectedZone(undefined);
    setIsFiltered(false);
    setFilteredStats([]);
  };

  const closeTodayModal = () => {
    setIsTodayModalOpen(false);
  };

  const totalAmount = todayStats.reduce(
    (sum, payment) => sum + Number(payment.total_collected),
    0
  );
  const displayData = isFiltered ? filteredStats : collectorStats;
  return (
    <CollectorLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Yig'uvchi Statistikasi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticCard
            title="Bu Oy Jami"
            count={rowCount1}
            value={thisMonthStats
              .reduce(
                (acc, curr: any) => acc + Number.parseFloat(curr.total_payment),
                0
              )
              .toFixed(2)}
            icon={<BarChart2 className="h-8 w-8 text-blue-500" />}
          />
          <StatisticCard
            title="O'tgan Oy Jami"
            count={rowCount2}
            value={oldMonthStats
              .reduce(
                (acc, curr: any) => acc + Number.parseFloat(curr.total_payment),
                0
              )
              .toFixed(2)}
            icon={<BarChart2 className="h-8 w-8 text-green-500" />}
          />

          <StatisticCard
            title="Bugun Yig'ilgan Summa"
            value={totalAmount}
            count={todayStats.length}
            icon={<FaUsers className="h-8 w-8 text-green-400" />}
            setIsTodayModalOpen={setIsTodayModalOpen}
          />
          <StatisticCard
            title="Jami Xaridorlar"
            value={collectorStats.length}
            // number={}
            icon={<FaUser className="h-8 w-8 text-purple-500" />}
          />
        </div>

        <div className="flex flex-col justify-end md:flex-row gap-4 mb-4">
          <Select
            allowClear
            placeholder="Select Zone"
            className="w-full md:w-48 flex items-center"
            value={selectedZone}
            onChange={(value) => setSelectedZone(value)}
            options={zones.map((zone: any) => ({
              value: zone.id,
              label: zone.zone_name,
            }))}
          />

          <Button
            type="primary"
            icon={<Filter className="h-4 w-4" />}
            onClick={handleFilter}
          >
            Filter
          </Button>

          {isFiltered && (
            <Button onClick={handleClearFilter}>Filterni tozalash</Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : displayData.length > 0 ? (
          <CollectorTable data={displayData} />
        ) : (
          <Empty description="Ma'lumot mavjud emas" />
        )}
      </div>

      <TodayPaymentsModal
        isOpen={isTodayModalOpen}
        onClose={closeTodayModal}
        payments={todayStats}
      />
    </CollectorLayout>
  );
}
