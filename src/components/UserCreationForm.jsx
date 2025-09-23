import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  IconButton,
  Modal,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";
import { PersonAdd as PersonAddIcon, Close } from "@mui/icons-material";
import { registerUser } from "../server/api";
import AlertSnackbar from "./AlertSnackbar";

const UserCreationForm = ({ open, onClose, onUserCreated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const companyId = localStorage.getItem("company_id")


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      const userData = {
        username,
        password,
        roles: role === "admin" ? ["admin"] : ["user"],
        company_id: companyId
      };
      let res = await registerUser(userData);
      if (res.status === 200) {
        setAlertMessage("User created successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
      } else {
        setAlertMessage(`Failed to create user.`);
        setAlertSeverity("error");
        setAlertOpen(true);
      }
      setUsername("");
      setPassword("");
      setRole("");
      onUserCreated();
      onClose();
    } catch (error) {
      console.error("Failed to register user:", error);
      setError("Failed to register user. Please try again.");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="user-creation-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" },
            maxWidth: "500px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              backgroundColor: "#D4AF37",
              p: 1,
              textAlign: "center",
              borderRadius: "5px",
              mb: 3,
            }}
          >
            Create New User
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 1 }}
              inputProps={{ maxLength: 150 }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {`${username.length}/150`}
            </Typography>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 1 }}
              inputProps={{ maxLength: 128 }}
            />
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {`${password.length}/128`}
            </Typography>
            <FormControl component="fieldset" required error={!!error}>
              <FormLabel component="legend">Role</FormLabel>
              <RadioGroup
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="User"
                />
              </RadioGroup>
              {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{ mt: 2 }}
              >
                Create User
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <AlertSnackbar
        alertOpen={alertOpen}
        alertSeverity={alertSeverity}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
    </>
  );
};

export default UserCreationForm;
