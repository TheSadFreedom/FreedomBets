import { createGlobalStyle } from "styled-components";

const textStyles = {
  fontFamily: "Play, sans-serif",
  fontWeight: "600",
  color: "#fff",
  margin: "0",
  wordSpacing: "5px",
  letterSpacing: "2px",
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
  },
  h2: {
    ...textStyles,
    fontSize: "32px",
    lineHeight: "40px",
  },
  h3: {
    ...textStyles,
    fontSize: "24px",
    lineHeight: "32px",
  },
  h4: {
    ...textStyles,
    fontSize: "16px",
    lineHeight: "20px",
    opacity: "0.9",
  },
  p: {
    ...textStyles,
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: "400",
    opacity: "0.7",
  },
  a: {
    ...textStyles,
    textDecoration: "none",
  },
  button: {
    ...textStyles,
  },
  input: {
    ...textStyles,
  },
  'input[type="number"]': {
    MozAppearance: "textfield",
  },
  'input[type="number"]::-webkit-outer-spin-button': {
    WebkitAppearance: "none",
    margin: 0,
  },
  'input[type="number"]::-webkit-inner-spin-button': {
    WebkitAppearance: "none",
    margin: 0,
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
