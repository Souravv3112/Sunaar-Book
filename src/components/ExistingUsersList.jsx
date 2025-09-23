import React, { useContext, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { deleteUser } from "../server/api";
import { UserContext } from "../context";
import AlertSnackbar from "./AlertSnackbar";
import ConfirmDialog from "./ConfirmDialog";

const ExistingUsersList = ({ users, onUserDeleted, onOpenCreateForm }) => {
  const { user } = useContext(UserContext);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [userId, setUserId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleDeleteUser = async () => {
    try {
      let res = await deleteUser(userId);
      if (res.status === 200) {
        setAlertMessage("User deleted successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
      } else {
        setAlertMessage(`Failed to delete user.`);
        setAlertSeverity("error");
        setAlertOpen(true);
      }
      onUserDeleted();
    } catch (error) {
      console.error("Failed to delete u:", error);
    }
    setOpenConfirm(false);
  };

  const handleOpenOpenConfirm = (id) => {
    setUserId(id);
    setOpenConfirm(true);
  };

  const handleCloseOpenConfirm = () => {
    setOpenConfirm(false);
    setUserId(null);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onOpenCreateForm}
      >
        Create User
      </Button>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          maxHeight: "500px",
          overflowY: "auto",
          mt: 1,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: "center",
          }}
        >
          Existing Users
        </Typography>
        <List>
          {users?.map((u) => (
            <React.Fragment key={u.id}>
              <ListItem>
                <ListItemText
                  primary={u.username}
                  secondary={u.roles.includes("admin") ? "Admin" : "User"}
                />
                <ListItemSecondaryAction>
                  {user === u.username ? (
                    "Current User"
                  ) : (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenOpenConfirm(u.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
      <AlertSnackbar
        alertOpen={alertOpen}
        alertSeverity={alertSeverity}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
      <ConfirmDialog
        openConfirm={openConfirm}
        handleCloseOpenConfirm={handleCloseOpenConfirm}
        confirmation={handleDeleteUser}
        title="Do you want to delete the user?"
        info="This action cannot be undone."
      />
    </>
  );
};

export default ExistingUsersList;
