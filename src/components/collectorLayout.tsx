"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { CiLocationOn } from "react-icons/ci";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import api from "../Api/Api";
import { BiBasket } from "react-icons/bi";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/collectorDashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/statistic",
    icon: <CiLocationOn />,
    label: "Statistika",
  },
  {
    key: "/collectorBasket",
    icon: <BiBasket />,
    label: "Korzinka",
  },
];

export function CollectorLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colec, setColec] = useState<any>("");
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const token = localStorage.getItem("tokenCollector");
  const id = localStorage.getItem("collectorId");
  useEffect(() => {
    if (!token) {
      navigate("/collectorLogin");
    }
  }, [navigate, token]);

  const toggleDesktopSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const f = async () => {
      const res = await api.get(`/collector/${id}`);
      setColec(res.data);
    };
    f();
  }, []);

  const toggleMobileSidebar = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("tokenCollector");
    navigate("/collectorLogin");
  };

  const DesktopSidebar = () => (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="hidden md:block !min-h-screen"
    >
      <div className="flex justify-center items-center py-4">
        <p className="text-2xl font-bold text-gray-400">Yig'uvchi</p>
      </div>
      <div className="flex flex-col justify-between min-h-[85vh]">
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
      </div>
    </Sider>
  );

  const MobileSidebar = () => (
    <div
      className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#001529] transform ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center p-4">
        <p className="text-2xl font-bold text-gray-400">Yig'uvchi</p>
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
  );

  return (
    <Layout className="min-h-screen">
      <DesktopSidebar />
      <MobileSidebar />
      <Layout>
        <Header
          className="flex justify-between items-center"
          style={{ backgroundColor: "white" }}
        >
          <button
            onClick={toggleDesktopSidebar}
            className="text-base w-16 h-16 hidden xl:flex"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div>
            <button
              onClick={toggleMobileSidebar}
              className="text-base w-6 h-6 xl:hidden block"
            >
              {<MenuUnfoldOutlined />}
            </button>
          </div>
          <div className="flex items-center  gap-3">
            <img
              src="/img.jpg"
              alt="Profile picture"
              className="object-cover w-12 h-12 rounded-full border border-gray-300"
            />
            <div className="text-xl capitalize">
              <p>{colec.login}</p>
            </div>
          </div>
        </Header>
        <Content
          className="m-6 p-6 min-h-[280px]"
          style={{ background: colorBgContainer }}
        >
          {children}
          <Outlet />
        </Content>
      </Layout>
      {mobileMenuOpen && (
        <div
          style={{ backdropFilter: "blur(1px)" }}
          className="md:hidden fixed inset-0 bg-white/5 bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </Layout>
  );
}
