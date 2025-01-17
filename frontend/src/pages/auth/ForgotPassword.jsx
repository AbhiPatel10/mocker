import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
// import { apiAuth } from "../../services/models/authModel";
import { apiService } from "../../services/models/serviceModel";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { success, error } from "../../themes/themeColors";
import { CustomLoaderButton } from "../../components/CustomButtons";

const ForgotPassword = () => {
  const { id } = useParams();

  return (
    <React.Fragment>
      {id ? <SetPasswordForm auth_token={id} /> : <VerifyForm />}
    </React.Fragment>
  );
};

const SetPasswordForm = ({ auth_token }) => {
  const [loading, setLoading] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [status, setStatus] = useState(false);

  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const initialValues = {
    password: "",
    confirmPassword: "",
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
    confirmPassword: Yup.string().when(["password", "confirmPa"], {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("password")],
        "Confirm password should be same"
      ),
    }),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        setLoading(true);
        setIsResponse(false);
        resetPassword(values.confirmPassword);
      },
    });

  const resetPassword = (password) => {
    const body = {
      password: password,
    };

    apiService.post(body, `change-password/${auth_token}`).then((res) => {
      if (res.status === "200") {
        toast.success("Successfully reset");
        setStatus(true);
      } else if (res.status === "400") {
        toast.error(res.message);
        setStatus(false);
      } else {
        toast.error("Error");
        setStatus(false);
      }
      setLoading(false);
      setIsResponse(true);
    });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change password
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <TextField
          label="password"
          size="small"
          type={showPassword ? "text" : "password"}
          fullWidth
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password || ""}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="confirm password"
          size="small"
          type={showConfirmPassword ? "text" : "password"}
          sx={{ mt: 2 }}
          fullWidth
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.confirmPassword || ""}
          error={Boolean(touched.confirmPassword && errors.confirmPassword)}
          helperText={touched.confirmPassword && errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownConfirmPassword}
                >
                  {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isResponse && (
          <Typography
            align="center"
            bgcolor={status ? success.main : error.main}
            color={"#FFFFFF"}
            sx={{
              mt: 1,
              borderRadius: ".5em",
              py: 1,
              px: 1.5,
            }}
          >
            {status
              ? "Password successfully changed"
              : "Failed to reset password"}
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ display: "block", mt: 2, mx: "auto" }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CustomLoaderButton /> : "Reset password"}
        </Button>
        {status && (
          <>
            <Typography
              align="center"
              variant="h6"
              component="p"
              sx={{ mt: 4 }}
            >
              <Link to="/" style={{ color: "deepskyblue" }}>
                Login
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </>
  );
};

const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
  const [status, setStatus] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        setLoading(true);
        setIsMailSent(false);
        sendLink(values.email);
      },
    });

  const sendLink = (email) => {
    const body = {
      email: email,
      fEndUrl: location.protocol + "//" + location.host,
    };

    apiService.post(body, "reset-password").then((res) => {
      if (res.status === "200") {
        setStatus(true);
        toast.success("Reset Password link sent");
      } else if (res.status === "400") {
        toast.error(res.message);
        setStatus(false);
      } else {
        toast.error("Error");
        setStatus(false);
      }
      setLoading(false);
      setIsMailSent(true);
    });
  };

  return (
    <>
      <Typography variant="h6" component="h1" sx={{ mb: 2 }}>
        Reset password
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <TextField
          label="email"
          size="small"
          type="email"
          fullWidth
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
        {isMailSent && (
          <Typography
            align="center"
            bgcolor={status ? success.main : error.main}
            color={"#FFFFFF"}
            sx={{
              mt: 1,
              borderRadius: ".5em",
              px: 1.5,
              py: 1,
            }}
          >
            {status
              ? "Verification link sent"
              : "Failed to send verification link"}
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ display: "block", mt: 2, mx: "auto" }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CustomLoaderButton /> : "Verify"}
        </Button>
      </Box>
    </>
  );
};

export default ForgotPassword;
