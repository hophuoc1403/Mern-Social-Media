import { useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { useAppSelector } from "index";
import { Outlet } from "react-router-dom";
import NavbarPage from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import Sidebar from "../components/sidebar/SideBar";
import React from "react";
import Navbar from "../scenes/navbar";
import AdvertWidget from "../scenes/widgets/AdvertWidget";
import FriendListWidget from "../scenes/widgets/FriendListWidget";

const MainLayout = ({children}:{children:React.ReactNode}) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { id, picturePath, firstName, lastName } = useAppSelector(
    (state) => state.user
  );

  return (
    <Box>
      <Box sx={{ position: "sticky", top: "0px", zIndex: 999 }}>
        <Navbar />
      </Box>
      <Box
        width={"100%"}
        padding={"2rem 2%"}
        display={isNonMobileScreens ? "flex" : "block"}
        // gap={"0.5rem"}
        justifyContent={"space-between"}
      >
        <Box flexBasis={isNonMobileScreens ? "15%" : undefined}>
          <Box
            style={{ position: "sticky", top: "95px" }}
          >
            {/*<UserWidget user={user} />*/}
            <Sidebar />
          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "55%" : undefined}
          overflow={"hidden"}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
        {children}
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis={"22%"}>
            <Box style={{ position: "sticky", top: "95px" }}>
              <AdvertWidget />
              <Box m={"1rem 0"}>
                <FriendListWidget />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MainLayout;
