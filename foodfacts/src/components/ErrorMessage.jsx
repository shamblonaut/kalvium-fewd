import Alert from "@mui/material/Alert";

function ErrorMessage({ message }) {
  return <Alert severity="error">{message}</Alert>;
}

export default ErrorMessage;
