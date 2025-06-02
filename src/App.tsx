import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import Home from "./pages/Admin/home";
import Zone from "./pages/Admin/Zone";
import Collector from "./pages/Admin/collector";
import Workplace from "./pages/Admin/workplace";
import { ToastContainer } from "react-toastify";
import CollectorLoginPage from "./pages/collectorLogin";
import UsersPage from "./pages/Admin/userPage";
import DashboardCollector from "./pages/Collector/dashboardCollector";
import UsersCollec from "./pages/Collector/components/usersCallector";
import StatisticsContent from "./pages/Collector/statistic";
import ErrorBoundary from "./components/ErrorBoundary";
import { ConfigProvider, App as AntApp } from "antd";
import Korzinka from "./pages/Admin/korzinka";
import CollectorBasket from "./pages/Collector/collectorBasket";

function App() {
  return (
    <ConfigProvider>
      <AntApp>
        <ErrorBoundary>
          <BrowserRouter>
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              {/* <Route path="/collector" element={<Collector />} /> */}
              <Route path="/collector" element={<Collector />} />
              <Route path="/collectorLogin" element={<CollectorLoginPage />} />
              <Route path="/zone" element={<Zone />} />
              <Route path="/korzinka" element={<Korzinka />} />
              <Route
                path="/collectorDashboard"
                element={<DashboardCollector />}
              />
              <Route path="/workplace" element={<Workplace />} />
              <Route path="/collectorBasket" element={<CollectorBasket />} />
              <Route path="/statistic" element={<StatisticsContent />} />
              <Route path="/users/:id" element={<UsersPage />} />
              <Route path="/usersCollector/:id" element={<UsersCollec />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
