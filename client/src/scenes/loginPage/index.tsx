import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Form from "./Form";
import AccountLayout from "../../layouts/AccountLayout";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("min-width(1000px)");

  // @ts-ignore
  return (
    <Box
      minHeight={"100vh"}
      width={isNonMobileScreens ? "50%" : "93%%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={"1.5rem"}
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Typography fontWeight={"500"} variant={"h5"} sx={{ mb: "1.5rem" }}>
        Welcome to Phuoc media, subscribe to new social
      </Typography>
      <Form></Form>
    </Box>
  );
};

export default LoginPage;
