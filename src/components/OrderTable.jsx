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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import OrderModal from "./OrderModal";
import { OrderContext, KarigarContext } from "../context";
import { formatDate, getBackgroundColor } from "../utils";
import ImageDialog from "./ImageDialog";
import ConfirmDialog from "./ConfirmDialog";
import { Search as SearchIcon } from "lucide-react";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "5px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(212, 175, 55, 0.1)",
}));

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "calc(100vh - 200px)",
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
}));

const StyledTableRow = styled(TableRow)(({ theme, status, shouldHighlight }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: shouldHighlight
      ? "#A0A0A0" // Dark gray background for highlighted rows
      : status === "complete"
        ? "#2e2e2e"
        : "#FFFFFF", // Changed from #E5E5E5 to #FFFFFF for white background
  },
  "&:nth-of-type(even)": {
    backgroundColor: shouldHighlight
      ? "#A0A0A0" // Dark gray background for highlighted rows
      : status === "complete"
        ? "#2e2e2e"
        : "#FFFFFF",
  },
  color: status === "complete" ? "#FFFFFF" : "inherit",
}));

const OrderTable = ({ active }) => {
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

  const handleOpenStatusChange = (order) => {
    setSelectedOrder(order);
    setOpenConfirm(true);
  };

  const handleCloseOpenConfirm = () => {
    setSelectedOrder(null);
    setOpenConfirm(false);
  };

  const handleOpenConfirmReceive = (order) => {
    setSelectedOrder(order);
    setOpenConfirmReceive(true);
  };

  const handleCloseOpenConfirmReceive = () => {
    setSelectedOrder(null);
    setOpenConfirmReceive(false);
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          marginBottom: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "700" }}>
          {active ? "Active Orders" : "Received Orders"}
        </Typography>
        <Box sx={{ position: "relative", width: "50%" }}>
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
            placeholder="Search by Product/Karat/Description/Karigar"
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
                <StyledHeaderCell>Karigar</StyledHeaderCell>
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
                      color: order.status === "complete" && "#FFFFFF",
                    }}
                  >
                    {order.order_id}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {order.product}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {order.client_name}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {order.karat}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {order.lot_weight}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      maxWidth: "250px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        overflowX: "auto",
                        maxHeight: "120px",
                      }}
                    >
                      {order?.order_images?.map((image, idx) => (
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
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {order.description}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      color: order.status === "complete" && "#FFFFFF",
                    }}
                  >
                    {formatDate(order.placed_date)}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      backgroundColor: getBackgroundColor(order.delivery_date),
                      color: order.status === "complete" && "#FFFFFF",
                    }}
                  >
                    {formatDate(order.delivery_date)}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ color: order.status === "complete" && "#FFFFFF" }}
                  >
                    {karigars?.find(
                      (karigar) => karigar.id === order.karigar_id
                    )?.name || ""}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      whiteSpace: "nowrap",
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
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenConfirmReceive(order)}
                        sx={{
                          display: "block",
                          width: "100%",
                          borderColor: "green",
                          mr: 1,
                          cursor: "pointer",
                          "&:hover": {
                            borderColor: "darkgreen",
                            color: "white",
                          },
                        }}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      </StyledPaper>
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
