import { Box } from "@mui/system";
import {
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { verifyAccount } from "../../service/auth.service";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("min-width(1000px)");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendedEmail, setIsSendedEmail] = useState<boolean>(false);
  const navigate = useNavigate();
  const schema = z.object({
    email: z.string().email(),
  });

  type FormData = z.infer<typeof schema> & { unusedProperty: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleVerify = handleSubmit(async (values: FormData) => {
    try {
      setIsLoading(true);
      await verifyAccount({ email: values.email });
      toast.success("Email was sent to your account !");
      setIsSendedEmail(true);
    } catch (e) {
      console.log(e);
      toast.error("Email send failed ");
    } finally {
      setIsLoading(false);
    }
  });

  // @ts-ignore
  return (
    <Box
      width={isNonMobileScreens ? "50%" : "93%%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={"1.5rem"}
      sx={{ backgroundColor: theme.palette.background.default }}
      textAlign={"center"}
    >
      <Typography variant={"h3"} textAlign={"center"}>
        Enter your email{" "}
      </Typography>
      <Box
        maxWidth={"700px"}
        margin={"0 auto"}
        border={`1px solid ${theme.palette.primary.light}`}
        p={5}
        my={3}
      >
        {!isSendedEmail ? (
          <form onSubmit={handleVerify}>
            <TextField
              label={"email"}
              {...register("email")}
              helperText={errors.email?.message}
              fullWidth
              error={!!errors.email}
            />
            <Box mt={5}>
              <Button
                variant={"contained"}
                sx={{ backgroundColor: "red", marginRight: "4rem" }}
                onClick={() => navigate("/account/login")}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading}
                type={"submit"}
                variant={"contained"}
              >
                Send Email
              </LoadingButton>
            </Box>
          </form>
        ) : (
          <Box>
            <Typography>EMAIL WAS SENT TO YOU</Typography>
            <Typography>Check to reset password</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForgetPassword;
