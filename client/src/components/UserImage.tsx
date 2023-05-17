import { Box } from "@mui/material";

interface UserImageProps {
  image: string;
  size: number;
  style?: any;
}

const UserImage = ({ image, size, style }: UserImageProps) => {
  return (
    <Box>
      <img
        alt={"user image"}
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          ...style,
          height: size,
          width: size,
        }}
        src={`http://localhost:3001/${image}`}
      />
    </Box>
  );
};

export default UserImage;
