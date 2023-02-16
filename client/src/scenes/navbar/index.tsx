import {
  Box,
  InputBase,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  FormControl,
  Select,
  MenuItem
} from "@mui/material";
import {Search, Notifications, Help, Message, Menu, DarkMode, LightMode, Close} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../App";
import {light} from "@mui/material/styles/createPalette";
import {setLogout, setMode} from "../../state";
import UserImage from "../../components/UserImage";

const NavbarPage = () => {
  const [isMobileToggled, setIsMobileToggled] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state)
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
  const theme = useTheme()

  // @ts-ignore
  const neutralLight = theme.palette.neutral.light
  // @ts-ignore
  const dark = theme.palette.neutral.dark
  const background = theme.palette.background.default
  const primaryLight = theme.palette.primary.light
  // @ts-ignore
  const alt = theme.palette.background.alt

  const fullName = user.user.firstName + user.user.lastName

  // @ts-ignore
  return <FlexBetween padding={"1rem 6%"} backgroundColor={alt}>
    <FlexBetween gap={'1.75rem'}>
      <Typography fontWeight={'bold'} fontSize={"clamp(1rem,2rem,2.25rem)"}
                  color={"primary"} onClick={() => navigate("/home")} sx={{
        "&:hover": {
          color: primaryLight,
          cursor: "pointer"
        }
      }}
      >
        PhuocMedia
      </Typography>
      {isNonMobileScreens && (
        <FlexBetween sx={{backgroundColor: neutralLight, borderRadius: "9px"}} padding={"0.1rem 1.5rem"}>
          <InputBase placeholder={"search ..."}/>
          <IconButton>
            <Search/>
          </IconButton>
        </FlexBetween>
      )}
    </FlexBetween>

    {/*Desktop nav*/}
    {isNonMobileScreens ? <FlexBetween gap={"2rem"}>
      <IconButton onClick={() => dispatch(setMode())}>
        {theme.palette.mode === "dark" ? <DarkMode/> : <LightMode/>}
      </IconButton>
      <Message sx={{fontSize: "25px"}}/>
      <Notifications sx={{fontSize: "25px"}}/>
      <Help sx={{fontSize: "25px"}}/>
      <FormControl variant={"standard"}>
        <FlexBetween>
          <UserImage image={user.user.picturePath} size={45} />
          <Select value={fullName} sx={{
            backgroundColor: neutralLight, width: "150px", borderRadius: ".25rem", p: ".25rem .1rem",
            "& .MuiSvgIcon-root": {
              backgroundColor: neutralLight
            },
            marginLeft:"5px"
          }}
                  input={<InputBase/>}>
            <MenuItem value={fullName}>
              <Typography>{fullName}</Typography>
            </MenuItem>
            <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
          </Select>
        </FlexBetween>
      </FormControl>
    </FlexBetween> : <IconButton onClick={() => setIsMobileToggled(!isMobileToggled)}><Menu/></IconButton>}


    {/*Mobile Nav*/}
    {!isNonMobileScreens && isMobileToggled && (
      <Box
        position={"fixed"}
        right={0}
        bottom={0}
        height={'100%'}
        maxWidth={"500px"}
        minWidth={"300px"}
        sx={{backgroundColor: background}}
      >
        {/*Close Icon*/}
        <Box display={"flex"} justifyContent={"center"} p={"1rem"}>
          <IconButton onClick={() => setIsMobileToggled(!isMobileToggled)}>
            <Close/>
          </IconButton>
        </Box>

        {/*menu item*/}
        <FlexBetween display={"flex"} flexDirection={"column"} justifyContent="center" gap={"2rem"}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <DarkMode/> : <LightMode/>}
          </IconButton>
          <Message sx={{fontSize: "25px"}}/>
          <Notifications sx={{fontSize: "25px"}}/>
          <Help sx={{fontSize: "25px"}}/>
          <FormControl variant={"standard"}>
            <Select value={fullName} sx={{
              backgroundColor: neutralLight, width: "150px", borderRadius: ".25rem", p: ".25rem .1rem",
              "& .MuiSvgIcon-root": {
                backgroundColor: neutralLight
              }
            }}
                    input={<InputBase/>}>
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      </Box>
    )}
  </FlexBetween>
}


export default NavbarPage