import { useEffect, useState } from "react";
import { Modal, Input, Form, message, Select, InputNumber } from "antd";
import { MdAdd } from "react-icons/md";
import { BASE_URL } from "../../../config";

const Header = ({ selectedZone, setData }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [zoneOptions, setZoneOptions] = useState([]);
  const [workplaceOptions, setWorkplaceOptions] = useState([]);

  const handleAddUser = () => {
    setIsModalVisible(true);
  };
  console.log("workplaceOptions", workplaceOptions);

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${BASE_URL}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          given_day: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        message.success("Foydalanuvchi muvaffaqiyatli qo'shildi!");
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(
          `Foydalanuvchini qo'shishda xatolik: ${
            result.message || "Nomalum xatolik"
          }`
        );
      }
    } catch (error) {
      message.error("Foydalanuvchini qo'shishda xatolik yuz berdi.");
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    if (!BASE_URL) return;

    const fetchData = async (zoneName: any) => {
      try {
        let url = `${BASE_URL}/zones/filter`;
        if (zoneName) {
          url += `?zone_name=${encodeURIComponent(zoneName)}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (result?.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Hududlarni olishda xatolik:", error);
        setData([]);
      }
    };

    if (selectedZone !== null) fetchData(selectedZone);
  }, [selectedZone, setData]);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await fetch(`${BASE_URL}/zone`);
        const data = await response.json();
        setZoneOptions(
          data.map((zone: any) => ({ value: zone.id, label: zone.zone_name }))
        );
      } catch (error) {
        console.error("Hududlarni olishda xatolik:", error);
      }
    };

    const fetchWorkplaces = async () => {
      try {
        const response = await fetch(`${BASE_URL}/workplace`);
        const data = await response.json();
        setWorkplaceOptions(
          data.map((workplace: any) => ({
            value: workplace.id,
            label: workplace.workplace_name,
          }))
        );
      } catch (error) {
        console.error("Ish joylarini olishda xatolik:", error);
      }
    };

    fetchZones();
    fetchWorkplaces();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <button
          className="flex gap-4 px-4 py-2 rounded-lg bg-[#0042fd] text-white cursor-pointer"
          onClick={handleAddUser}
        >
          <MdAdd className="text-2xl" />
          <p>Klient qo'shish</p>
        </button>
      </div>

      <Modal
        style={{ top: 20, maxHeight: "600px" }}
        title={
          <span style={{ fontWeight: 700, fontSize: 24 }}>
            Foydalanuvchi qo'shish
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Yuborish"
      >
        <div className="max-h-[550px] p-4 overflow-y-auto">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            // initialValues={{
            //   cost: 0,
            //   time: 0,
            //   phone_number2: "",
            // }}
          >
            <Form.Item
              label="Ism"
              name="name"
              rules={[{ required: true, message: "Ismni kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mahsulot nomi"
              name="product_name"
              rules={[{ required: true, message: "Mahsulot nomini kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Narx"
              name="cost"
              rules={[{ required: true, message: "Narxni kiriting!" }]}
            >
              <InputNumber
                className="!w-full"
                formatter={(value: any) =>
                  value
                    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    : ""
                }
                parser={(value) => (value ? value.replace(/\s/g, "") : "0")}
                min={0}
              />
            </Form.Item>
            <Form.Item
              label="Telefon raqami"
              name="phone_number"
              rules={[
                { required: true, message: "Telefon raqamini kiriting!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Telefon raqami 2" name="phone_number2">
              <Input />
            </Form.Item>
            <Form.Item
              label="Ish joyi"
              name="workplace_id"
              rules={[{ required: true, message: "Ish joyini tanlang!" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                filterSort={(optionA: any, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={workplaceOptions}
              />
            </Form.Item>
            <Form.Item
              label="Vaqt"
              name="time"
              rules={[{ required: true, message: "Vaqtni kiriting!" }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Hudud"
              name="zone_id"
              rules={[{ required: true, message: "Hududni tanlang!" }]}
            >
              <Select options={zoneOptions} />
            </Form.Item>
            <Form.Item
              label="Sotuvchi"
              name="seller"
              rules={[{ required: true, message: "Sotuvchini kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Pasport seriyasi" name="passport_series">
              <Input />
            </Form.Item>
            <Form.Item label="Tavsif" name="description">
              <Input.TextArea />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Header;
