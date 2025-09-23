import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { KarigarContext } from "../context";

const KarigarForm = ({ openKarigarForm, handleCloseKarigarForm, karigar }) => {
  const initialKarigarData = {
    name: "",
    description: "",
  };

  const { updateKarigar, addKarigar } = useContext(KarigarContext);
  const [karigarData, setKarigarData] = useState(initialKarigarData);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (karigar) {
      setKarigarData(karigar);
    }
  }, [karigar]);

  useEffect(() => {
    // Check if all required fields are filled
    const isFormValid = karigarData.name && karigarData.description;

    setIsValid(isFormValid);
  }, [karigarData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKarigarData({ ...karigarData, [name]: value });
  };

  const handleCreateOrUpdateKarigar = () => {
    // const currKarigar = {
    //   id: karigar ? karigar.id : Date.now(),
    //   ...karigarData,
    // };

    if (karigar) {
      updateKarigar(karigarData);
    } else {
      addKarigar(karigarData);
    }

    handleCloseKarigarForm();
    setKarigarData(initialKarigarData);
  };

  const handleClose = () => {
    setKarigarData(initialKarigarData);
    handleCloseKarigarForm();
  };

  return (
    <Modal
      open={openKarigarForm}
      onClose={handleClose}
      aria-labelledby="karigar-modal-title"
      aria-describedby="karigar-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, md: 400 },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          id="karigar-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
          sx={{
            textAlign: "center",
            marginBottom: 2,
            borderBottom: "2px solid #d1d1d1",
          }}
        >
          {karigar ? "Edit Karigar" : "Add New Karigar"}
        </Typography>
        <form>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={karigarData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={karigarData.description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box
            mt={2}
            display="flex"
            justifyContent="flex-end"
            flexDirection="column"
          >
            {!isValid && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Please fill all mandatory fields marked with *
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateOrUpdateKarigar}
              sx={{ mt: 2 }}
              disabled={!isValid}
            >
              {karigar ? "Update Karigar" : "Add Karigar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default KarigarForm;
