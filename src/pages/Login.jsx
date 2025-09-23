import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../server/api";
import { UserContext } from "../context";
import sunarBookLogo from "../pictures/SunarBookk.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const initialFormData = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [invalid, setInvalid] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setInvalid(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = await loginApi(formData);
    if (user) {
      console.log("USER==>>>>>>", user)
      localStorage.setItem("companyDetails", JSON.stringify(user.user.company))
      login(user.accessToken);
      navigate("/");
    } else {
      setInvalid(true);
    }
    setFormData(initialFormData);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f5e7d6 0%, #c9a063 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.18,
        zIndex: 0,
      }}>
        {/* <img src={sunarBookLogo} alt="SunarBook Logo" style={{ width: "60vw", maxWidth: 800, minWidth: 250 }} /> */}
      </Box>
      <Container maxWidth="xs" sx={{ zIndex: 1, position: "relative" }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.85)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={sunarBookLogo} alt="SunarBook Logo" style={{ width: 100, marginBottom: 8 }} />
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#c9a063", letterSpacing: 2 }}
            >
              Login
            </Typography>
          </Box>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
            {invalid && (
              <Typography sx={{ color: "red", fontSize: "12px", mt: 1 }}>
                *Invalid Credentials
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                padding: "10px 0",
                background: "linear-gradient(90deg, #c9a063, #f5e7d6)",
                color: "#222",
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                borderRadius: 2,
                textTransform: "uppercase"
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
