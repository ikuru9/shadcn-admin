import { DATE_FORMAT } from "@/constants/format";
import { format } from "date-fns";

export const formatDate = (date?: Date | null): string => {
  if (!date) {
    return "";
  }

  return format(date, DATE_FORMAT);
};
