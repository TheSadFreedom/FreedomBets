export async function importDatabase(file: File): Promise<void> {
  const text = await file.text();
  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("Файл не является корректным JSON");
  }

  const response = await fetch("/api/import/db", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Не удалось импортировать базу данных";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
}
