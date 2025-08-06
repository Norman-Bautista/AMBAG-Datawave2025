<<<<<<< HEAD
=======
import { useState, useEffect, useRef  } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import {
  Notifications as NotifyIcon,
  Settings as SettingIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import Notifications from "../components/Notifications";

const Layout = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Notifications Panel States
  const [notifDialogOpen, setNotifDialogOpen] = useState(false);
  // Check if current page should be full screen (no padding)
  const isFullScreenPage = location.pathname === '/ai-assistant';
  

  const notifRef = useRef(null);

  // Close notif when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDialogOpen(false);
      }
    };

    if (notifDialogOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifDialogOpen]);

  

  // Toggle open/close
    const toggleNotifDialog = () => {
      setNotifDialogOpen(prev => !prev);
    };

    const closeNotifDialog = () => {
      setNotifDialogOpen(false);
    };

    // Handle actions
    const handleApprove = (notif) => {
      console.log("✅ Approved:", notif);
      // You can also remove notif or mark as handled
    };

    const handleDecline = (notif) => {
      console.log("❌ Declined:", notif);
      // Optional: modify state here
    };

    // for Header Page Title
    const getPageTitle = () => {
      const path = location.pathname;
      if (path.includes("transactions/audit")) return "Audit Logs";
      if (path.includes("dashboard")) return "Dashboard";
      if (path.includes("goals")) return "Goals";
      if (path.includes("settings")) return "Settings";
      if (path.includes("withdrawal")) return "Withdrawal";
      if (path.includes("deposit")) return "Deposit";
      if (path.includes("transactions")) return "Transactions";
      if (path.includes("ai-assistant")) return "AI Assistant";
      if (path.includes("help-support")) return "Help Center"
      return "Dashboard";
    };


    // Global Notifs , accesses both mobile and desktop notifs
    const notifArray = [
      {
        id: 1,
        type: "request",
        title: "Goal Request from Member",
        details: "Member wants to add goal for tuition fee",
        time: "9:18am",
        date: "06/08/2025",
      },
      {
        id:2,
        type: "info",
        title: "Contribution received from Member",
        details: "Member contributed 2,500.00 PHP in Tuition Fee",
        time: "2:32pm",
        date: "06/08/2025",
      },
      {
        id: 3,
        type: "info",
        title: "Contribution received from Member",
        details: "Member contributed 2,500.00 PHP in Tuition Fee",
        time: "7:45pm",
        date: "06/08/2025",
      },
    ]

    const isUseMobile = useIsMobile();
    
    if (isUseMobile) {
      return (
        <>
        <div className="flex justify-between items-center p-4 bg-primary">
            <p className="text-md font-semibold text-secondary">
              Hello <span className="text-yellow-400 font-bold">User!</span>
            </p>
          <div className="flex gap-4">
              <button className="cursor-pointer">
                <NotifyIcon onClick={toggleNotifDialog} className="text-secondary"/>
              </button>
              <button onClick={() => navigate("/help-support")} className="cursor-pointer">
                <SupportIcon className="text-secondary" />
              </button>
              <button onClick={() => navigate("/settings")} className="cursor-pointer">
                <SettingIcon className="text-secondary" />
              </button>
          </div>
        </div>

          <Outlet />
          {notifDialogOpen && (
            <Notifications
              notifs={notifArray}
              onApprove={handleApprove}
              onDecline={handleDecline}
              onNotifClick={closeNotifDialog} // ✅ this toggles the panel off
            />
          )}

          {/* ✅ Mobile Bottom Nav */}
          {isUseMobile && !isFullScreenPage && (
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-gray-300 rounded-tl-3xl rounded-tr-3xl shadow-md flex justify-around py-2 z-50">
              <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-primary text-xs">
                🏠<span>Home</span>
              </button>
              <button onClick={() => navigate("/requests")} className="flex flex-col items-center text-gray-400 text-xs">
                📩<span>Requests</span>
              </button>
              <button onClick={() => navigate("/members")} className="flex flex-col items-center text-gray-400 text-xs">
                👥<span>Members</span>
              </button>
            </nav>
          )}
        </>
      )
    }

  return (
    <div className="flex flex-col lg:flex min-h-screen">


      {/* Sidebar */}
      <div className="">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={false}
        />
      </div>

      {/* Main */}
      <main
        className={`
          flex-1 transition-all duration-300 overflow-hidden
          ${isFullScreenPage ? "" : "px-0 lg:px-6"}
          ${isCollapsed ? "lg:ml-24" : "lg:ml-64"}
          ml-0
        `}
        
      >


        {/* Global Top Header */}
        {!isFullScreenPage && (
          <div className="hidden lg:flex lg:justify-between lg:items-center py-6 px-10 bg-primary lg:bg-white lg:w-auto">
            <h1 className="text-xl font-bold text-textcolor hidden lg:block">
              {getPageTitle()}
            </h1>
            <div className="flex gap-4 items-center text-textcolor">
              <button onClick={toggleNotifDialog}>
                <NotifyIcon className="hover:text-primary" />
              </button >
              <button onClick={()=> navigate("/help-support")} className="cursor-pointer">
                <SupportIcon className="hover:text-primary" />
              </button >
              <button onClick={() => navigate("/settings")} className="cursor-pointer">
                <SettingIcon className="hover:text-primary" />
              </button>
            </div>
          </div>
        )}

        <Outlet />
      </main>
      {notifDialogOpen && (
        <Notifications
          notifs={notifArray}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  )
}

export default Layout
>>>>>>> 89a11b2a92a3aa9de0a50de84b7b42930281f717
