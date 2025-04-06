import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
import { SocketProvider } from "@/context/SocketContext";
import CreateGroupModal from "./components/CreateGroupModal";
import NotificationSheet from "./components/NotificationSheet";

function MainLayout() {
  const { isLoggedIn, isFirstLogin } = useSelector((state) => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  if (isFirstLogin) {
    return <Navigate to="/first-login" replace={true} />;
  }

  return (
    <SocketProvider>
      <div className="h-full w-full flex lg:flex-row flex-col">
        <Navbar />
        <main className="shrink-0 lg:h-full h-[calc(100%-100px)] flex-grow lg:bg-sky-50 bg-red lg:p-0 lg:pl-0 ">
          <Outlet />
        </main>
        <BottomNavbar />
      </div>
      <CreateGroupModal />
      <NotificationSheet />
    </SocketProvider>
  );
}

export default MainLayout;
