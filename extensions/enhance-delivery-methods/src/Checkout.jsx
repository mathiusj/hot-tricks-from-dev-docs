import { useState, useCallback, useMemo } from "react";
import {
  Heading,
  DatePicker,
  reactExtension,
} from "@shopify/ui-extensions-react/checkout";

reactExtension("purchase.checkout.shipping-option-list.render-after", () => (
  <Extension />
));

export default function Extension() {
  const [selectedDate, setSelectedDate] = useState("");
  const [yesterday, setYesterday] = useState("");

  // Sets the selected date to today, unless today is Sunday, then it sets it to tomorrow
  useMemo(() => {
    let today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const deliveryDate = today.getDay() === 0 ? tomorrow : today;

    setSelectedDate(formatDate(deliveryDate));
    setYesterday(formatDate(yesterday));
  }, []);

  // Set a function to handle the Date Picker component's onChange event
  const handleChangeDate = useCallback((selectedDate) => {
    setSelectedDate(selectedDate);
  }, []);

  return (
    <>
      <Heading>Select a date for delivery</Heading>
      <DatePicker
        selected={selectedDate}
        onChange={handleChangeDate}
        disabled={["Sunday", { end: yesterday }]}
      />
    </>
  );
}

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
