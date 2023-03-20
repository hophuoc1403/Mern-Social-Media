import {PropsWithChildren} from "react";
import {Box, Typography, useTheme} from "@mui/material";
import {Outlet} from "react-router-dom";

interface AccountLayoutProps extends  PropsWithChildren{}

const AccountLayout = ({children}:AccountLayoutProps) => {
  const theme = useTheme()
  // @ts-ignore
  return <Box width={"100%"} sx={{backgroundColor: theme.palette.background.alt}}>
    <Box>
      <Typography fontWeight={'bold'} fontSize={"clamp(1rem,2rem,2.25rem)"}
                  color={"primary"}
      >
        PhuocMedia
      </Typography>
    </Box>
    <Outlet />
  </Box>
}

export default  AccountLayout