import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Navbar/Navbar2";
import { toast } from "react-toastify";

// Define the validation schema for OTP, newPassword, and email fields
const validationSchema = yup.object().shape({
  otp: yup
  .string()
  .required("OTP is required")
  .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
  newPassword: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  email: yup
  .string()
  .required("Email address is required")
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email address"
  ),
});

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [email, setEmail] = useState("");

  const formData = {
    otp: otp,
    newPassword: newpassword,
    email: email,
  };

  const navigate = useNavigate();

  // Use useForm with yupResolver and the validation schema
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/user/reset-password/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success === false) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          navigate("/signin");
        }
      } else {
        toast.error("Failed to send the request.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <div>
      <Navbar2 />
      <div className="login-page" style={{ paddingTop: "120px" }}>
        <Container
          component="main"
          sx={{
            backgroundColor: "white",
            marginTop: "0px",
            width: "330px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
            borderRadius: "10px",
            
          }}
        >
          <CssBaseline />

          <Box
            sx={{
              marginTop: 3,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ marginTop: 2 }}>
              Reset Password
            </Typography>
            <form method="post" onSubmit={handleSubmit(onSubmit)}>
              <Grid sx={{ marginTop: 3 }}>
                <Grid item xs={12}>
                  <Controller
                    name="otp"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Enter OTP"
                        value={otp}
                        onChange={(e) => {
                          field.onChange(e);
                          setOtp(e.target.value);
                        }}
                        error={!!errors.otp}
                        helperText={errors.otp ? errors.otp.message : ""}
                      />
                    )}
                  />
                </Grid><br />
                <Grid item xs={12}>
                  <Controller
                    name="newPassword"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Enter New Password"
                        type="password"
                        value={newpassword}
                        onChange={(e) => {
                          field.onChange(e);
                          setNewpassword(e.target.value);
                        }}
                        error={!!errors.newPassword}
                        helperText={
                          errors.newPassword ? errors.newPassword.message : ""
                        }
                      />
                    )}
                  />
                </Grid><br />
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          field.onChange(e);
                          setEmail(e.target.value);
                        }}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
            </form>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default OtpVerification;
