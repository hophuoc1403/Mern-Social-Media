import {Box, Typography} from "@mui/material";

const NoData = () => {


  return <Box width={"100%"} display={"flex"} py={10} flexDirection={"column"} sx={{margin:"0 auto"}} alignItems={"center"}>
    <img
      style={{width: "30%", minWidth: "300px"}}
      src={"/dark-theme.svg"}
      alt="no-item"/>
    <Typography variant={"h4"}>No data</Typography>
  </Box>
}

export default NoData