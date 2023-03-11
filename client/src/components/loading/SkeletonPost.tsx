import {Box, Skeleton, Stack} from "@mui/material";
import FlexBetween from "../FlexBetween";

const SkeletonPost = () => {
    return <Stack spacing={1} my={2}>
    {/* For variant="text", adjust the height via font-size */}
    <FlexBetween>
    <Stack display={'flex'} flexDirection="row" gap={2}>
        <Skeleton variant="circular" width={50} height={50} />
        <Stack>
            <Skeleton variant="text" width={180} />
            <Skeleton variant="text" width={150} />
        </Stack>
    </Stack>
    <Skeleton variant="circular" width={40} height={30} />
    </FlexBetween>

    {/* For other variants, adjust the size with `width` and `height` */}
    <Skeleton variant="text" width={570} height={30} />
    <Skeleton variant="text" width={570} height={30} />
    <Skeleton variant="rounded" width={570} height={260} />
  </Stack>
}

export default SkeletonPost