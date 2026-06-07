import { CircularProgress, Typography } from "@mui/material";
import { LoaderRoot } from "./PageLoader.styled";

const PageLoader = () => (
  <LoaderRoot>
    <CircularProgress color="primary" />
    <Typography color="text.secondary">Загрузка...</Typography>
  </LoaderRoot>
);

export default PageLoader;
