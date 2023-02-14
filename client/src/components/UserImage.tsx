import {Box} from "@mui/material";

interface UserImageProps {
  image:string,
  size:number
}

const UserImage = ({image,size}:UserImageProps) => {
  return (<Box width={size} height={size}>
    <img alt={"user image"} style={{objectFit:"cover",borderRadius:"50%"}}
      width={size} height={size} src={`http://localhost:3001/assets/${image}`}
    />
  </Box>)
}

export default UserImage