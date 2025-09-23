import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuIcon from "@mui/icons-material/Menu";
import { useCompany } from "../context/CompanyContext";
import sunarBookLogo from "../pictures/SunarBookk.png";
import OrderForm from "./OrderForm";
import KarigarList from "./KarigarList";
import UserManagementModal from "./UserManagementModal";
import { UserContext } from "../context";

export default function Header() {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openKarigarModal, setOpenKarigarModal] = useState(false);
  const [openUserManagementModal, setOpenUserManagementModal] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { logout, isAdmin, user } = useContext(UserContext);
  const companyDetails = JSON.parse(localStorage.getItem("companyDetails"));
  const companyName = companyDetails?.name?.replace(/\s+/g, "").toLowerCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpen = () => {
    setOpen(true);
    handleCloseNavMenu(false);
  };

  const handleOpenKarigarModal = () => setOpenKarigarModal(true);
  const handleCloseKarigarModal = () => setOpenKarigarModal(false);

  const handleOpenUserManagementModal = () => {
    setOpenUserManagementModal(true);
    handleCloseUserMenu();
  };
  const handleCloseUserManagementModal = () =>
    setOpenUserManagementModal(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleNavigate = (page) => {
    console.log("-------->>>>>>>>", `${companyName}/${page}`)
    navigate(`/${companyName}/${page}`);
    handleCloseNavMenu();
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const { company } = useCompany();
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#2E2E2E", minHeight: { xs: "80px", md: "90px" } }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: "46px", md: "46px !important" },
              px: { xs: 2, md: 3 },
              maxHeight: "50px",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 1,
                width: { md: "100px" },
                height: { md: "60px" },
                backgroundColor: "transparent",
                padding: 0,
                position: "absolute",
                left: { md: "24px" },
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                borderRadius: "6px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onClick={handleLogoClick}
            >
              <img src={sunarBookLogo} alt="SunarBook Logo" style={{ height: "90px", objectFit: "cover", display: "block", marginTop: "35px" }} />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* <MenuItem key="home">
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      borderBottom:
                        currentPage === "home" ? "1px solid black" : "0px",
                    }}
                    textAlign="center"
                    onClick={() => handleNavigate("/")}
                  >
                    Home
                  </Typography>
                </MenuItem> */}
                <MenuItem key="orders">
                  <Typography
                    sx={{
                      textTransform: "uppercase",
                      borderBottom:
                        currentPage === "orders" ? "1px solid black" : "0px",
                    }}
                    textAlign="center"
                    onClick={() => handleNavigate("orders")}
                  >
                    Orders
                  </Typography>
                </MenuItem>
                {isAdmin && (
                  <MenuItem key="history">
                    <Typography
                      sx={{
                        textTransform: "uppercase",
                        borderBottom:
                          currentPage === "history" ? "1px solid black" : "0px",
                      }}
                      textAlign="center"
                      onClick={() => handleNavigate("history")}
                    >
                      History
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                    onClick={handleOpen}
                  >
                    Add Order
                  </Typography>
                </MenuItem>

                <MenuItem>
                  <Typography
                    textAlign="center"
                    sx={{ textTransform: "uppercase" }}
                    onClick={handleOpenKarigarModal}
                  >
                    Karigars
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
                width: { xs: "80px" },
                height: { xs: "48px" },
                backgroundColor: "transparent",
                padding: 0,
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                borderRadius: "6px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onClick={handleLogoClick}
            >
              <img src={sunarBookLogo} alt="SunarBook Logo" style={{ height: "74px", objectFit: "cover", display: "block", marginTop: "35px" }} />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                marginTop: "50px"
              }}
            >
              {/* <Button
                key="home"
                onClick={() => handleNavigate("/")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  boxShadow:
                    currentPage === "home" ? "0px 0px 5px 0px" : "none",
                }}
              >
                Home
              </Button> */}
              <Button
                key="orders"
                onClick={() => handleNavigate("orders")}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  boxShadow:
                    currentPage === "orders" ? "0px 0px 5px 0px" : "none",
                }}
              >
                orders
              </Button>
              {isAdmin && (
                <Button
                  key="history"
                  onClick={() => handleNavigate("history")}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    boxShadow:
                      currentPage === "history" ? "0px 0px 5px 0px" : "none",
                  }}
                >
                  history
                </Button>
              )}

              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleOpen}
              >
                ADD ORDER
              </Button>

              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleOpenKarigarModal}
              >
                KARIGARS
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0, marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 160 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Box sx={{ mb: 0.5, px: 2, py: 0.5, background: "#222", borderRadius: "8px", color: "#FFD700", fontWeight: 400, fontSize: "1.1rem", letterSpacing: 2, minWidth: 140, textAlign: "center", textTransform: "uppercase", boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
                  {(() => {
                    const name = JSON.parse(localStorage.getItem("companyDetails"))?.name;
                    if (!name) return "COMPANY";
                    return name.replace(/\s+/g, " ").toUpperCase();
                  })()}
                </Box>
                <Button
                  onClick={handleOpenUserMenu}
                  sx={{
                    mt: 0.5,
                    color: "#B0C4DE",
                    borderRadius: "5px",
                    minWidth: 100,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  {user}
                  <ArrowDropDownIcon sx={{ fontSize: "1.4rem", color: "#FFD700" }} />
                </Button>
              </Box>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {isAdmin && (
                  <MenuItem
                    key="UserManagement"
                    onClick={handleOpenUserManagementModal}
                  >
                    <Typography textAlign="center">
                      Users (Admin only)
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  key="Logout"
                  onClick={() => {
                    handleCloseUserMenu();
                    handleLogout();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar >

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
