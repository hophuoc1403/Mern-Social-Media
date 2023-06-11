import { PropsWithChildren } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

interface AccountLayoutProps extends PropsWithChildren {}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const theme = useTheme();
  // @ts-ignore
  return (
    <Box
      // sx={{ backgroundColor: theme.palette.background.alt }}
      width={"100%"}
      minHeight={"100vh"}
    >
      <Outlet />
    </Box>
  );
};

export default AccountLayout;
