import {Box, Divider, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import {
  EditOutlined,
  LocationOnOutlined,
  ManageAccountsOutlined,
  WorkOutline,
} from "@mui/icons-material";
import {actions} from "../../hooks";

interface UserWidgetProps {
  user: IUser;
}

const UserWidget = ({user}: UserWidgetProps) => {
  const {palette} = useTheme();
  const navigate = useNavigate();
  // @ts-ignore
  const dark = palette.neutral.dark;
  // @ts-ignore
  const medium = palette.neutral.medium;
  // @ts-ignore
  const main = palette.neutral.main;
  const {setIsAppLoading} = actions().socket;

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    friends,
    location,
    occupation,
    impressions,
    viewedProfile,
    id,
    picturePath,
  } = user;

  return (
    <WidgetWrapper>
      {/*first row */}
      <Box
        sx={{display: "flex", justifyContent: "space-between"}}
        gap={"0.5rem"}
        pb={"1.1rem"}
        onClick={async () => {
          await setIsAppLoading();
          navigate(`/profile/${user.id}`);
        }}
      >
        <FlexBetween gap={"0.5rem"}>
          <UserImage image={picturePath} size={40}/>
          <Box>
            <Typography
              variant={"h4"}
              color={dark}
              fontWeight={500}
              sx={{
                "&:hover": {color: palette.primary.light, cursor: "pointer"},
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {friends && friends.length} friends
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined/>
      </Box>

      <Divider/>

      {/*second row*/}
      <Box
        p={"1rem 0"}
        display={"flex"}
        flexDirection="column"
        // alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box
          display={"flex"}
          // justifyContent="space-between"
          alignItems={"center"}
          gap={"1rem"}
          mb={"0.5rem"}
        >
          <LocationOnOutlined fontSize={"large"} sx={{color: main}}/>
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          // justifyContent={"center"}
          gap={"1rem"}
        >
          <WorkOutline fontSize={"large"} sx={{color: main}}/>
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>
      <Divider/>

      {/*third row*/}
      <Box p={"1rem 0"}>
        <Box display={"flex"} justifyContent={"space-between"} mb={"0.5rem"}>
          <Typography color={medium}>Who viewed your profile ?</Typography>
          <Typography color={medium} fontWeight={500}>
            {Math.floor(Math.random() * 100)}{viewedProfile}
          </Typography>
        </Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={medium} fontWeight={500}>
            {Math.floor(Math.random() * 100)} {impressions}
          </Typography>
        </Box>
      </Box>
      <Divider/>

      {/*fourth row*/}
      <Box p={"1rem 0"}>
        <Typography fontSize={"1rem"} color={main} fontWeight={500} mb={"1rem"}>
          Social Profiles
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          gap={"1rem"}
          mb={"0.5rem"}
        >
          <FlexBetween gap={"1rem"}>
            <img
              src={"data:image/jpeg;base64,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"}
              alt={"twitter"} style={{width:"40px",borderRadius:"50%"}}/>
            <Box>
              <a href="https://twitter.com/HPhc41208586782">
                <Typography sx={{cursor:"pointer"}} color={main} fontWeight={"500"}>
                  Twitter
                </Typography>
              </a>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{color: main}}/>
        </Box>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          gap={"1rem"}
          mb={"0.5rem"}
        >
          <FlexBetween gap={"1rem"}>
            <img
              src={"data:image/png;base64,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"}
              alt={"twitter"} style={{width:"40px",borderRadius:"50%"}}
            />
            <Box>
              <Typography color={main} fontWeight={"500"} sx={{cursor:"pointer"}}>
                linkedIn
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{color: main}}/>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
