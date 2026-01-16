import { format } from "date-fns";

import { DATE_FORMAT } from "@/constants/format";

export const formatDate = (date?: Date | null): string => {
  if (!date) {
    return "";
  }

  return format(date, DATE_FORMAT);
};
