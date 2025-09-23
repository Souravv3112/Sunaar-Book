import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import { getAllUsers } from "../server/api";
import UserCreationForm from "./UserCreationForm";
import ExistingUsersList from "./ExistingUsersList";
import { Close } from "@mui/icons-material";

const UserManagementModal = ({ open, onClose }) => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleUserDeleted = () => {
    fetchUsers();
  };

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="user-management-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
            maxWidth: "1000px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <Typography
            id="user-management-modal-title"
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              mb: 3,
              backgroundColor: "#ECEFF1",
              color: theme.palette.getContrastText("#ECEFF1"),
              p: 1,
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            User Management
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <ExistingUsersList
                users={users}
                onUserDeleted={handleUserDeleted}
                onOpenCreateForm={handleOpenCreateForm}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <UserCreationForm
        open={isCreateFormOpen}
        onClose={handleCloseCreateForm}
        onUserCreated={handleUserCreated}
      />
    </>
  );
};

export default UserManagementModal;
