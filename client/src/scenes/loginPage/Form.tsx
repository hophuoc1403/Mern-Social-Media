import * as yup from "yup";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import { Formik } from "formik";
import { setLogin } from "../../state";
import FlexBetween from "../../components/FlexBetween";
import { EditOutlined } from "@mui/icons-material";
import { login, register } from "../../service/auth.service";
import axios from "axios";
import { toast } from "react-toastify";

const registerSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  location: yup.string().required(),
  occupation: yup.string().required(),
  picture: yup.string().required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(3),
});

const initialValueRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState<"login" | "register">("login");
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  interface loginProps {
    email: string;
    password: string;
  }
  interface registerProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    location: string;
    occupation: string;
    picture: {
      name: string;
    };
  }
  const handleLogin = async (values: loginProps, onSubmitProps: any) => {
    const id = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      console.log("ok");
      const savedLoginResponse: any = await login({
        email: values.email,
        password: values.password,
      });
      console.log(savedLoginResponse);
      onSubmitProps.resetForm();
      if (savedLoginResponse) {
        dispatch(
          setLogin({
            user: savedLoginResponse.data.user,
            token: savedLoginResponse.data.token,
          })
        );
        localStorage.setItem("accessToken", savedLoginResponse.data.token);
        localStorage.setItem(
          "refreshToken",
          savedLoginResponse.data.refreshToken
        );
        localStorage.setItem("userId", savedLoginResponse.data.user._id);
        navigate("/home");
         setTimeout((_: any) => {
          toast.update(id, {
            render: "login successfully",
            type: toast.TYPE.SUCCESS,
            className: "rotateY animated",
            autoClose: 4000,
          });
        }, 1000);
      }
    } catch (e: any) {
      console.log({ error: e.response.data.message });
      toast.update(id, {
        render: `${e.response.data.message}`,
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  };

  const handleRegister = async (values: registerProps, onSubmitProps: any) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        // @ts-ignore
        formData.append(value, values[value]);
      }
      formData.append("picturePath", values.picture.name);
      const savedUserResponse = await register(formData);
      console.log(savedUserResponse);
      onSubmitProps.resetForm();
      if (savedUserResponse) {
        setPageType("login");
      }
    } catch (e) {
      console.log({ error: e });
    }
  };

  const handleFormSubmit = async (values: any, onSubmitProps: any) => {
    if (isLogin) {
      await handleLogin(values as loginProps, onSubmitProps);
    } else if (isRegister) {
      await handleRegister(values as registerProps, onSubmitProps);
    }
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <Box
      sx={{
        maxWidth: "700px",
        margin: "0 auto",
        border: `1px solid ${palette.primary.light}`,
      }}
      p={3}
    >
      <Formik
        initialValues={isLogin ? initialValueLogin : initialValueRegister}
        onSubmit={handleFormSubmit}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleReset,
          handleSubmit,
          setFieldValue,
          resetForm,
        }: any) => (
          <form onSubmit={handleSubmit}>
            <Box
              display={"grid"}
              gap={"30px"}
              gridTemplateColumns={"repeat(4,minmax(0,1fr)"}
              sx={{
                "& > div": {
                  gridColumn: isNonMobileScreens ? undefined : "span 4",
                },
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label={"first name"}
                    name={"firstName"}
                    onBlur={handleBlur}
                    value={values.firstName}
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    onChange={handleChange}
                    sx={{ gridColumn: "span 2" }}
                  />{" "}
                  <TextField
                    label={"last name"}
                    name={"lastName"}
                    onBlur={handleBlur}
                    value={values.lastName}
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    onChange={handleChange}
                    sx={{ gridColumn: "span 2" }}
                  />{" "}
                  <TextField
                    label={"location"}
                    name={"location"}
                    onBlur={handleBlur}
                    value={values.location}
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    onChange={handleChange}
                    sx={{ gridColumn: "span 4" }}
                  />{" "}
                  <TextField
                    label={"occupation"}
                    name={"occupation"}
                    onBlur={handleBlur}
                    value={values.occupation}
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    onChange={handleChange}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn={"span 4"}
                    border={`1px solid ${palette.background.default}`}
                    borderRadius={"5px"}
                    p={"1rem"}
                  >
                    <Dropzone
                      multiple={false}
                      onDrop={(acceptedFiles) => {
                        setFieldValue("picture", acceptedFiles[0]);
                        console.log(values);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p={"1rem"}
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add picture here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>
                                {values.picture.name}
                                <EditOutlined />
                              </Typography>
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}
              <TextField
                label={"email"}
                name={"email"}
                onBlur={handleBlur}
                value={values.email}
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />{" "}
              <TextField
                label={"password"}
                name={"password"}
                onBlur={handleBlur}
                value={values.password}
                error={Boolean(touched.password) && Boolean(errors.password)}
                type={"password"}
                helperText={touched.password && errors.password}
                onChange={handleChange}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/*buttons*/}

            <Box>
              <Button
                fullWidth
                type={"submit"}
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.light,
                  color: palette.primary.dark,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <FlexBetween>
                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": { cursor: "pointer", color: palette.primary.dark },
                  }}
                >
                  {isLogin
                    ? "Don't have account? Sign up here"
                    : "Already have an account? Login here"}
                </Typography>

                <Link to={"/account/forget-password"} >
                  <Typography className={"decoration-1 hover:decoration-4"}>
                    Forget password ?
                  </Typography>
                </Link>
              </FlexBetween>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
