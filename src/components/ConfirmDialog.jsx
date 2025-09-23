import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ConfirmDialog = ({
  openConfirm,
  handleCloseOpenConfirm,
  confirmation,
  title,
  info,
}) => {
  const handleConfirmChange = () => {
    confirmation();
  };
  return (
    <Dialog open={openConfirm} onClose={handleCloseOpenConfirm}>
      <DialogTitle sx={{ textAlign: "center" }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{info}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseOpenConfirm} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirmChange} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
