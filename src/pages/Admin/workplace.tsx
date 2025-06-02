import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, Modal, Table, Card, Spin, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MainLayout } from "../../components/mainlayout";
import api from "../../Api/Api";
import { PlusCircle, Edit2 } from "lucide-react";
import { FaBuilding } from "react-icons/fa";

interface Workplace {
  id: number;
  workplace_name: string;
  description: string;
  createdat: string;
}

const Workplace: React.FC = () => {
  const [data, setData] = useState<Workplace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchWorkplaces = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/workplace");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching workplace data:", error);
      message.error("Failed to fetch workplaces");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkplaces();
  }, [fetchWorkplaces]);

  const handleAddZone = async () => {
    if (!zoneName || !description) {
      message.error("Please fill in both fields");
      return;
    }

    try {
      await api.post("/workplace/add", {
        workplace_name: zoneName,
        description,
      });
      message.success("Ish joyiga muvaffaqiyat qo'shildi!");
      setModalVisible(false);
      fetchWorkplaces();
    } catch (error) {
      console.error("Error adding workplace:", error);
      message.error("Ish joyini qo‘shishda xatolik yuz berdi");
    }
  };

  const handleUpdateZone = async () => {
    if (!zoneName || !description) {
      message.error("Iltimos, ikkala maydonni ham toʻldiring");
      return;
    }

    try {
      await api.put(`/workplace/update/${editId}`, {
        workplace_name: zoneName,
        description,
      });
      message.success("Ish joyi muvaffaqiyatli yangilandi!");
      setModalVisible(false);
      fetchWorkplaces();
    } catch (error) {
      console.error("Error updating workplace:", error);
      message.error("Ish joyini yangilashda xatolik yuz berdi");
    }
  };

  const columns: ColumnsType<Workplace> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Joy nomi",
      dataIndex: "workplace_name",
      key: "workplace_name",
    },
    {
      title: "Ma'lumot",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Vaqti",
      dataIndex: "createdat",
      key: "createdat",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Workplace) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<Edit2 size={16} />}
            onClick={() => {
              setEditId(record.id);
              setZoneName(record.workplace_name);
              setDescription(record.description);
              setModalVisible(true);
            }}
          >
            Tahrirlash
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-5">Workplace ro'yxati</h1>
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          onClick={() => {
            setModalVisible(true);
            setEditId(null);
            setZoneName("");
            setDescription("");
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Ishxona qo'shish
        </Button>
      </div>

      <div className="hidden md:block">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>

      <div className="md:hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((workplace) => (
              <div>
                <Card key={workplace.id} className="shadow-md">
                  <div className="flex items-center mb-2">
                    <FaBuilding className="text-blue-500 mr-2" size={20} />
                    <h3 className="text-lg font-semibold">
                      {workplace.workplace_name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-2">{workplace.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {new Date(workplace.createdat).toLocaleString()}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="primary"
                      icon={<Edit2 size={16} />}
                      onClick={() => {
                        setEditId(workplace.id);
                        setZoneName(workplace.workplace_name);
                        setDescription(workplace.description);
                        setModalVisible(true);
                      }}
                    >
                      Tahrirlash
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title={editId ? "Ish joyini yangilash" : "Ish joyini qo'shish"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={editId ? handleUpdateZone : handleAddZone}
      >
        <div className="my-3">
          <Input
            placeholder="Hudud name"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            className="mb-3"
          />
        </div>
        <div>
          <Input.TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Workplace;
