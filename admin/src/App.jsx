import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import BlogPage from "./components/blog/Blog";
import RankingPage from "./components/ranking/Ranking";
import BookingPage from "./pages/Booking";
import PlanPage from "./components/planing/Planning";
import BackToTopButton from "./components/back-to-top/BackToTopButton";
import BlogDetail from "./components/blog/BlogDetail";
import Profile from "./components/profile/profile";
import Dashboard from "./components/dashboard/dashboard";
import SuggestPlaning from "./components/planing/SuggestPlaning";
import CreatePlanning from "./components/planing/CreatePlanning";
import ViewSurvey from "./components/viewsurvey/ViewSurvey";
import UserManagement from "./pages/dashboard-staff/user";
import CommentManagement from "./pages/dashboard-staff/comment";
import RevenueManagement from "./pages/dashboard-staff/revenue";
import PackagesManagement from "./pages/dashboard-staff/packages";
import FeedbackManagement from "./pages/dashboard-staff/feedback";
import PostsManagement from "./pages/dashboard-staff/posts";
import Tracking from "./pages/Tracking";
import NotificationPage from "./components/notificate/NotificationPage";
import ForgotPasswordForm from "./components/forgot-password/forgot-pasword";
import PaymentPage from "./components/payment/submitOrder";
import PaymentResult from "./components/payment/PaymentResult";
import CoachDashboard from "./components/dashboard/coach-dashboard";
import WorkScheduleManagement from "./pages/dashboard-coach/register/management-schedule";
import AdviseUser from "./pages/dashboard-coach/calendar/advise-user";
import ViewAdvise from "./components/view-advise/ViewAdvise";
import HistoryPayment from "./components/payment/PaymentHistory";

// Import component bảo vệ route
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Blog from "./components/blog/Blog";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        // ================ TRANG CÔNG KHAI ================
        {
          path: "login",
          element: <LoginPage />,
        },
        {
          path: "register",
          element: <RegisterPage />,
        },
        {
          path: "forgot-password",
          element: <ForgotPasswordForm />,
        },
        {
          path: "unauthorized",
          element: <Unauthorized />,
        },

        // ================ TRANG CHỦ MẶC ĐỊNH - CHO PHÉP TRUY CẬP CÔNG KHAI ================
        {
          index: true, // Trang mặc định khi truy cập "/"
          element: <HomePage />, 
        },

        // ================ TRANG CHỦ CHO NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP ================
        {
          path: "home",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <HomePage />
            </ProtectedRoute>
          ),
        },

        // ================ CÁC TRANG CHÍNH ================
        {
          path: "blog",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <BlogPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "blog/:id",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <BlogDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "ranking",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <RankingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "planning",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <PlanPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "booking",
          element: (
            <ProtectedRoute allowedRoles={["STAFF", "GUEST", "CUSTOMER"]}>
              <BookingPage />
            </ProtectedRoute>
          ),
        },

        // ================ TRANG DÀNH CHO GUEST, CUSTOMER ================
        {
          path: "tracking",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <Tracking />
            </ProtectedRoute>
          ),
        },
        {
          path: "viewsurvey",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <ViewSurvey />
            </ProtectedRoute>
          ),
        },
        {
          path: "viewadvise",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <ViewAdvise />
            </ProtectedRoute>
          ),
        },
        {
          path: "history-transactions",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <HistoryPayment />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <PaymentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment-result",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <PaymentResult />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment-success",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <PaymentResult />
            </ProtectedRoute>
          ),
        },
        {
          path: "payment-fail",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <PaymentResult />
            </ProtectedRoute>
          ),
        },
        {
          path: "suggest-planing",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <SuggestPlaning />
            </ProtectedRoute>
          ),
        },
        {
          path: "create-planning",
          element: (
            <ProtectedRoute allowedRoles={["GUEST", "CUSTOMER"]}>
              <CreatePlanning />
            </ProtectedRoute>
          ),
        },

        // ================ TRANG CHUNG CHO TẤT CẢ ROLE ================
        {
          path: "profile",
          element: (
            <ProtectedRoute
              allowedRoles={["STAFF", "GUEST", "CUSTOMER", "COACH", "ADMIN"]}
            >
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "noti",
          element: (
            <ProtectedRoute
              allowedRoles={["STAFF", "GUEST", "CUSTOMER", "COACH", "ADMIN"]}
            >
              <NotificationPage />
            </ProtectedRoute>
          ),
        },

        // ================ DASHBOARD ADMIN/STAFF ================
        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
              <Dashboard />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "users",
              element: <UserManagement />,
            },
            {
              path: "comments",
              element: <CommentManagement />,
            },
            {
              path: "revenue",
              element: <RevenueManagement />,
            },
            {
              path: "feedback",
              element: <FeedbackManagement />,
            },
            {
              path: "packages",
              element: <PackagesManagement />,
            },
            {
              path: "posts",
              element: <PostsManagement />,
            },
          ],
        },

        // ================ DASHBOARD COACH ================
        {
          path: "dashboard-coach",
          element: (
            <ProtectedRoute allowedRoles={["COACH"]}>
              <CoachDashboard />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "register",
              element: <WorkScheduleManagement />,
            },
            {
              path: "calendar",
              element: <AdviseUser />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <BackToTopButton />
      </PersistGate>
    </Provider>
  );
}

export default App;
