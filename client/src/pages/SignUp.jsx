import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignInPath } from "../routes_path.jsx";
import { toastOptions } from "../toastOptions.jsx";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const SignUp = () => {
  // toast.info('hello world');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/");
  });

  const handleValidation = (values) => {
    let isValid = true;
    Object.entries(values).forEach(([key, value]) => {
      if (value === "") {
        toast.error(`'${key}' is required.`, toastOptions);
        isValid = false;
      }
    });

    if (values.password !== values.confirm_password) {
      toast.error(
        "`password` and `confirm_password must be the same.`",
        toastOptions
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const userData = {
      email: data.get("email"),
      password: data.get("password"),
      confirm_password: data.get("confirm_password"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };

    if (!handleValidation(userData)) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/sign_up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const responseData = await response.json();
      if (responseData === null) return;
      localStorage.setItem("user", JSON.stringify(responseData));
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch");
    }
  };

  // const handleChange = (e) => {
  //   setUserValues({ ...userValues, [e.target.name]: e.target.value });
  // };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm_password"
                  label="Confirm password"
                  type="confirm_password"
                  id="confirm_password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={SignInPath} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
  // return (
  //   <>
  //     <div>
  //       <form onSubmit={handleSubmit}>
  //         <input
  //           placeholder="Email"
  //           name="email"
  //           onChange={handleChange}
  //         ></input>
  //         <input
  //           placeholder="Password"
  //           name="password"
  //           onChange={handleChange}
  //         ></input>
  //         <input
  //           placeholder="Confirm Password"
  //           name="confirm_password"
  //           onChange={handleChange}
  //         ></input>
  //         <input
  //           placeholder="First name"
  //           name="first_name"
  //           onChange={handleChange}
  //         ></input>
  //         <input
  //           placeholder="Last name"
  //           name="last_name"
  //           onChange={handleChange}
  //         ></input>
  //         <input type="submit" hidden />
  //         <button type="submit">Create account</button>
  //         <span>
  //           Already have an account ? <Link to="/login">Login</Link>
  //         </span>
  //       </form>
  //     </div>
  //     <ToastContainer stacked />
  //   </>
  // );
};

export default SignUp;
