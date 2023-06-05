import {
  Box,
  InputBase,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  FormControl,
  Select,
  MenuItem,
  ButtonBase,
  Badge,
  Tooltip, Avatar,
} from "@mui/material";
import {
  Notifications,
  Help,
  Message,
  DarkMode,
  LightMode,
  Close,
  MenuOpenOutlined,
  AccountBalanceOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setLogout, setMode} from "../../state";
import UserImage from "../../components/UserImage";
import Menu from "@mui/material/Menu";
import {useAppDispatch, useAppSelector} from "index";
import {getNotifications} from "service/post.service";
import {motion} from "framer-motion";
import ChatBox from "components/chat/ChatBox";
import {actions, useTrackedStore} from "../../hooks";
import NotificationBox from "../../components/Notification";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import {SidebarContext} from "../../components/contexts/SideBarContext";
import HeaderSearch from "../../components/searchHeader";

export enum NotiType {
  LIKE = "like",
  COMMENT = "comment",
}

export interface Notification {
  senderName: string;
  user: IUser;
  post: IPost;
  message: string;
  type: NotiType;
  receiver: IUser;
}

const NavbarPage = () => {
  const [isMobileToggled, setIsMobileToggled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {user, mode} = useAppSelector((state) => state);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const socket = useTrackedStore().socket.socket();
  const {setIsAppLoading} = actions().socket;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {sidebarToggle, toggleSidebar} =
    useContext(SidebarContext);
  const [chatNewAmount, setChatNewAmount] = useState(0)

  const [chatRef, setChatRef] = useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  useEffect(() => {
    const handler = (data: any) => {
      if (data.receiverId === user.id) {
        setNotifications((prev) => [
          {
            ...data,
            post: {id: data.postId},
            user: {id: data.userId},
            receiver: {id: data.receiverId},
          },
          ...prev,
        ]);
      }
    };
    socket?.on("getNotification", handler);

    const getChatAmount = (data: any) => {
      if (data.senderId !== user.id) {
        setChatNewAmount(chatNewAmount + 1)
      }
    }
    socket?.on("sendAmountMessage", getChatAmount);
    return () => {
      socket?.off("getNotification", handler);
      socket?.off("sendAmountMessage", getChatAmount);
    };
  }, []);

  useEffect(() => {
    const handleGetNotifications = async () => {
      const res = await getNotifications({userId: user.id});
      setNotifications(res.data.notifications);
    };
    handleGetNotifications();
  }, [user]);

  // @ts-ignore
  const neutralLight = theme.palette.neutral.light;
  // @ts-ignore
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  // @ts-ignore
  const alt = theme.palette.background.alt;

  const fullName = user.firstName + user.lastName;

  // @ts-ignore
  return (
    <FlexBetween
      padding={".3rem 6%"}
      sx={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        backgroundColor: alt,
      }}
      className={mode === "dark" ? "dark-navbar" : ""}
    >
      <FlexBetween gap={"1.75rem"}>
        <Typography
          fontWeight={"bold"}
          fontSize={"clamp(1rem,2rem,2.25rem)"}
          color={"primary"}
          onClick={() => {
            setIsAppLoading();
            navigate("/home");
          }}
          sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}
        >
          <Avatar src={"/logo.png"} variant={"square"} sx={{width: "100px",height:"50px"}}/>
        </Typography>
        {
          // isNonMobileScreens && (
          // <FlexBetween
          //   sx={{
          //     backgroundColor: neutralLight,
          //     borderRadius: "50px",
          //     position: "relative",
          //   }}
          //   padding={"0.2rem 0.1rem"}
          // >
          //   <InputBase
          //     id="search"
          //     value={searchVal}
          //     onChange={(e) => {
          //       setSearchVal(e.target.value);
          //     }}
          //     placeholder={"search ..."}
          //     sx={{ paddingInline: "1rem" }}
          //   />
          //   <LoadingButton
          //     className="p-0"
          //     sx={{ paddingRight: "1rem", minWidth: "max-content" }}
          //     loading={status === "pending"}
          //   >
          //     {" "}
          //     <Search />
          //   </LoadingButton>
          //   {isOpenSearchModal && (
          //     <ModalSearch onClose={() => setIsOpenSearchModal(false)} />
          //   )}
          // </FlexBetween>
          <HeaderSearch/>
          // )
        }
        <Box
          component="span"
          sx={{
            ml: 2,
            display: {lg: "none", xs: "inline-block"},
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton
              color="primary"
              onClick={() => {
                toggleSidebar();
              }}
            >
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small"/>
              ) : (
                <CloseTwoToneIcon fontSize="small"/>
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </FlexBetween>

      {/*Desktop nav*/}
      {isNonMobileScreens ? (
        <FlexBetween gap={"1.5rem"}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <DarkMode/> : <LightMode/>}
          </IconButton>
          <IconButton
            id="chat-box"
            onClick={(e) => setChatRef(e.currentTarget)}
            aria-controls={!!chatRef ? "chat-box" : undefined}
            aria-haspopup="true"
            aria-expanded={!!chatRef ? "true" : undefined}
          > <Badge badgeContent={chatNewAmount ?? "" } color="secondary">
            <Message sx={{fontSize: "25px"}}/>
          </Badge>
          </IconButton>
          <IconButton
            id="basic-button2"
            aria-controls={open2 ? "basic-menu2" : undefined}
            aria-haspopup="true"
            aria-expanded={open2 ? "true" : undefined}
            onClick={handleClick2}
          >
            <Badge badgeContent={notifications.length} color="secondary">
              <Notifications sx={{fontSize: "25px"}}/>
            </Badge>
          </IconButton>

          <Help sx={{fontSize: "25px"}}/>
          <FlexBetween>
            <ButtonBase
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                border: "1px solid gray",
                padding: ".4rem .8rem",
                borderRadius: "50px",
              }}
            >
              <UserImage image={user.picturePath} size={40}/>
              <Typography ml={1}>
                {user.firstName + " " + user.lastName}
              </Typography>
            </ButtonBase>
            {/* menu items */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Box sx={{minWidth: "150px"}}>
                <MenuItem
                  value={fullName}
                  onClick={async () => {
                    await setIsAppLoading();
                    navigate(`/profile/${user.id}`);
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: "15px 10px",
                  }}
                >
                  <AccountBalanceOutlined className={"mr-2"}/>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/account/login");
                    localStorage.removeItem("accessToken");
                    dispatch(setLogout());
                  }}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    padding: "15px 10px",
                  }}
                >
                  <ExitToAppOutlined className={"mr-2"}/>
                  Logout
                </MenuItem>
              </Box>
            </Menu>
            <Menu
              id="basic-menu2"
              anchorEl={anchorEl2}
              open={open2}
              onClose={handleClose2}
            >
              <Box sx={{maxHeight: "400px", overflowY: "auto"}}>
                {notifications.length > 0
                  ? notifications.map((notification) => (
                    <NotificationBox notification={notification}/>
                  ))
                  : "you don't have any notification"}
              </Box>
            </Menu>
            <ChatBox
              id="chat-box"
              onClose={() => setChatRef(null)}
              chatRef={chatRef}
            />
          </FlexBetween>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setIsMobileToggled(!isMobileToggled)}>
          <MenuOpenOutlined/>
        </IconButton>
      )}

      {/*Mobile Nav*/}
      {!isNonMobileScreens && isMobileToggled && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
        >
          <Box
            position={"fixed"}
            right={0}
            bottom={0}
            height={"100%"}
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
            <FlexBetween
              display={"flex"}
              flexDirection={"column"}
              justifyContent="center"
              gap={"2rem"}
            >
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? <DarkMode/> : <LightMode/>}
              </IconButton>
              <Message sx={{fontSize: "25px"}}/>
              <Notifications sx={{fontSize: "25px"}}/>
              <Help sx={{fontSize: "25px"}}/>
              <FormControl variant={"standard"}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: ".25rem",
                    p: ".25rem .1rem",
                    "& .MuiSvgIcon-root": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase/>}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/account/login");
                      localStorage.removeItem("accessToken");
                      dispatch(setLogout());
                    }}
                  >
                    Logout
                  </MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          </Box>
        </motion.div>
      )}
    </FlexBetween>
  );
};

export default NavbarPage;
