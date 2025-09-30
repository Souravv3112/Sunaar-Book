import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import OrderModal from "./OrderModal";
import { OrderContext, KarigarContext } from "../context";
import { formatDate, getBackgroundColor } from "../utils";
import ImageDialog from "./ImageDialog";
import ConfirmDialog from "./ConfirmDialog";
import { Search as SearchIcon, Eye, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const StyledBox = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(3),
  paddingLeft: "24px",
  paddingRight: "24px",
  paddingBottom: "24px",
  paddingTop: "5px",
  [theme.breakpoints.down("md")]: {
    paddingLeft: "5px",
    paddingRight: "5px",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "5px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
}));

const StyledTableContainer = styled(TableContainer)({
  // maxHeight: "calc(100vh - 200px)",
  overflow: "auto",
});

const StyledTable = styled(Table)({
  borderCollapse: "separate",
  borderSpacing: 0,
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  borderRight: "1px solid #d1d1d1",
  padding: theme.spacing(1.5),
  "&:last-child": { borderRight: "none" },
}));

const StyledHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#ECEFF1",
  color: theme.palette.getContrastText("#ECEFF1"),
  position: "sticky",
  top: 0,
  zIndex: 2,
  whiteSpace: "nowrap",
}));

const StyledTableRow = styled(TableRow)(({ theme, status, shouldHighlight }) => ({
  color: shouldHighlight
    ? "#FFFFFF" // White text for highlighted rows
    : status === "complete"
      ? "#FFFFFF"
      : "inherit",
})); const OrderTable = ({ active }) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { orders, updateOrder } = useContext(OrderContext);
  const { karigars } = useContext(KarigarContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openConfirmReceive, setOpenConfirmReceive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Add zoom state
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);

  // Helper function to check if order should have dark gray background
  const shouldHighlightOrder = (order) => {
    // Check if no karigar is assigned (karigar_id is null or undefined)
    if (order.karigar_id) {
      return false;
    }

    // Check if 24 hours have passed since placed_date
    const placedDateStr = order.placed_date;
    if (!placedDateStr) {
      return false;
    }

    // Parse the date string (format: "2025-09-22")
    const placedDate = new Date(placedDateStr + "T00:00:00");
    const currentDate = new Date();
    const hoursDifference = (currentDate - placedDate) / (1000 * 60 * 60);

    console.log(`Order ${order.order_id}: placed_date=${placedDateStr}, hoursDifference=${hoursDifference}, shouldHighlight=${hoursDifference > 24}`);

    return hoursDifference > 24;
  };

  // Helper function to get cell background color
  const getCellBackgroundColor = (order, index) => {
    if (shouldHighlightOrder(order)) {
      return "#2e3234ff"; // Charcoal black for highlighted rows
    }
    if (order.status === "complete") {
      return "#2e2e2e"; // Dark for completed orders
    }
    // Alternate row colors for normal rows
    return index % 2 === 0 ? "#FFFFFF" : "#FFFFFF";
  };

  useEffect(() => {
    const temp = orders?.filter((ele) =>
      active
        ? ele.status === "active" || ele.status === "complete"
        : ele.status === "receive"
    );
    setCurrentOrders(temp);
  }, [orders, active]);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleOpenConfirmReceive = (order) => {
    setSelectedOrder(order);
    setOpenConfirmReceive(true);
  };

  const handleCloseOpenConfirm = () => {
    setSelectedOrder(null);
    setOpenConfirm(false);
  };

  const handleCloseOpenConfirmReceive = () => {
    setSelectedOrder(null);
    setOpenConfirmReceive(false);
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3)); // Max 300% zoom
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3)); // Min 30% zoom
  };

  const handleResetZoom = () => {
    setZoomLevel(1); // Reset to 100%
  };

  // Touch handlers for pinch-to-zoom (mobile only)
  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      setIsDragging(true);
      setLastTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && isDragging) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / lastTouchDistance;

      setZoomLevel(prev => {
        const newZoom = prev * scale;
        return Math.max(0.3, Math.min(3, newZoom));
      });

      setLastTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setIsDragging(false);
    }
  };

  const handleConfirmReceive = async () => {
    const updatedOrder = {
      ...selectedOrder,
      status: "receive",
    };
    await updateOrder(updatedOrder);
    setOpenConfirmReceive(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async () => {
    const updatedOrder = {
      ...selectedOrder,
      status:
        selectedOrder.status === "complete" ||
          selectedOrder.status === "receive"
          ? "active"
          : "complete",
    };
    await updateOrder(updatedOrder);
    setOpenConfirm(false);
    setSelectedOrder(null);
  };

  const filteredOrders = currentOrders
    ?.filter(
      (order) =>
        order.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.karigar?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.karat?.toString().includes(searchTerm.toLowerCase()) ||
        order.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse();

  return (
    <StyledBox>
      <Box
        sx={{
          borderBottom: "2px solid #d1d1d1",
          padding: "10px",
          marginBottom: 2,
        }}
      >
        {/* Mobile Layout */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {/* Title and Zoom Controls Row */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: "700", fontSize: "1.1rem", whiteSpace: "nowrap" }}>
              {active ? "Active Orders" : "Received Orders"}
            </Typography>

            {/* Compact Zoom Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="Zoom Out">
                <IconButton
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 0.3}
                  size="small"
                  sx={{
                    border: "1px solid #ddd",
                    width: "32px",
                    height: "32px",
                    "&:disabled": { opacity: 0.5 }
                  }}
                >
                  <ZoomOut size={16} />
                </IconButton>
              </Tooltip>

              <Typography variant="caption" sx={{
                minWidth: "40px",
                textAlign: "center",
                fontSize: "0.75rem",
                fontWeight: "bold"
              }}>
                {Math.round(zoomLevel * 100)}%
              </Typography>

              <Tooltip title="Zoom In">
                <IconButton
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  size="small"
                  sx={{
                    border: "1px solid #ddd",
                    width: "32px",
                    height: "32px",
                    "&:disabled": { opacity: 0.5 }
                  }}
                >
                  <ZoomIn size={16} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Reset">
                <IconButton
                  onClick={handleResetZoom}
                  size="small"
                  sx={{
                    border: "1px solid #ddd",
                    width: "32px",
                    height: "32px"
                  }}
                >
                  <RotateCcw size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Search Box Row - Full Width */}
          <Box sx={{ position: "relative", width: "100%" }}>
            <SearchIcon
              size={18}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                color: "rgba(0, 0, 0, 0.54)",
              }}
            />
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingLeft: "35px",
                  height: "40px"
                },
              }}
            />
          </Box>


        </Box>

        {/* Desktop Layout */}
        <Box sx={{ display: { xs: "none", md: "flex" }, justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "700", whiteSpace: "nowrap" }}>
            {active ? "Active Orders" : "Received Orders"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "70%" }}>
            {/* Desktop Zoom Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Tooltip title="Zoom Out">
                  <IconButton
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.3}
                    size="small"
                    sx={{
                      border: "1px solid #ddd",
                      "&:disabled": { opacity: 0.5 }
                    }}
                  >
                    <ZoomOut size={18} />
                  </IconButton>
                </Tooltip>

                <Typography variant="body2" sx={{ minWidth: "45px", textAlign: "center" }}>
                  {Math.round(zoomLevel * 100)}%
                </Typography>

                <Tooltip title="Zoom In">
                  <IconButton
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    size="small"
                    sx={{
                      border: "1px solid #ddd",
                      "&:disabled": { opacity: 0.5 }
                    }}
                  >
                    <ZoomIn size={18} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Reset Zoom">
                  <IconButton
                    onClick={handleResetZoom}
                    size="small"
                    sx={{ border: "1px solid #ddd" }}
                  >
                    <RotateCcw size={18} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Desktop Search Box */}
            <Box sx={{ position: "relative", flex: 1 }}>
              <SearchIcon
                size={20}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              />
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search by Product/Karat/Description/Vendor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "35px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Zoom Container for Table */}
      <Box
        sx={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          width: `${100 / zoomLevel}%`, // Adjust container width to prevent overflow
          touchAction: "none", // Prevent default touch actions
          cursor: isDragging ? "grabbing" : "default",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <StyledPaper>
          <StyledTableContainer>
            <StyledTable stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledHeaderCell>ID</StyledHeaderCell>
                  <StyledHeaderCell>Product</StyledHeaderCell>
                  <StyledHeaderCell>Client Name</StyledHeaderCell>
                  <StyledHeaderCell>Karat</StyledHeaderCell>
                  <StyledHeaderCell>Lot Weight</StyledHeaderCell>
                  <StyledHeaderCell>Images</StyledHeaderCell>
                  <StyledHeaderCell>Description</StyledHeaderCell>
                  <StyledHeaderCell>Placed Date</StyledHeaderCell>
                  <StyledHeaderCell>Delivery Date</StyledHeaderCell>
                  <StyledHeaderCell>Vendor</StyledHeaderCell>
                  <StyledHeaderCell>Status</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders?.map((order, index) => (
                  <StyledTableRow
                    key={order.order_id}
                    status={order.status}
                    shouldHighlight={shouldHighlightOrder(order)}
                  >
                    <StyledTableCell
                      onClick={() => handleCardClick(order)}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF",
                      }}
                    >
                      <Tooltip title={`View Order #${order.order_id}`}>
                        <IconButton size="small" style={{ color: "#FBBF24" }}>
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {order.product}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {order.client_name}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {order.karat}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {order.lot_weight}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: "center",
                        maxWidth: "250px",
                        backgroundColor: getCellBackgroundColor(order, index),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          overflowX: "auto",
                          maxHeight: "120px",
                        }}
                      >
                        {order?.images?.map((image, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              flexShrink: 0,
                              marginRight: 1,
                            }}
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Order ${order.order_id}`}
                              style={{
                                height: "90px",
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "4px",
                              }}
                              onClick={() => handleImageClick(image.imageUrl)}
                            />
                          </Box>
                        ))}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {order.description}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF",
                      }}
                    >
                      {formatDate(order.placed_date)}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        backgroundColor: getBackgroundColor(order.delivery_date),
                        color: "#000000", // Always black text for delivery date
                      }}
                    >
                      {formatDate(order.delivery_date)}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        backgroundColor: getCellBackgroundColor(order, index),
                        color: (order.status === "complete" || shouldHighlightOrder(order)) && "#FFFFFF"
                      }}
                    >
                      {karigars?.find(
                        (karigar) => karigar.id === order.karigar_id
                      )?.name || ""}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        backgroundColor: getCellBackgroundColor(order, index),
                      }}
                    >
                      {/* <Button
                      sx={{
                        display: "block",
                        width: "100%",
                        marginBottom: "16px",
                        backgroundColor:
                          order.status === "complete" && "#FFFFFF",
                        "&:hover": {
                          backgroundColor: "#FFFFFF",
                        },
                      }}
                      variant="outlined"
                      onClick={() => handleOpenStatusChange(order)}
                    >
                      {order.status === "complete" || order.status === "receive"
                        ? "Mark as Active"
                        : "Mark as Complete"}
                    </Button> */}
                      {order.status !== "receive" && (
                        <Button
                          variant="outlined"
                          color="success"
                          onClick={() => handleOpenConfirmReceive(order)}
                          sx={{
                            display: "block",
                            width: "100%",
                            borderColor: "green",
                            mr: 1,
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "green",
                              borderColor: "green",
                              color: "white",
                            },
                          }}
                        >
                          Complete
                        </Button>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>
        </StyledPaper>
      </Box>
      {/* End of Zoom Container */}

      <ImageDialog
        imageModalOpen={imageModalOpen}
        handleCloseImageModal={handleCloseImageModal}
        selectedImage={selectedImage}
      />
      <OrderModal
        modalOpen={modalOpen}
        order={selectedOrder}
        setOrder={setSelectedOrder}
        handleCloseModal={handleCloseModal}
        active={active}
      />
      <ConfirmDialog
        openConfirm={openConfirm}
        handleCloseOpenConfirm={handleCloseOpenConfirm}
        confirmation={handleStatusChange}
        title="Do you want to change the status?"
        info={
          selectedOrder?.status === "complete" ||
            selectedOrder?.status === "receive"
            ? `Mark the order with id ${selectedOrder?.order_id} as Active`
            : `Mark the order with id ${selectedOrder?.order_id} as Complete`
        }
      />
      <ConfirmDialog
        openConfirm={openConfirmReceive}
        handleCloseOpenConfirm={handleCloseOpenConfirmReceive}
        confirmation={handleConfirmReceive}
        title="Do you want to change the status?"
        info="If marked as received, find the order in the history tab."
      />
    </StyledBox>
  );
};

export default OrderTable;
