import { Dialog, DialogContent, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const ImageDialog = ({
  imageModalOpen,
  handleCloseImageModal,
  selectedImage,
}) => {
  return (
    <Dialog open={imageModalOpen} onClose={handleCloseImageModal}>
      {/* <DialogTitle>Image Preview</DialogTitle> */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "white",
          "&:hover": {
            bgcolor: "white",
          },
        }}
        onClick={handleCloseImageModal}
      >
        <Close />
      </IconButton>
      <DialogContent style={{ padding: 0, height: "fit-content" }}>
        <img
          src={selectedImage}
          alt="Selected Order"
          style={{ width: "100%", height: "auto" }}
        />
      </DialogContent>
      {/* <DialogActions>
        <IconButton onClick={handleCloseImageModal} color="primary">
          Close
        </IconButton>
      </DialogActions> */}
    </Dialog>
  );
};

export default ImageDialog;
