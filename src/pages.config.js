/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import PatientOnboarding1 from './pages/PatientOnboarding1';
import PatientOnboarding2 from './pages/PatientOnboarding2';
import PatientOnboarding3 from './pages/PatientOnboarding3';
import PatientOnboarding4 from './pages/PatientOnboarding4';
import PatientDashboard from './pages/PatientDashboard';
import RequestVisit from './pages/RequestVisit';
import PaymentScreen from './pages/PaymentScreen';
import VirtualVisit from './pages/VirtualVisit';
import PostVisitSummary from './pages/PostVisitSummary';
import ProviderOnboarding1 from './pages/ProviderOnboarding1';
import ProviderOnboarding2 from './pages/ProviderOnboarding2';
import ProviderOnboarding3 from './pages/ProviderOnboarding3';
import ProviderOnboarding4 from './pages/ProviderOnboarding4';
import ProviderOnboarding5 from './pages/ProviderOnboarding5';
import ProviderDashboard from './pages/ProviderDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import HealthRecords from './pages/HealthRecords';
import PrescriptionDetails from './pages/PrescriptionDetails';
import LabOrders from './pages/LabOrders';
import TriageScreen from './pages/TriageScreen';
import MatchingScreen from './pages/MatchingScreen';
import RateVisit from './pages/RateVisit';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "PatientOnboarding1": PatientOnboarding1,
    "PatientOnboarding2": PatientOnboarding2,
    "PatientOnboarding3": PatientOnboarding3,
    "PatientOnboarding4": PatientOnboarding4,
    "PatientDashboard": PatientDashboard,
    "RequestVisit": RequestVisit,
    "PaymentScreen": PaymentScreen,
    "VirtualVisit": VirtualVisit,
    "PostVisitSummary": PostVisitSummary,
    "ProviderOnboarding1": ProviderOnboarding1,
    "ProviderOnboarding2": ProviderOnboarding2,
    "ProviderOnboarding3": ProviderOnboarding3,
    "ProviderOnboarding4": ProviderOnboarding4,
    "ProviderOnboarding5": ProviderOnboarding5,
    "ProviderDashboard": ProviderDashboard,
    "EmployerDashboard": EmployerDashboard,
    "HealthRecords": HealthRecords,
    "PrescriptionDetails": PrescriptionDetails,
    "LabOrders": LabOrders,
    "TriageScreen": TriageScreen,
    "MatchingScreen": MatchingScreen,
    "RateVisit": RateVisit,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};