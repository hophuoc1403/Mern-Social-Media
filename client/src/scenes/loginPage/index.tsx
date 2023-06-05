import {Avatar, Box, Typography, useMediaQuery, useTheme} from "@mui/material";
import Form from "./Form";
import AccountLayout from "../../layouts/AccountLayout";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("min-width(1000px)");

  // @ts-ignore
  return (
    <Box
      minHeight={"100vh"}
      width={isNonMobileScreens ? "50%" : "100%"}
      p={"2rem"}
      m={"2rem auto"}
        sx={{ backgroundColor: theme.palette.background.default }}
      color={theme.palette.primary.main}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Avatar src={"/logo.png"} sizes={"70px"} sx={{width:"120px",height:"70px",mb:2,objectFit:"cover"}} variant={"rounded"}/>
      <Typography fontWeight={"500"} variant={"h3"} sx={{ mb: "1.5rem" }}>
        Welcome to Social Dozen
      </Typography>

      <Form></Form>
    </Box>
  );
};

export default LoginPage;
