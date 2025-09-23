import React, { useContext, useState } from "react";
import {
  Typography,
  Box,
  Modal,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import KarigarForm from "./KarigarForm";
import { KarigarContext, UserContext } from "../context";
import ConfirmDialog from "./ConfirmDialog";

const KarigarList = ({ openKarigarModal, handleCloseKarigarModal }) => {
  const { karigars, deleteKarigar } = useContext(KarigarContext);
  const { isAdmin } = useContext(UserContext);
  const [openKarigarForm, setOpenKarigarForm] = useState(false);
  const [currentKarigar, setCurrentKarigar] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteKarigarId, setDeleteKarigarId] = useState(null);

  const toggleAddKarigarForm = () => {
    setCurrentKarigar(null);
    setOpenKarigarForm(true);
  };

  const toggleEditKarigarForm = (karigar) => {
    setCurrentKarigar(karigar);
    setOpenKarigarForm(true);
  };

  const handleOpenConfirmDelete = (id) => {
    setDeleteKarigarId(id);
    setOpenConfirmDelete(true);
  };
  const handleCloseOpenConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleConfirmDelete = async () => {
    await deleteKarigar(deleteKarigarId);
    setDeleteKarigarId(null);
    setOpenConfirmDelete(false);
  };

  const handleCloseKarigarForm = () => {
    setOpenKarigarForm(false);
    setCurrentKarigar(null);
  };

  return (
    <>
      <Modal
        open={openKarigarModal}
        onClose={handleCloseKarigarModal}
        aria-labelledby="karigar-modal-title"
        aria-describedby="karigar-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: 300, md: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "85vh",
            outline: "none",
            overflowY: "auto",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleCloseKarigarModal}
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
            KARIGAR LIST
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleAddKarigarForm}
            >
              Add Karigar
            </Button>
          )}
          <Grid
            container
            spacing={2}
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
            }}
          >
            {karigars &&
              karigars.map((karigar) => (
                <Grid item key={karigar.id}>
                  <Card>
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        backgroundColor: "lightgrey",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography variant="h6">{karigar.name}</Typography>
                    </CardContent>
                    <CardContent>
                      <Typography variant="body1">
                        {karigar.description}
                      </Typography>
                    </CardContent>
                    {isAdmin && (
                      <CardActions>
                        <IconButton
                          sx={{
                            margin: "0px 10px",
                            color: "grey.700",
                            "&:hover": {
                              color: "blue",
                            },
                          }}
                          aria-label="edit"
                          onClick={() => toggleEditKarigarForm(karigar)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{
                            margin: "0px 10px",
                            color: "grey.700",
                            "&:hover": {
                              color: "red",
                            },
                          }}
                          aria-label="delete"
                          onClick={() => handleOpenConfirmDelete(karigar.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <ConfirmDialog
                          openConfirm={openConfirmDelete}
                          handleCloseOpenConfirm={handleCloseOpenConfirmDelete}
                          confirmation={handleConfirmDelete}
                          title="Do you want to delete the karigar?"
                          info="If karigar is deleted, all data related to that karigar will be lost."
                        />
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Modal>
      <KarigarForm
        openKarigarForm={openKarigarForm}
        handleCloseKarigarForm={handleCloseKarigarForm}
        karigar={currentKarigar} // Pass the current Karigar data
      />
    </>
  );
};

export default KarigarList;
