import {Box, Divider, TextField, Typography} from "@mui/material";
import {z} from "zod";
import {useAppSelector} from "../../index";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {reportPost} from "../../service/post.service";
import {Stack} from "@mui/system";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import {style} from "../profile/ModalEdit";

const schema = z.object({
  title: z.string().min(3, "Email must be a valid email address"),
  description: z.string().min(3),
});

const ReportPost = ({handleClose,postId,isOpen}:{handleClose:() => void,postId:number,isOpen:boolean}) => {

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
      await reportPost({...data,postId,userId:user.id});
      await new Promise(_ => setTimeout(_,2000))
      toast.update(toastId, {
        render: "report post success",
        delay: 2,
        type: toast.TYPE.SUCCESS,
        className: "rotateY animated",
        autoClose: 4000,
      });
      reset();
      handleClose()
    } catch (e) {
      console.log({ error: e });
      toast.update(toastId, {
        render: "report post failed",
        delay: 2,
        type: toast.TYPE.ERROR,
        className: "rotateY animated",
        autoClose: 4000,
      });
    }
  });

  return (<Modal
    open={isOpen}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <form onSubmit={onSubmit}>
        <Typography id="modal-modal-title" variant="h3" component="h2" my={2}>
          Report this post
        </Typography>
        <Divider />
        <TextField
          error={!!errors.title}
          label="Title"
          {...register("title")}
          helperText={!!errors.title?.message}
          fullWidth
          sx={{marginBlock:'1.5rem'}}
          multiline
          minRows={5}
        />
        <TextField
          error={!!errors.description}
          label="Description"
          {...register("description")}
          helperText={!!errors.description?.message}
          fullWidth
          sx={{marginBlock:'1.5rem'}}
          multiline
          minRows={5}
        />
        <Stack justifyContent={"flex-end"} flexDirection={"row"} gap={1}>
          <Button onClick={handleClose} variant={"text"} color={"secondary"}>Cancel</Button>
          <Button type="submit" variant={"contained"} color={"error"}>Report</Button>
        </Stack>
      </form>
    </Box>
  </Modal>)
}

export default ReportPost