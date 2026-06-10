import { createGlobalStyle } from "styled-components";
import { media } from "@/shared/styles/breakpoints";

const textStyles = {
  fontFamily: "Play, sans-serif",
  fontWeight: "600",
  color: "#fff",
  margin: "0",
  wordSpacing: "5px",
  letterSpacing: "2px",
};

const mobileText = {
  letterSpacing: "0.5px",
  wordSpacing: "normal",
};

export const GlobalStyles = createGlobalStyle({
  "*": {
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  "*::before": {
    boxSizing: "border-box",
  },
  "*::after": {
    boxSizing: "border-box",
  },
  html: {
    WebkitTextSizeAdjust: "100%",
  },
  "input, select, textarea, .MuiInputBase-input": {
    [media.down("sm")]: {
      fontSize: "16px",
    },
  },
  body: {
    fontFamily: "Play, sans-serif",
    margin: 0,
    padding: 0,
    backgroundColor: "#1F1F1F",
    color: "white",
    lineHeight: 1.6,
    overflowX: "hidden",
    WebkitTapHighlightColor: "transparent",
  },
  "#root": {
    minHeight: "100dvh",
  },
  h1: {
    ...textStyles,
    fontSize: "45px",
    lineHeight: "40px",
    [media.down("sm")]: { ...mobileText, fontSize: "28px", lineHeight: "1.2" },
  },
  h2: {
    ...textStyles,
    fontSize: "32px",
    lineHeight: "40px",
    [media.down("sm")]: { ...mobileText, fontSize: "22px", lineHeight: "1.25" },
  },
  h3: {
    ...textStyles,
    fontSize: "24px",
    lineHeight: "32px",
    [media.down("sm")]: { ...mobileText, fontSize: "18px", lineHeight: "1.3" },
  },
  h4: {
    ...textStyles,
    fontSize: "16px",
    lineHeight: "20px",
    opacity: "0.9",
    [media.down("sm")]: mobileText,
  },
  p: {
    ...textStyles,
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "400",
    opacity: "0.7",
    [media.down("sm")]: { ...mobileText, fontSize: "14px", lineHeight: "1.45" },
  },
  a: {
    ...textStyles,
    textDecoration: "none",
  },
  button: {
    ...textStyles,
    [media.down("sm")]: mobileText,
  },
  input: {
    ...textStyles,
    [media.down("sm")]: mobileText,
  },
  "::placeholder": {
    ...textStyles,
  },
  "::-webkit-scrollbar": {
    width: "12px",
  },
  "::-webkit-scrollbar-track": {
    background: "#333",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "6px",
    border: "2px solid #555",
  },
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
});
