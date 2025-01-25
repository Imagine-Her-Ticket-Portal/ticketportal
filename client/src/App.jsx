import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import Gethelp from "./pages/gethelp/Gethelp";
import Businessupdates from "./pages/businessupdates/Businessupdates";
import { AppProvider, useModal } from "./modalProvider/Modalprovider";
import ProfileContainer from "./pages/profileContainer/ProfileContainer";
import Admin from "./pages/admin/Admin";
import TicketRequests from "./pages/ticketrequests/Ticketrequests";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage/AdminAnalyticsPage";
import AdminHomePage from "./pages/AdminHomePage/AdminHomePage";
import AdminServicesPage from "./pages/AdminServicesPage/AdminServicesPage";
import AdminTicketHistoryPage from "./pages/AdminTicketHistoryPage/AdminTicketHistoryPage";
import AdminProfilePage from "./pages/AdminProfilePage/AdminProfilePage";
import AdminGetHelpPage from "./pages/AdminGetHelpPage/AdminGetHelpPage";
import AdminBusinessUpdatesPage from "./pages/AdminBusinessUpdatesPage/AdminBusinessUpdatesPage";
import AdminCategoryContentPage from "./pages/AdminCategoryContentPage/AdminCategoryContentPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/admin" element={<AdminHomePage />}></Route>
          <Route path="/get-help" element={<Gethelp />}></Route>
          <Route path="/business-updates" element={<Businessupdates />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/profile" element={<ProfileContainer />}></Route>
          <Route path="/ticket-history/requests" element={<TicketRequests profile="true" admin={false} />}></Route>
          <Route element={<ProtectedRoutes />}>
            <Route path='/admin'>
              <Route path="requests" element={<Admin recent={true} />}></Route>
              <Route path='analytics' element={<AdminAnalyticsPage />} />
              <Route path='ticket-history' element={<AdminTicketHistoryPage />} />
              <Route path='profile' element={<AdminProfilePage />} />
              <Route path='services' element={<AdminServicesPage />} />
              <Route path="get-help" element={<AdminGetHelpPage />} />
              <Route path="business-updates" element={<AdminBusinessUpdatesPage />} />
            </Route>
            <Route path="/admin/services">
              <Route path='get-help' element={<AdminGetHelpPage />} />
              <Route path='business-updates' element={<AdminBusinessUpdatesPage />} />
            </Route>
            <Route path='/admin/services/get-help'>
              <Route path="business-strategy" element={<AdminCategoryContentPage cat="BUSINESS STRATEGY" catmain="GET HELP" />}></Route>
              <Route path="marketing" element={<AdminCategoryContentPage cat="MARKETING" catmain="GET HELP" />}></Route>
              <Route path="financial-management" element={<AdminCategoryContentPage cat="FINANCIAL MANAGEMENT" catmain="GET HELP" />}></Route>
              <Route path="technical-support" element={<AdminCategoryContentPage cat="TECHNICAL SUPPORT" catmain="GET HELP" />}></Route>
              <Route path="operation&logistics" element={<AdminCategoryContentPage cat="OPERATION & LOGISTICS" catmain="GET HELP" />}></Route>
              <Route path="others" element={<AdminCategoryContentPage cat="OTHERS" catmain="GET HELP" />}></Route>
            </Route>
            <Route path='/admin/services/business-updates'>
              <Route path='new-product-launch' element={<AdminCategoryContentPage cat='NEW PRODUCT LAUNCH' catmain='BUSINESS UPDATES' />}></Route>
              <Route path='marketing' element={<AdminCategoryContentPage cat='MARKETING' catmain='BUSINESS UPDATES' />}></Route>
              <Route path='expansion-of-business' element={<AdminCategoryContentPage cat='EXPANSION OF BUSINESS' catmain='BUSINESS UPDATES' />}></Route>
              <Route path='revenue' element={<AdminCategoryContentPage cat='REVENUE' catmain='BUSINESS UPDATES' />}></Route>
              <Route path='others' element={<AdminCategoryContentPage cat='OTHERS' catmain='BUSINESS UPDATES' />}></Route>
            </Route>
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin/ticket-history/requests" element={<TicketRequests profile="true" admin={true} />}></Route>
          </Route>
          {/* <Route path="/ticket-history/requests" element={<TicketRequests profile="true" admin={false} />}></Route> */}
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
