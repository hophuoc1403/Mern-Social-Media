import React, {useEffect, useState} from "react";
import {ScrollMenu, VisibilityContext} from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {Box, Divider, IconButton, Stack, Typography, useTheme} from "@mui/material";

import {LeftArrow, RightArrow} from "./arrows";
import {Card} from "./card";
import usePreventBodyScroll from "./usePreventBodyScroll";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {useAppSelector} from "index";
import {AddAPhotoOutlined, ArrowBackOutlined, ArrowForwardOutlined} from "@mui/icons-material";
import {getStories} from "../../service/story.service";
import AddStory from "./AddStory";
import Stories from "react-insta-stories";
import Modal from "@mui/material/Modal";
import moment from "moment";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.default",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
  py:4
};

export interface Story {
  user: IUser;
  image: string;
  createdAt: string;
}

export interface Stories {
  user: IUser;
  stories: Story[];
}

function App() {
  const {disableScroll, enableScroll} = usePreventBodyScroll();
  const user = useAppSelector((state) => state.user);
  const [stories, setStories] = useState<Stories[]>([]);
  const [isAddStr, setIsAddStr] = useState(false);
  const [selectStr, setSelectStr] = useState<string | null>(null);
  const [toggler, setToggler] = useState(false);
  const {palette} = useTheme();

  const handleGetStories = async () => {
    const data = await getStories();
    setStories(data.reverse());
  };
  useEffect(() => {
    handleGetStories();
  }, []);

  return (
    <>
      <Box
        mb={2}
        bgcolor={palette.mode === "dark" ? "#151521" : "#fff"}
        p={2}
        pb={4}
        borderRadius={5}
      >
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            Header={
              <Box my={2} display={"flex"} gap={1} onClick={(e) => {
                e.stopPropagation();
                setIsAddStr(true);
              }}>
                <MenuBookIcon/>
                <Typography variant="h4">Stories</Typography>
              </Box>
            }
            // Footer={<div>FOOTER</div>}
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
          >
            {stories.map((data, index) => (
              <Box
                display={"flex"}
                gap={1}
                onClick={() => {
                  setToggler(!toggler);
                  setSelectStr(index.toString());
                }}
              >
                {index === 0 && (
                  <Box
                    textAlign={"center"}
                    width={"160px"}
                    height={"200px"}
                    sx={{cursor: "pointer"}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddStr(true);
                    }}
                  >
                    <img
                      src={"http://localhost:3001/" + user.picturePath}
                      alt=""
                      style={{objectFit: "cover", height: "120px",width:"160px"}}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAddStr(true);
                      }}
                    />
                    <AddAPhotoOutlined sx={{transform: "translateY(-8px)"}}/>
                    <Typography>Create story</Typography>
                  </Box>
                )}
                <Card {...data.stories[data.stories.length - 1]} />
              </Box>
            ))}
          </ScrollMenu>
        </div>
      </Box>
      <AddStory
        handleFetch={() => handleGetStories()}
        isOpen={isAddStr}
        handleClose={() => setIsAddStr(false)}
      />
      {selectStr && (
        <Modal open={!!selectStr} onClose={() => setSelectStr(null)}>
          <Box sx={style}>
            <Stack flexDirection={"row"} gap={3} alignItems={"center"}>
              <Box width={40}>
                {+selectStr > 0 && <IconButton
                    sx={{cursor: "pointer"}}
                    onClick={() => setSelectStr((+selectStr - 1).toString())}><ArrowBackOutlined/></IconButton>}
              </Box>
              <Box>
                <Typography variant={"h3"}>
                  {stories[+selectStr].user.lastName} {stories[+selectStr].user.firstName}
                </Typography>
                <Typography variant={"body2"} mt={0.5}>
                  <AccessAlarmIcon fontSize={"small"}/> {moment(stories[+selectStr].stories[0].createdAt).fromNow()}
                </Typography>
                <Divider sx={{my: 1.5}}/>
                <Stories
                  //@ts-ignore
                  stories={stories[+selectStr].stories.map(
                    (str) => "http://localhost:3001/" + str.image
                  )}
                  defaultInterval={3500}
                  height={400}
                />
              </Box>
              <Box width={40}>
              {+selectStr < stories.length - 1 && <IconButton
                  sx={{cursor: "pointer"}}
                  onClick={() => setSelectStr((+selectStr + 1).toString())}><ArrowForwardOutlined/></IconButton>}
              </Box>
            </Stack>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default App;

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
