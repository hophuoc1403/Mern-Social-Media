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
  Divider,
} from "@mui/material";
import {
  Search,
  Notifications,
  Help,
  Message,
  DarkMode,
  LightMode,
  Close,
  MenuOpenOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLogout, setMode, setPostsSearched } from "../../state";
import UserImage from "../../components/UserImage";
import Menu from "@mui/material/Menu";
import useAppStore from "hooks/stateApp";
import { useAppDispatch, useAppSelector } from "index";
import { findPost, getNotifications } from "service/post.service";
import useDebounce from "hooks/useDebounce";
import ModalSearch from "components/ModalSearch";
import { LoadingButton } from "@mui/lab";
import { motion } from "framer-motion";
import ChatBox from "components/chat/ChatBox";

const NavbarPage = () => {
  const [isMobileToggled, setIsMobileToggled] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();
  const { socket, setIsAppLoading } = useAppStore();
  const [notifications, setNotifications] = useState<{ content: string }[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");

  const [searchDebounced, status] = useDebounce(searchVal);
  const [isOpenSearchModal, setIsOpenSearchModal] = useState<boolean>(false);
  useEffect(() => {
    const handleSearch = async () => {
      const res = await findPost({ key: searchDebounced });
      dispatch(setPostsSearched({ posts: res.data }));
      setIsOpenSearchModal(true);
    };
    if (searchVal !== "") {
      handleSearch();
    }
  }, [searchDebounced]);

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
    socket &&
      socket.on("getNotification", (data) => {
        setNotifications((prev) => [
          { content: `${data.senderName} ${data.type} your post` },
          ...prev,
        ]);
      });
  }, [socket]);

  useEffect(() => {
    const handleGetNotifications = async () => {
      const res = await getNotifications({ userId: user.user._id });
      setNotifications(res.data);
    };
    handleGetNotifications();
  }, [user.user]);

  // @ts-ignore
  const neutralLight = theme.palette.neutral.light;
  // @ts-ignore
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  // @ts-ignore
  const alt = theme.palette.background.alt;

  const fullName = user.user.firstName + user.user.lastName;

  // @ts-ignore
  return (
    <FlexBetween padding={"1rem 6%"} sx={{ backgroundColor: alt }}>
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
          PhuocMedia
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            sx={{
              backgroundColor: neutralLight,
              borderRadius: "50px",
              position: "relative",
            }}
            padding={"0.2rem 0.1rem"}
          >
            <InputBase
              id="search"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
              }}
              placeholder={"search ..."}
              sx={{ paddingInline: "1rem" }}
            />
            <LoadingButton
              className="p-0"
              sx={{ padding: ".3rem", minWidth: "max-content" }}
              loading={status === "pending" ? true : false}
            >
              {" "}
              <Search />
            </LoadingButton>
            {isOpenSearchModal && (
              <ModalSearch onClose={() => setIsOpenSearchModal(false)} />
            )}
          </FlexBetween>
        )}
      </FlexBetween>

      {/*Desktop nav*/}
      {isNonMobileScreens ? (
        <FlexBetween gap={"2rem"}>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
          </IconButton>
          <IconButton
            id="chat-box"
            onClick={(e) => setChatRef(e.currentTarget)}
            aria-controls={!!chatRef ? "chat-box" : undefined}
            aria-haspopup="true"
            aria-expanded={!!chatRef ? "true" : undefined}
          >
            <Message sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton
            id="basic-button2"
            aria-controls={open2 ? "basic-menu2" : undefined}
            aria-haspopup="true"
            aria-expanded={open2 ? "true" : undefined}
            onClick={handleClick2}
          >
            <Badge badgeContent={notifications.length} color="secondary">
              <Notifications sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>
          <Help sx={{ fontSize: "25px" }} />
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
              <UserImage image={user.user.picturePath} size={40} />
              <Typography ml={1}>
                {user.user.firstName + " " + user.user.lastName}
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
              <MenuItem
                value={fullName}
                onClick={async () => {
                  await setIsAppLoading();
                  navigate(`/profile/${user.user._id}`);
                }}
              >
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
            </Menu>
            <Menu
              id="basic-menu2"
              anchorEl={anchorEl2}
              open={open2}
              onClose={handleClose2}
              // MenuListProps={{
              //   "aria-labelledby": "basic-button2",
              // }}
            >
              <Box borderRadius={5} p={"5px 10px"}>
                {notifications.length > 0
                  ? notifications.map((noti: any) => (
                      <>
                        <p>{noti.content}</p>
                        <Divider />
                      </>
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
          <MenuOpenOutlined />
        </IconButton>
      )}

      {/*Mobile Nav*/}
      {!isNonMobileScreens && isMobileToggled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Box
            position={"fixed"}
            right={0}
            bottom={0}
            height={"100%"}
            maxWidth={"500px"}
            minWidth={"300px"}
            sx={{ backgroundColor: background }}
          >
            {/*Close Icon*/}
            <Box display={"flex"} justifyContent={"center"} p={"1rem"}>
              <IconButton onClick={() => setIsMobileToggled(!isMobileToggled)}>
                <Close />
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
                {theme.palette.mode === "dark" ? <DarkMode /> : <LightMode />}
              </IconButton>
              <Message sx={{ fontSize: "25px" }} />
              <Notifications sx={{ fontSize: "25px" }} />
              <Help sx={{ fontSize: "25px" }} />
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
                  input={<InputBase />}
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
