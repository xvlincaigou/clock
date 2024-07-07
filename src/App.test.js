import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/My Clock App/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders mode buttons", () => {
  render(<App />);
  const clockButton = screen.getByText(/Clock/i);
  const stopwatchButton = screen.getByText(/Stopwatch/i);
  const timerButton = screen.getByText(/Timer/i);
  const alarmButton = screen.getByText(/Alarm/i);
  expect(clockButton).toBeInTheDocument();
  expect(stopwatchButton).toBeInTheDocument();
  expect(timerButton).toBeInTheDocument();
  expect(alarmButton).toBeInTheDocument();
});
