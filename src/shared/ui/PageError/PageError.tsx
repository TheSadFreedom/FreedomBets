import { Button, Typography } from "@mui/material";
import { ErrorRoot } from "./PageError.styled";

interface PageErrorProps {
  message: string;
  onRetry?: () => void;
}

const PageError = ({ message, onRetry }: PageErrorProps) => (
  <ErrorRoot>
    <Typography color="error">{message}</Typography>
    {onRetry && (
      <Button variant="outlined" onClick={onRetry}>
        Повторить
      </Button>
    )}
  </ErrorRoot>
);

export default PageError;
