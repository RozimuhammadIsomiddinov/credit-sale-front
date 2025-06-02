import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Input, Card, Spin, message } from "antd";
import axios from "axios";
import { MainLayout } from "../../components/mainlayout";
import { BASE_URL } from "../../config";
import "react-toastify/dist/ReactToastify.css";
import { Edit2, PlusCircle, Download, MapPin } from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import api from "../../Api/Api";

interface Zone {
  id: number;
  zone_name: string;
  description: string;
  createdat: string;
}

const Zone: React.FC = () => {
  const [data, setData] = useState<Zone[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/zone`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching zones:", error);
      message.error("Hududlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handleAddZone = async () => {
    const newZone = { zone_name: zoneName, description };
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/zone/add`, newZone, {
        headers: { "Content-Type": "application/json" },
      });
      setModalVisible(false);
      setZoneName("");
      setDescription("");
      fetchZones();
      message.success("Hudud muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Error adding zone:", error);
      message.error("Hudud qo'shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateZone = async () => {
    const updatedZone = { zone_name: zoneName, description };
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/zone/update/${editId}`, updatedZone, {
        headers: { "Content-Type": "application/json" },
      });
      setModalVisible(false);
      setZoneName("");
      setDescription("");
      setEditId(null);
      fetchZones();
      message.success("Hudud muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Error updating zone:", error);
      message.error("Hudud yangilashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (zone: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/excel-download?zone_name=${zone}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${zone}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Faylni yuklashda xatolik yuz berdi.");
    }
  };

  const handleDownloadAll = async () => {
    try {
      const res = await api.get("https://creditsale.uz/excel-download-all", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log("res.data", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Joy nomi", dataIndex: "zone_name", key: "zone_name" },
    { title: "Ma'lumot", dataIndex: "description", key: "description" },
    {
      title: "Vaqti",
      dataIndex: "createdat",
      key: "createdat",
      render: (text: string) => new Date(text).toLocaleString("en-GB"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Zone) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<Edit2 size={16} />}
            onClick={() => {
              setEditId(record.id);
              setZoneName(record.zone_name);
              setDescription(record.description);
              setModalVisible(true);
            }}
          >
            Tahrirlash
          </Button>
          <Button
            type="dashed"
            icon={<Download size={16} />}
            onClick={() => handleDownload(record.zone_name)}
          >
            Exel
          </Button>
          <Button
            type="dashed"
            icon={<Download size={16} />}
            onClick={handleDownloadAll}
          >
            Exel Hammasi
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-5">Zona ro'yxati</h1>
      <div className="">
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={() => {
            setModalVisible(true);
            setEditId(null);
            setZoneName("");
            setDescription("");
          }}
          className="mb-4 bg-blue-500 hover:bg-blue-600"
        >
          Zona qo'shish
        </Button>

        {/* Desktop version */}
        <div className="hidden md:block">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            loading={loading}
          />
        </div>

        {/* Mobile version */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((zone) => (
                <div>
                  <Card key={zone.id} className="shadow-md">
                    <div className="flex items-center mb-2">
                      <FaMapMarkedAlt
                        className="text-blue-500 mr-2"
                        size={20}
                      />
                      <h3 className="text-lg font-semibold">
                        {zone.zone_name}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-2">{zone.description}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(zone.createdat).toLocaleString("en-GB")}
                    </p>
                    <div className="flex gap-2 flex-col mt-8">
                      <Button
                        type="primary"
                        icon={<Edit2 size={16} />}
                        onClick={() => {
                          setEditId(zone.id);
                          setZoneName(zone.zone_name);
                          setDescription(zone.description);
                          setModalVisible(true);
                        }}
                      >
                        Tahrirlash
                      </Button>
                      <Button
                        type="dashed"
                        icon={<Download size={16} />}
                        onClick={() => handleDownload(zone.zone_name)}
                      >
                        Exel
                      </Button>
                      <Button
                        type="dashed"
                        icon={<Download size={16} />}
                        onClick={handleDownloadAll}
                      >
                        Exel Hammasi
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal
          title={editId ? "Update Zone" : "Add Zone"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={editId ? handleUpdateZone : handleAddZone}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="zoneName"
                className="block text-sm font-medium text-gray-700"
              >
                Zone name
              </label>
              <Input
                id="zoneName"
                placeholder="Zone name"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                prefix={<MapPin size={16} className="text-gray-400" />}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input.TextArea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Zone;
