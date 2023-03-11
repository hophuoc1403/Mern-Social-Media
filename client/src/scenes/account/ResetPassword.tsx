import {
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "service/auth.service";

const ResetPassword = () => {
  const { token } = useParams();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("min-width(1000px)");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const resetSchema = z
    .object({
      password: z.string().min(4),
      confirmPassword: z.string().min(4),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type FormData = z.infer<typeof resetSchema> & { unusedProperty: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetSchema),
  });

  const handleResetPassword = handleSubmit(async (values) => {
    try {
      setIsLoading(true);
      await resetPassword({
        password: values.password,
        token: token as string,
      });
      toast.success("update success !");
      navigate("/account/login");
    } catch (e) {
      toast.error("update password failed");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Box
      width={isNonMobileScreens ? "50%" : "93%%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={"1.5rem"}
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Typography variant={"h3"} textAlign={"center"}>
        Reset your password{" "}
      </Typography>
      <Box
        maxWidth={"700px"}
        margin={"0 auto"}
        border={`1px solid ${theme.palette.primary.light}`}
        p={5}
        my={3}
      >
        <form action="" onSubmit={handleResetPassword}>
          <Typography variant="subtitle1" className="text-xs pb-3">
            New password :
          </Typography>
          <TextField
            className="mt-2"
            sx={{ mb: 3 }}
            fullWidth
            type={"password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Typography variant="subtitle1" className="text-xs pb-3">
            {" "}
            Confirm password :{" "}
          </Typography>

          <TextField
            fullWidth
            type={"password"}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Box mt={5} className={"text-right"}>
            <Button
              variant={"contained"}
              sx={{ backgroundColor: "red", marginRight: "2rem" }}
              onClick={() => navigate("/account/login")}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={isLoading}
              type={"submit"}
              variant={"contained"}
            >
              Submit
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPassword;
