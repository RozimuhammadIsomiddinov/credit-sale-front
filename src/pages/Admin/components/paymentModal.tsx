import { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "../../../config";
import { Modal } from "antd";

const PaymentModal = ({ isOpen, closeModal, handlePayment, userName }: any) => {
  const [amount, setAmount] = useState("");
  const [collector, setCollector] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [description, setDescription] = useState("");
  const [collectors, setCollectors] = useState<any[]>([]);

  const fetchCollectors = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/collector`);
      const result = await response.json();
      setCollectors(result);
    } catch (error) {
      console.error("Error fetching collectors:", error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchCollectors();
  }, [isOpen, fetchCollectors]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handlePayment({
      amount,
      collector,
      payment_month: paymentMonth,
      description,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal open={true} footer={false} onCancel={closeModal}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">To'lov qilish</h2>
      <p className="mb-4 text-lg font-semibold text-gray-700">
        Foydalanuvchi: {userName}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Miqdor
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            To'lovni oluvchi
          </label>
          <select
            value={collector}
            onChange={(e) => setCollector(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Yig'uvchini tanlang</option>
            {collectors?.map((item) => (
              <option key={item?.id} value={item?.collector_name}>
                {item?.collector_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            To'lov oyi
          </label>
          <select
            value={paymentMonth}
            onChange={(e) => setPaymentMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Oy tanlang</option>
            {[
              "Yanvar",
              "Fevral",
              "Mart",
              "Aprel",
              "May",
              "Iyun",
              "Iyul",
              "Avgust",
              "Sentyabr",
              "Oktabr",
              "Noyabr",
              "Dekabr",
            ].map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Izoh
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            To'lov qilish
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;
