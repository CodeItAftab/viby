import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  if (isLoggedIn) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
