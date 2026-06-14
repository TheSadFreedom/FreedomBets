import { useCallback, useState, type ReactNode } from "react";
import {
  Header,
  HeaderCenter,
  HeaderInner,
  HeaderLeft,
  HeaderLink,
  HeaderLinkLogo,
  HeaderRight,
  LayoutRoot,
  LogoButton,
  LogoMark,
  Main,
} from "./AppLayout.styled";
import LogoClickToast from "./LogoClickToast";
import { pickRandomLogoClickMessage } from "./logoClickMessages";

const HLTV_URL = "https://www.hltv.org/";
const BETBOOM_URL = "https://betboom.ru/";
const WINLINE_URL = "https://winline.ru/stavki/sport/kibersport/counter-strike";
const STAVKA_TV_URL = "https://stavka.tv/matches/csgo";

interface AppLayoutProps {
  children: ReactNode;
  headerProfile?: ReactNode;
}

const AppLayout = ({ children, headerProfile }: AppLayoutProps) => {
  const [logoToast, setLogoToast] = useState<{ key: number; message: string } | null>(null);

  const handleLogoClick = () => {
    setLogoToast({
      key: Date.now(),
      message: pickRandomLogoClickMessage(),
    });
  };

  const handleToastClose = useCallback(() => {
    setLogoToast(null);
  }, []);

  return (
    <LayoutRoot>
      <Header>
        <HeaderInner>
          <HeaderLeft aria-label="Внешние ссылки">
            <HeaderLink href={HLTV_URL} target="_blank" rel="noopener noreferrer" title="HLTV">
              <HeaderLinkLogo src="/links/hltv.png" alt="HLTV" />
            </HeaderLink>
            <HeaderLink href={BETBOOM_URL} target="_blank" rel="noopener noreferrer" title="BetBoom">
              <HeaderLinkLogo src="/links/betboom.webp" alt="BetBoom" />
            </HeaderLink>
            <HeaderLink href={WINLINE_URL} target="_blank" rel="noopener noreferrer" title="Winline">
              <HeaderLinkLogo src="/links/winline.png" alt="Winline" />
            </HeaderLink>
            <HeaderLink href={STAVKA_TV_URL} target="_blank" rel="noopener noreferrer" title="Stavka.tv">
              <HeaderLinkLogo src="/links/stavka-tv.png" alt="Stavka.tv" />
            </HeaderLink>
          </HeaderLeft>

          <HeaderCenter>
            <LogoButton type="button" onClick={handleLogoClick} aria-label="FreedomBets">
              <LogoMark src="/logo.png" alt="" />
            </LogoButton>
          </HeaderCenter>

          <HeaderRight>{headerProfile}</HeaderRight>
        </HeaderInner>
      </Header>

      <LogoClickToast toast={logoToast} onClose={handleToastClose} />

      <Main>{children}</Main>
    </LayoutRoot>
  );
};

export default AppLayout;
