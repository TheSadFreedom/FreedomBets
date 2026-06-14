import { get } from "node:http";

const DEV_SERVER_URL = "http://127.0.0.1:5173";

function probeUrl(url) {
  return new Promise((resolve, reject) => {
    const request = get(url, (response) => {
      response.resume();
      if (response.statusCode && response.statusCode < 500) {
        resolve(undefined);
        return;
      }
      reject(new Error(`Unexpected status ${response.statusCode}`));
    });

    request.on("error", reject);
    request.setTimeout(2_000, () => {
      request.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

export async function waitForUrl(url, timeoutMs = 120_000) {
  const candidates = url.includes("127.0.0.1")
    ? [url, url.replace("127.0.0.1", "localhost")]
    : [url];

  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    for (const candidate of candidates) {
      try {
        await probeUrl(candidate);
        return;
      } catch {
        // retry with next candidate / next loop
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export async function waitForDevServer() {
  console.log(`Waiting for Vite dev server at ${DEV_SERVER_URL}...`);
  await waitForUrl(DEV_SERVER_URL);
  console.log("Vite dev server is ready");
}
