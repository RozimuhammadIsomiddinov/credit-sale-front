import type React from "react";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, theme, Badge, message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { CiLocationOn } from "react-icons/ci";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BiBasket } from "react-icons/bi";
import PaymentList from "../pages/Admin/components/paymentList";
import api from "../Api/Api";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/zone",
    icon: <CiLocationOn />,
    label: "Hudud",
  },
  {
    key: "/workplace",
    icon: <UserOutlined />,
    label: "Ishxona",
  },
  {
    key: "/collector",
    icon: <BsFillPersonLinesFill />,
    label: "Yig'uvchilar",
  },
  {
    key: "/korzinka",
    icon: <BiBasket />,
    label: "Korzinka",
  },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [_, setNotificationModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState();
  const [modalData, setModalData] = useState<any>(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  console.log("notificationData", notificationData);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const toggleDesktopSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchNotificationCount = async () => {
    try {
      const response = await api.get(`/recycle/paid-all`);
      setNotificationData(response.data.rows);
      setNotificationCount(response.data.rowCount);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  const handleAddBasket = async (id: number) => {
    try {
      await api.put(`/recycle/to/${id}`);

      setModalData((prevData: any) => {
        if (prevData && prevData.users) {
          return {
            ...prevData,
            users: prevData.users.filter((user: any) => user.id !== id),
          };
        }
        return prevData;
      });

      fetchNotificationCount();
      message.success("Muvaffaqiyatli qoshildi");
    } catch (error) {
      console.log(error);
      message.error("An error occurred while adding the user");
    }
  };

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const openNotificationModal = () => {
    setNotificationModalOpen(true);

    setModalData({
      type: "paid",
      title: "To'laganlar Ro'yxati",
      users: notificationData,
    });
  };

  const closeNotificationModal = () => {
    setNotificationModalOpen(false);
    setModalData(null);
  };

  const DesktopSidebar = () => (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="hidden md:block !min-h-screen"
    >
      <div className="flex justify-center items-center py-4">
        <p className="text-2xl font-bold text-gray-400">Admin</p>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          ...item,
          label: (
            <Link to={item.key} className="text-gray-400 hover:text-white">
              {item.label}
            </Link>
          ),
        }))}
      />

      <div className=" px-4 ">
        <Button
          style={{
            color: "red",
            border: 0,
            backgroundColor: "transparent",
          }}
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </Button>
      </div>
    </Sider>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div
      className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#001529] transform ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center p-4">
        <p className="text-2xl font-bold text-gray-400">Admin</p>
        <Button
          type="text"
          icon={
            <MenuFoldOutlined
              style={{ color: "white" }}
              className="text-white"
            />
          }
          onClick={toggleMobileSidebar}
          className="text-white"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map((item) => ({
          ...item,
          label: (
            <Link
              to={item.key}
              className="text-gray-400 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ),
        }))}
      />
      <div className=" px-4 ">
        <Button
          style={{
            color: "red",
            border: 0,
            backgroundColor: "transparent",
          }}
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </Button>
      </div>
    </div>
  );

  const name = localStorage.getItem("name");
  return (
    <Layout className="min-h-screen">
      <DesktopSidebar />
      <MobileSidebar />
      <Layout style={{ minHeight: "screen" }} className="!min-h-screen">
        <Header
          className="flex justify-between items-center "
          style={{ backgroundColor: "white" }}
        >
          <button
            onClick={toggleDesktopSidebar}
            className="text-base w-16 h-16 hidden xl:flex"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div>
            <div>
              <button
                onClick={toggleMobileSidebar}
                className="text-base w-6 h-6 xl:hidden mt-3 block"
              >
                {<MenuUnfoldOutlined />}
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-12">
            <div className="flex justify-center items-center">
              <Badge count={notificationCount} overflowCount={99}>
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: "20px" }} />}
                  onClick={openNotificationModal}
                  className="flex items-center justify-center h-10 w-10"
                />
              </Badge>
            </div>
            <div className="flex items-center xl:mt-0 mt-3 gap-3">
              <img
                src="/img.jpg"
                alt="Profile picture"
                className="object-cover w-12 h-12 rounded-full border border-gray-300"
              />
              <div className="text-[16px] font-semibold leading-4">
                <span>{name}</span>
                {/* <p>Azizov</p> */}
              </div>
            </div>
          </div>
        </Header>
        <Content
          className="m-6 p-6 min-h-screen"
          style={{ background: colorBgContainer }}
        >
          {children}
          <Outlet />
        </Content>
      </Layout>
      {mobileMenuOpen && (
        <div
          style={{ backdropFilter: "blur(1px)" }}
          className="md:hidden fixed inset-0 bg-white/5    bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {modalData && (
        <PaymentList
          type={modalData.type}
          users={modalData.users}
          onClose={closeNotificationModal}
          basket={true}
          handleAddBasket={handleAddBasket}
        />
      )}

      {/* <NotificationModal
        isOpen={notificationModalOpen}
        onClose={closeNotificationModal}
      /> */}
    </Layout>
  );
}
