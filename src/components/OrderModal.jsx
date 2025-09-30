import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import React, { useContext, useState } from "react";
import OrderForm from "./OrderForm";
import { OrderContext, UserContext } from "../context";
import ConfirmDialog from "./ConfirmDialog";
import ImageDialog from "./ImageDialog";
import { formatDate } from "../utils/formatDate";

function OrderModal({ modalOpen, order, handleCloseModal, setOrder }) {
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { deleteOrder } = useContext(OrderContext);
  const { isAdmin } = useContext(UserContext);

  const handleEdit = () => {
    setOpenForm(true);
  };

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const handleCloseOpenConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    await deleteOrder(order.order_id);
    setOpenConfirmDelete(false);
    handleCloseModal();
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, md: 600 },
            maxHeight: "85vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleCloseModal}
          >
            <Close />
          </IconButton>
          {order && (
            <>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
                {`Order#${order.order_id}`}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Product
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order.product}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Vendor
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order?.karigar?.name || "-"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Karat
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order.karat}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Weight
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order.lot_weight}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Description
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order.description}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Date Placed
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {formatDate(order.placed_date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            End Date
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {formatDate(order.delivery_date)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          sx={{ border: "1px solid #ddd" }}
                        >
                          <Typography component="div" gutterBottom>
                            Status
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ border: "1px solid #ddd" }}>
                          {order.status === "active"
                            ? "Active"
                            : order.status === "complete"
                              ? "Completed"
                              : "Received"}
                        </TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6">Images</Typography>
                    {order.order_images?.length > 0 ? (
                      <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        {order.order_images.map((image, index) => (
                          <Grid item key={index} xs={4} md={6}>
                            <img
                              onClick={() => handleImageClick(image.imageUrl)}
                              src={image.imageUrl}
                              alt={`order_image_${index}`}
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                                cursor: "pointer",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography>No Images</Typography>
                    )}
                    <ImageDialog
                      imageModalOpen={imageModalOpen}
                      handleCloseImageModal={handleCloseImageModal}
                      selectedImage={selectedImage}
                    />
                  </Box>
                </Grid>
              </Grid>
              {/* End Grid Layout */}

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
                {isAdmin && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleOpenConfirmDelete}
                  >
                    Delete
                  </Button>
                )}
                <ConfirmDialog
                  openConfirm={openConfirmDelete}
                  handleCloseOpenConfirm={handleCloseOpenConfirmDelete}
                  confirmation={handleConfirmDelete}
                  title="Do you want to delete the order?"
                  info="This action cannot be undone."
                />
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {openForm && (
        <OrderForm
          open={openForm}
          setOpen={setOpenForm}
          order={order}
          setOrder={setOrder}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
}

export default OrderModal;
