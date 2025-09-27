import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Package,
  History,
  Plus,
  Users,
  LogOut,
  User
} from 'lucide-react';
import sunarBookLogo from "../pictures/logo1.png";
import OrderForm from "./OrderForm";
import KarigarList from "./KarigarList";
import UserManagementModal from "./UserManagementModal";
import { UserContext } from "../context";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname.split("/")[1];

  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openKarigarModal, setOpenKarigarModal] = useState(false);
  const [openUserManagementModal, setOpenUserManagementModal] = useState(false);

  // Context data
  const { logout, isAdmin, user } = useContext(UserContext);
  const companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
  const companyName = companyDetails?.name?.replace(/\s+/g, "").toLowerCase();

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleOpenKarigarModal = () => {
    setOpenKarigarModal(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseKarigarModal = () => setOpenKarigarModal(false);

  const handleOpenUserManagementModal = () => {
    setOpenUserManagementModal(true);
    setIsUserMenuOpen(false);
  };

  const handleCloseUserManagementModal = () => setOpenUserManagementModal(false);

  const handleNavigate = (page) => {
    console.log("-------->>>>>>>>", `${companyName}/${page}`)
    navigate(`/${companyName}/${page}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const navigationItems = [
    {
      key: 'orders',
      label: 'Orders',
      icon: Package,
      onClick: () => handleNavigate('orders'),
      active: currentPage === 'orders'
    },
    ...(isAdmin ? [{
      key: 'history',
      label: 'History',
      icon: History,
      onClick: () => handleNavigate('history'),
      active: currentPage === 'history'
    }] : []),
    {
      key: 'add-order',
      label: 'Add Order',
      icon: Plus,
      onClick: handleOpen,
      active: false
    },
    {
      key: 'karigars',
      label: 'Karigars',
      icon: Users,
      onClick: handleOpenKarigarModal,
      active: false
    }
  ];

  return (
    <>
      <header className="shadow-lg relative z-50" style={{ backgroundColor: '#2e2e2e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={handleLogoClick}
            >
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={sunarBookLogo}
                    alt="SunarBook Logo"
                    className="w-full h-full object-cover"
                  />
                </div>

              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={item.onClick}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                      ${item.active
                        ? 'bg-amber-500 text-gray-900 shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm uppercase tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Company & User Section */}
            <div className="flex items-center space-x-2 md:space-x-4">

              {/* Company Name - Always visible */}
              <div className="text-right max-w-[120px] md:max-w-none">
                <div className="text-amber-400 font-bold text-xs md:text-sm uppercase tracking-wide md:tracking-widest leading-tight break-words" style={{ fontFamily: 'Libre Baskerville, serif' }}>
                  {companyDetails?.name?.replace(/\s+/g, " ").toUpperCase() || "COMPANY"}
                </div>
              </div>

              {/* User Menu */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group"
                >
                  <User size={18} className="text-gray-300" />
                  <span className="text-gray-300 text-sm font-medium">{user}</span>
                  <ChevronDown
                    size={18}
                    className={`text-amber-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 transform animate-in fade-in-0 zoom-in-95 duration-100">
                    {isAdmin && (
                      <button
                        onClick={handleOpenUserManagementModal}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-150"
                      >
                        <Users size={18} />
                        <span className="text-sm">Users (Admin only)</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-600">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Navigation Items */}
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={item.onClick}
                      className={`
                        flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 w-full text-left
                        ${item.active
                          ? 'bg-amber-500 text-gray-900'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }
                      `}
                    >
                      <IconComponent size={22} />
                      <span className="text-sm uppercase tracking-wide">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modal Components */}
      <OrderForm open={open} setOpen={setOpen} />
      <KarigarList
        openKarigarModal={openKarigarModal}
        setOpenKarigarModal={setOpenKarigarModal}
        handleCloseKarigarModal={handleCloseKarigarModal}
      />
      <UserManagementModal
        open={openUserManagementModal}
        onClose={handleCloseUserManagementModal}
      />
    </>
  );
}
