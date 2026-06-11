const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "ru-RU,ru;q=0.9",
  Referer: "https://cyber.sports.ru/",
};

export async function fetchSportsRuPage(url) {
  const response = await fetch(url, {
    headers: DEFAULT_HEADERS,
    redirect: "follow",
  });
  const html = await response.text();

  if (!response.ok) {
    const error = new Error(`Sports.ru HTTP ${response.status}`);
    error.code = "HTTP_ERROR";
    throw error;
  }

  if (/captcha|доступ ограничен|robot/i.test(html) && !html.includes("match-teaser")) {
    const error = new Error("Sports.ru ограничил доступ");
    error.code = "BLOCKED";
    throw error;
  }

  return html;
}
