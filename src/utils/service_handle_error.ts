import { AxiosError } from "axios";

export const handleError = ({
  error,
  service,
}: {
  service?: string;
  error: unknown;
}): never => {
  if (error instanceof AxiosError) {
    console.error(`${service} API error:`, error);
    throw (
      error.response?.data || error.message || "An unexpected error occurred"
    );
  }

  if (error instanceof Error) {
    console.error(`${service} error:`, error);
    throw error.message;
  }

  throw "An unexpected error occurred";
};
