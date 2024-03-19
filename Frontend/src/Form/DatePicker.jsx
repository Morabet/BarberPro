import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

export default function BasicDatePicker({ selectedDate, onDateChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={selectedDate} onChange={onDateChange} />
    </LocalizationProvider>
  );
}
