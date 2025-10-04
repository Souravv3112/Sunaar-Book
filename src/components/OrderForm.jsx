import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { OrderContext, KarigarContext } from "../context";
import { products } from "../constants/products";
import { uploadImagesToS3, deleteImageFromS3 } from "../server/api";

const OrderForm = ({ open, setOpen, order, setOrder, handleCloseModal }) => {
  const initialOrderData = {
    product: "",
    customProduct: "",
    karat: "18K",
    karigar_id: undefined,
    lot_weight: "",
    description: "",
    placed_date: "",
    delivery_date: "",
    images: [],
    status: "active",
    customKarat: "",
    placed_by: "akash",
    client_name: "",
  };

  const { karigars } = useContext(KarigarContext);
  const { addOrder, updateOrder } = useContext(OrderContext);
  const [orderData, setOrderData] = useState(initialOrderData);
  const [imageFiles, setImageFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
<<<<<<< HEAD
      const imageUrls = order?.images?.map((image) => image?.imageUrl);
      // Check if the current karat or product is custom (not predefined)
=======
      const imageUrls = order?.order_images?.map((image) => image?.imageUrl);
>>>>>>> b570364 (fix: Correct title spelling in index.html and enhance OrderForm component with improved image handling and UI elements)
      const isCustomKarat = !["18K", "20K", "22K"].includes(order?.karat);
      const isCustomProduct = !products.includes(order?.product);

      setOrderData({
        ...initialOrderData,
        ...order,
        images: imageUrls,
        karigar_id: order?.karigar_id || order?.karigar?.id,
        customKarat: isCustomKarat ? order?.karat : "",
        karat: isCustomKarat ? "other" : order?.karat,
        customProduct: isCustomProduct ? order?.product : "",
        product: isCustomProduct ? "other" : order?.product,
      });
    }
    // eslint-disable-next-line
  }, [order]);

  useEffect(() => {
    const isFormValid =
      orderData.lot_weight &&
      orderData.placed_date &&
      orderData.delivery_date &&
      (!order || orderData.karigar_id) &&
      orderData.product &&
      orderData.client_name &&
      (orderData.karat !== "other" || orderData.customKarat) &&
      (orderData.product !== "other" || orderData.customProduct);

    setIsValid(isFormValid);
  }, [orderData, order]);

  const handleClose = () => {
    setOrderData(initialOrderData);
    setImageFiles([]);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));

    setOrderData((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...imagePreviews],
    }));
    setImageFiles([...imageFiles, ...files]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = orderData?.images?.[index];
    if (imageToRemove?.startsWith("blob:")) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDeletedImages((prev) => [...prev, imageToRemove]);
    }
    setOrderData((prev) => ({
      ...prev,
      images: prev?.images?.filter((_, i) => i !== index),
    }));
  };

  const handleCreateOrUpdateOrder = async () => {
    let id = order ? order.order_id : Date.now();
    let uploadedImageUrls = [];

    if (imageFiles.length > 0) {
      setLoading(true);
      uploadedImageUrls = await uploadImagesToS3(imageFiles, id);
      setLoading(false);
      if (!uploadedImageUrls) {
        alert("Failed to upload images");
        handleClose();
        return;
      }
    }
    if (deletedImages.length > 0) {
      await deleteImageFromS3(deletedImages);
    }

    const filteredImages = (orderData?.images ?? []).filter(
      (image) => !image?.startsWith("blob")
    );

    const currOrder = {
      order_id: id,
      ...orderData,
      karat:
        orderData.karat === "other" ? orderData.customKarat : orderData.karat,
      product:
        orderData.product === "other"
          ? orderData.customProduct
          : orderData.product,
      images: [...filteredImages, ...uploadedImageUrls],
    };

    if (order) {
      await updateOrder(currOrder);
      setOrder(currOrder);
      handleCloseModal();
    } else {
      await addOrder(currOrder);
    }
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "65%", lg: "50%" },
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {order ? "Edit Order" : "Add New Order"}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* FORM FIELDS */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product"
                name="product"
                value={orderData.product}
                onChange={handleChange}
                required
              />
              {orderData.product === "other" && (
                <TextField
                  fullWidth
                  label="Custom Product"
                  name="customProduct"
                  value={orderData.customProduct}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                  required
                />
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="karatLabel">Karat</InputLabel>
                <Select
                  label="karataLabel"
                  labelId="karataLabel"
                  name="karat"
                  value={orderData.karat}
                  onChange={handleChange}
                >
                  <MenuItem value="18K">18K</MenuItem>
                  <MenuItem value="20K">20K</MenuItem>
                  <MenuItem value="22K">22K</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {orderData.karat === "other" && (
                <TextField
                  fullWidth
                  label="Custom Karat"
                  name="customKarat"
                  value={orderData.customKarat}
                  onChange={handleChange}
                  sx={{ mt: 2 }}
                  required
                />
              )}
            </Grid>

            {order && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="vendorId">Vendor</InputLabel>
                  <Select
                    label="vendorId"
                    labelId="vendorId"
                    name="karigar_id"
                    value={orderData.karigar_id || ""}
                    onChange={handleChange}
                  >
                    {karigars
                      ?.sort((a, b) => a.name.localeCompare(b.name))
                      ?.map((karigar) => (
                        <MenuItem key={karigar?.id} value={karigar?.id}>
                          {karigar.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                name="client_name"
                value={orderData.client_name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Weight"
                name="lot_weight"
                value={orderData.lot_weight}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={orderData.description}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Date Placed"
                name="placed_date"
                value={orderData.placed_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Delivery Date"
                name="delivery_date"
                value={orderData.delivery_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" mb={1}>
                Upload Images
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {orderData?.images?.map((image, index) => (
                  <Chip
                    key={index}
                    label={<img src={image} alt="" style={{ width: 50, height: 50, objectFit: "cover" }} />}
                    onDelete={() => removeImage(index)}
                    variant="outlined"
                  />
                ))}
              </Box>
              <Button
                variant="outlined"
                startIcon={<FileUploadIcon />}
                component="label"
                sx={{ mt: 2 }}
              >
                Add Images
                <input type="file" hidden multiple onChange={handleImageUpload} />
              </Button>
            </Grid>
          </Grid>

          {/* ACTIONS */}
          <Divider sx={{ my: 3 }} />
          {!isValid && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              Please fill all required fields.
            </Typography>
          )}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateOrUpdateOrder}
              disabled={!isValid || loading}
              endIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? "Uploading..." : order ? "Update Order" : "Create Order"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default OrderForm;
