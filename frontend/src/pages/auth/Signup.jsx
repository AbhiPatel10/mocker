import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { apiAuth } from "../../services/models/authModel";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { CustomLoaderButton } from "../../components/CustomButtons";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: (values) => {
        setLoading(true);
        registerUser(values.email, values.password);
      },
    });

  const registerUser = (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    apiAuth.post(body, "register").then((res) => {
      if (res.status === "200") {
        navigate("/");
        toast.success(
          "We have sent you verification mail. Please verify and come back"
        );
      } else if (res.status === "400") {
        toast.error(res.message);
      } else {
        toast.error("Error");
      }
      setLoading(false);
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Signup
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
          sx={{ mb: 2 }}
          fullWidth
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ""}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
        <TextField
          label="password"
          size="small"
          type="password"
          fullWidth
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password || ""}
          error={Boolean(touched.password && errors.password)}
          helperText={touched.password && errors.password}
        />
        <Button
          variant="contained"
          sx={{ display: "block", mt: 2, mx: "auto" }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CustomLoaderButton /> : "Signup"}
        </Button>
        <Typography variant="h6" component="p" sx={{ my: 2 }}>
          Have an account already ? Then{"  "}
          <Link to="/" style={{ color: "deepskyblue" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default Signup;
