import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useSyncExternalStore } from "react";

const getOnlineStatus = () => {
  return typeof navigator !== "undefined" &&
    typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;
};

const subscribe = (callback) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

export const InternetConnectionWrapper = ({ children }) => {
  const isOnline = useSyncExternalStore(subscribe, getOnlineStatus);

  return (
    <>
      {children}
      <Snackbar
        open={!isOnline}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          You are currently offline. Please check your internet connection.
        </Alert>
      </Snackbar>
    </>
  );
};
