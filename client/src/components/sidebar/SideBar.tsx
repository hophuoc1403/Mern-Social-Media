import { useContext } from "react";

import {
  Box,
  Drawer,
  styled,
  Divider,
  useTheme,
  Avatar,
} from "@mui/material";

import { SidebarContext } from "../contexts/SideBarContext";
import Scrollbar from "../Scrollbar";
import SidebarMenu from "./SideBarMenu";

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: 15%;
        min-width: 150px;
        color:${theme.palette.mode === "light" ? "#333" : "black"} !important;
        position: relative;
        z-index: 7;
        height: 100%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: "none",
            lg: "inline-block",
          },
          position: "fixed",
          left: 0,
          top: 0,
          background: theme.palette.mode === "dark" ? "#151f31" : "white",
          boxShadow: "box-shadow: rgba(17, 17, 26, 0.1) 0px 0px 16px;",
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <Box
              mx={2}
              sx={{
                width: 52,
              }}
            >
              <Avatar
                src={
                  "https://wallpapers.com/images/thumb/social-media-apps-dgwr9vwvb0svnu9w.jpg"
                }
              />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: "white",
            }}
          />
          <SidebarMenu />
        </Scrollbar>
        {/*<Divider*/}
        {/*  sx={{*/}
        {/*    background: "white"*/}
        {/*  }}*/}
        {/*/>*/}
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: `box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;`,
        }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            width: 250,
            background: theme.palette.mode === "dark" ? "#151f31" : "white",
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  width: 52,
                }}
              >
                <Avatar
                  src={
                    "https://wallpapers.com/images/thumb/social-media-apps-dgwr9vwvb0svnu9w.jpg"
                  }
                />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: "white",
              }}
            />
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
