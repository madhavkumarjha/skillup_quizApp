import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/loader/Loader";
import { restoreSession, logout } from "../redux/features/auth/authSlice";
import authAPI from "../redux/features/auth/authAPI";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, initializing } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  useEffect(() => {
    const tryRefresh = async () => {
      if (!isAuthenticated) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          setLoadingRefresh(true);
          try {
            const response = await authAPI.refresh({ refreshToken });
            localStorage.setItem("token", response.accessToken);
            dispatch(restoreSession({ token: response.accessToken, refreshToken, user }));
          } catch (err) {
            dispatch(logout());
          } finally {
            setLoadingRefresh(false);
          }
        }
      }
    };
    tryRefresh();
  }, [isAuthenticated, dispatch, user]);

  if (initializing || loadingRefresh) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (roles.length) {
    if (!user) return <Loader />;
    if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
