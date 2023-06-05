import {Box} from "@mui/material";
import {Calendar} from "react-calendar";

const Weather = () => {
  return (
    <Box mb={1}>
      <Calendar  value={new Date()} />
    </Box>
  );
}

export default  Weather