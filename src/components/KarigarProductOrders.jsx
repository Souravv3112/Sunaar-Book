import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { OrderContext } from "../context";
import OrderModal from "./OrderModal";
import { getBackgroundColor, formatDate, formatString } from "../utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const blink = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f0f2f5",
  padding: "20px 10px 0 10px",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "5px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 150px)",
  overflow: "auto",
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#E0E0E0",
  color: theme.palette.getContrastText("#E0E0E0"),
  position: "sticky",
  left: 0,
  zIndex: 2,
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#E0E0E0",
  color: theme.palette.getContrastText("#E0E0E0"),
  position: "sticky",
  top: 0,
  zIndex: 3,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.01)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
  },
  flex: "0 0 auto",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: 240,
  },
}));

const StyledChip = styled(Chip)(({ theme, date, status }) => ({
  backgroundColor: status === "complete" ? "#2e2e2e" : getBackgroundColor(date),
  color: status === "complete" ? "#fff" : "#000",
  borderRadius: 8,
  display: "flex",
  position: "absolute",
  top: 0,
  right: 0,
  border: "1px solid #D9EDF7",
  fontSize: 12,
  height: 24,
  padding: theme.spacing(0.5, 1),
  "&::before": {
    content: '""',
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: status === "complete" ? "#fff" : "#000",
    marginRight: "6px",
    animation: `${blink} 1.5s infinite`,
  },
}));

const StyledSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.primary.main,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.primary.main,
  },
}));

const KarigarProductOrders = () => {
  const { orders } = useContext(OrderContext);
  const [showKarigarView, setShowKarigarView] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    const validOrders = orders?.filter(
      (order) => order.status === "active" || order.status === "complete"
    );
    setFilteredOrders(validOrders || []);
  }, [orders]);

  const groupedOrders = useMemo(() => {
    const groups = {};
    filteredOrders.forEach((order) => {
      const key = showKarigarView
        ? order.karigar?.name || "Not Assigned"
        : order.product || "Unknown Product";
      if (!groups[key]) groups[key] = [];
      groups[key].push(order);
    });

    const sorted = {};
    Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sorted[key] = groups[key];
      });

    return sorted;
  }, [filteredOrders, showKarigarView]);

  useEffect(() => {
    const initialState = {};
    Object.keys(groupedOrders).forEach((key) => {
      initialState[key] = false; // default: all expanded
    });
    setExpandedGroups(initialState);
  }, [groupedOrders]);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const getKaratBackground = (karat) => {
    switch (karat) {
      case "18K":
        return "#c7cacb75";
      case "20K":
        return "#fbb2cb87";
      case "22K":
        return "#ade0f775";
      default:
        return "#ffffff92";
    }
  };

  const renderOrderCard = (order) => (
    <StyledCard
      key={order.order_id}
      onClick={() => handleCardClick(order)}
      sx={{
        backgroundColor: getKaratBackground(order.karat),
      }}
    >
      <CardContent sx={{ position: "relative", paddingTop: "24px" }}>
        <StyledChip
          label={order.status === "active" ? "Active" : "Complete"}
          size="small"
          date={order.delivery_date}
          status={order.status}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
            mb: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {showKarigarView ? order.product : order.karigar?.name}
        </Typography>
        <Typography variant="body2">Lot: {order.lot_weight}</Typography>
        <Typography variant="body2">
          Placed: {formatDate(order.placed_date)}
        </Typography>
        <Typography variant="body2">
          Delivery: {formatDate(order.delivery_date)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {formatString(order.description, 50)}
        </Typography>
      </CardContent>
    </StyledCard>
  );

  return (
    <StyledBox>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {showKarigarView ? "Karigar Orders" : "Product Orders"}
        </Typography>
        <FormControlLabel
          control={
            <StyledSwitch
              checked={showKarigarView}
              onChange={(e) => setShowKarigarView(e.target.checked)}
            />
          }
          label={showKarigarView ? "Karigar View" : "Product View"}
          labelPlacement="start"
          sx={{ m: 0 }}
        />
      </Box>

      {isMobile && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="outlined"
            endIcon={
              Object.values(expandedGroups).some((v) => v) ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )
            }
            onClick={() => {
              const shouldCollapse = Object.values(expandedGroups).some(
                (v) => v
              );
              const newState = {};
              Object.keys(groupedOrders).forEach(
                (key) => (newState[key] = !shouldCollapse)
              );
              setExpandedGroups(newState);
            }}
            sx={{
              borderRadius: "10px",
              borderColor: "#1976D2",
              color: "#1976D2",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#1976D2",
                color: "#fff",
                borderColor: "#1976D2",
              },
            }}
          >
            {Object.values(expandedGroups).some((v) => v)
              ? "Collapse All"
              : "Expand All"}
          </Button>
        </Box>
      )}

      {isMobile ? (
        // 📱 Mobile View: Accordion
        Object.entries(groupedOrders).map(([group, orders], index) => (
          <Accordion
            key={group}
            expanded={!!expandedGroups[group]}
            onChange={() =>
              setExpandedGroups((prev) => ({
                ...prev,
                [group]: !prev[group],
              }))
            }
            sx={{
              mb: 2,
              borderRadius: 1,
              backgroundColor: "#f8f9fb",
              border: "1px solid #ddd",
              "&::before": { display: "none" },
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                {formatString(group)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                {orders.map(renderOrderCard)}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        // 💻 Desktop View: Table
        <StyledPaper>
          <StyledTableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledHeaderCell
                    sx={{ width: "fit-content", textAlign: "center" }}
                  >
                    {showKarigarView ? "Karigar Name" : "Product"}
                  </StyledHeaderCell>
                  <StyledHeaderCell>Orders</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedOrders).map(([group, orders], index) => (
                  <TableRow
                    key={group}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "#f1f3f4" : "transparent",
                    }}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      sx={{ textAlign: "center" }}
                    >
                      <Typography>{formatString(group)}</Typography>
                    </StyledTableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {orders.map(renderOrderCard)}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </StyledPaper>
      )}

      <OrderModal
        modalOpen={modalOpen}
        order={selectedOrder}
        handleCloseModal={handleCloseModal}
        setOrder={setSelectedOrder}
      />
    </StyledBox>
  );
};

export default KarigarProductOrders;
