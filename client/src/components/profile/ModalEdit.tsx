import useProfileStore from "hooks/stateProfile.store";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider, TextField } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "index";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { editProfile } from "service/user.service";
import { setUSer } from "state";
import {Stack} from "@mui/system";

export const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const ModalEdit = () => {
  const { isOpenEditModal, handleCloseModal } = useProfileStore();
  const dispatch = useAppDispatch();

  const schema = z.object({
    firstName: z.string().min(3, "Email must be a valid email address"),
    lastName: z.string().min(3),
    location: z.string().min(3),
    occupation: z.string().min(3),
  });
  const { user } = useAppSelector((state) => state);

  type FormData = z.infer<typeof schema> & { unusedProperty: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    const toastId = toast.info("loading ....", {
      autoClose: false,
      className: "rotateY animated",
    });
    try {
      const response = await editProfile(data);      
      dispatch(setUSer({user:response.data}));
      await new Promise(_ => setTimeout(_,2000))
      toast.update(toastId, {
        render: "update profile success",
        delay: 2,
        type: toast.TYPE.SUCCESS,
        className: "rotateY animated",
        autoClose: 4000,
      });
      reset();
      handleCloseModal()
    } catch (e) {
      console.log({ error: e });
      toast.update(toastId, {
        render: "update profile failed",
        delay: 2,
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  });

  return (
    <Modal
      open={isOpenEditModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <form onSubmit={onSubmit}>
          <Typography id="modal-modal-title" variant="h3" component="h2" my={2}>
            Edit your profile
          </Typography>
          <Divider />
          <TextField
            id="firstName"
            error={!!errors.firstName}
            label="First Name"
            defaultValue={user.firstName}
            {...register("firstName")}
            helperText={!!errors.firstName?.message}
            fullWidth
            sx={{marginBlock:'1.5rem'}}
          />
          <TextField
            id="firstName"
            error={!!errors.lastName}
            label="First Name"
            defaultValue={user.lastName}
            {...register("lastName")}
            helperText={!!errors.lastName?.message}
            fullWidth
            sx={{marginBlock:'1.5rem'}}
          />
          <TextField
            id="firstName"
            error={!!errors.location}
            label="First Name"
            defaultValue={user.location}
            {...register("location")}
            helperText={!!errors.location?.message}
            fullWidth
            sx={{marginBlock:'1.5rem'}}
            
          />
          <TextField
            id="firstName"
            error={!!errors.occupation}
            label="First Name"
            defaultValue={user.occupation}
            {...register("occupation")}
            helperText={!!errors.occupation?.message}
            fullWidth
            sx={{marginBlock:'1.5rem'}}
          />

          <Stack alignItems={"flex-end"}>
            <Button type="submit">Update</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalEdit;
