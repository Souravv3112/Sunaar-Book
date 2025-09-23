import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import { OrderProvider, KarigarProvider, UserProvider } from "./context";
import { CompanyProvider, useCompany } from "./context/CompanyContext";
import { InternetConnectionWrapper } from "./components/InternetConnectionWrapper";
import { useUser } from "./context/UserContext";

// Create a new component to wrap the routes and check for token expiration
const AuthWrapper = ({ children }) => {
  const { checkTokenAndRedirect } = useUser();

  React.useEffect(() => {
    const checkToken = () => {
      checkTokenAndRedirect();
    };

    // Check token expiration on mount and every 5 minutes
    checkToken();
    const intervalId = setInterval(checkToken, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [checkTokenAndRedirect]);

  return children;
};

function App() {
  // CompanyProvider must be mounted before using useCompany
  // So we need a wrapper component
  function CompanyRoutes() {
    const { company } = useCompany();
    const companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
    const companyName = companyDetails?.name?.replace(/\s+/g, "").toLowerCase();

    const { isLoggedIn } = useUser();

    // If companyName is not available, show login
    if (!companyName) {
      return (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      );
    }

    // Redirect logic for root route
    function RootRedirect() {
      if (isLoggedIn) {
        return <Navigate to={`/${companyName}/orders`} replace />;
      } else {
        return <Login />;
      }
    }

    return (
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path={`/${companyName}/orders`} element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        {/* <Route path={`/${companyName}/home`} element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } /> */}
        <Route path={`/${companyName}/history`} element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path={`/${companyName}/*`} element={
          <ProtectedRoute>
            <Navigate to={`/${companyName}/home`} />
          </ProtectedRoute>
        } />
      </Routes>
    );
  }

  return (
    <InternetConnectionWrapper>
      <CompanyProvider>
        <UserProvider>
          <OrderProvider>
            <KarigarProvider>
              <Router>
                <AuthWrapper>
                  <CompanyRoutes />
                </AuthWrapper>
              </Router>
            </KarigarProvider>
          </OrderProvider>
        </UserProvider>
      </CompanyProvider>
    </InternetConnectionWrapper>
  );
}

export default App;
