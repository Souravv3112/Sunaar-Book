import { Snackbar, Alert } from "@mui/material";

const AlertSnackbar = ({
  alertOpen,
  alertSeverity,
  alertMessage,
  setAlertOpen,
}) => {
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={2000}
      onClose={handleAlertClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleAlertClose}
        severity={alertSeverity}
        sx={{ width: "100%" }}
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;
