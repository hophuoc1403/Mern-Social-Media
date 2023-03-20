import { useMediaQuery } from "@mui/material"
import { Box } from "@mui/system"
import { useAppSelector } from "index"
import { Outlet } from "react-router-dom"
import NavbarPage from "scenes/navbar"
import UserWidget from "scenes/widgets/UserWidget"

const MainLayout = () => {

    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const {_id, picturePath,firstName,lastName} = useAppSelector(state => state.user)


    return <Box>
        <Box sx={{position: "sticky", top: "0px", zIndex: 999}}>
      <NavbarPage/>
    </Box>
    <Box width={"100%"} padding={"2rem 6%"}
         display={isNonMobileScreens ? "flex" : "block"}
         gap={"0.5rem"} justifyContent={"space-between"}>
            <Box flexBasis={isNonMobileScreens ? "22%" : undefined}>
        <Box style={{position: "sticky", top: "110px"}}>
          <UserWidget userId={_id} picturePath={picturePath}/>
        </Box>
      </Box>
        <Outlet />
         </Box>
    </Box>
}

export default MainLayout