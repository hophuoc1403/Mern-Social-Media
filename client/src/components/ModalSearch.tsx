import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useAppSelector } from "index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useTheme } from "@emotion/react";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

interface ModalSearchProps {
  onClose: () => void;
}

const ModalSearch = ({ onClose }: ModalSearchProps) => {
  const { postsSearched } = useAppSelector((state) => state);
  const theme = useTheme();

  // @ts-ignore
  const background = theme.palette.background.default;
  return (
    <Box width={'100%'} sx={{
      position: "absolute",
      top: "100%",
      left:"0",
      maxWidth: "100%",
      maxHeight: "300px",
      overflow: "scroll",
      background: background,
      overflowX:'hidden'
    }}>
      <ClickAwayListener
      onClickAway={onClose}
      children={
        <Box
          onBlur={onClose}
        >
          <Typography sx={{ p: 2 }}>
            <Box>
              {postsSearched.length > 0 ? postsSearched.map((post) => {
                return (
                  <>
                  <FlexBetween sx={{padding:1,my:1}}>
                    <MenuItem>
                    <Typography sx={{ ml: 2,wordBreak:"break-word" }} variant="body2" >
                      {post.description}
                    </Typography>
                    </MenuItem>
                  </FlexBetween>
                  <Divider /> 
                  </>
                );
              }) : <Typography sx={{ ml: 2,wordBreak:"break-word" }} variant="body2" >
            Result not found
            </Typography>}
            </Box>
          </Typography>
        </Box>
      }
    />
    </Box>
  );
};

export default ModalSearch;
