import {Box} from "@mui/material";

interface UserImageProps {
  image:string,
  size:number
  style?:any
}

const UserImage = ({image,size,style}:UserImageProps) => {
  return (<Box width={size} height={size}>
    <img alt={"user image"} style={{objectFit:"cover",borderRadius:"50%",...style}}
      width={size} height={size} src={`http://localhost:3001/assets/${image}`}
    />
  </Box>)
}

export default UserImage