import { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ScrollToTopFab } from "./ScrollToTopButton.styled";

const SCROLL_THRESHOLD = 320;

interface ScrollToTopButtonProps {
  enabled: boolean;
}

const ScrollToTopButton = ({ enabled }: ScrollToTopButtonProps) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = enabled && scrolled;

  return (
    <ScrollToTopFab
      type="button"
      $visible={visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      title="Наверх"
    >
      <KeyboardArrowUpIcon />
    </ScrollToTopFab>
  );
};

export default ScrollToTopButton;
