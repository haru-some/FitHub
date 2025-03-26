import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Box } from "@mui/material";

export default function DateCalendarValue(props) {
  const date = props.date;
  const setDate = props.setDate;

  return (
    <Box
      sx={{
        width: 400,
        backgroundColor: "#222",
        padding: 2,
        margin: "0 auto",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar", "DateCalendar"]}>
          <DemoItem label="날짜 선택">
            <DateCalendar
              sx={{
                backgroundColor: "#222", // 배경색 변경
                color: "#fff", // 글씨색 변경
                "& .MuiDayPicker-weekdayLabel": {
                  color: "#fff", // 요일 이름 색상 변경
                },
                "& .Mui-selected": {
                  color: "#fff", // 선택된 날짜의 글씨색 변경
                },
              }}
              value={date}
              onChange={(newValue) => setDate(newValue)}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
}
