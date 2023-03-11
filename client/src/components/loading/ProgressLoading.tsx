import LinearProgress from '@mui/material/LinearProgress';
import {Box} from "@mui/material";
import {useEffect, useState} from "react";


const ProgressLoading = () => {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 12;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [])
  return <Box className={""}>
    <LinearProgress variant="determinate" value={progress}/>
  </Box>
}

export default ProgressLoading