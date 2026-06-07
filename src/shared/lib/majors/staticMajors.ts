export interface StaticMajor {
  id: string;
  src: string;
}

let cache: StaticMajor[] | null = null;
let loading: Promise<StaticMajor[]> | null = null;

export async function fetchStaticMajors(): Promise<StaticMajor[]> {
  if (cache) return cache;
  if (!loading) {
    loading = fetch(`/majors/manifest.json?ts=${Date.now()}`)
      .then(async (res) => {
        if (!res.ok) return [];
        const data: unknown = await res.json();
        if (!Array.isArray(data)) return [];

        return data.filter(
          (item): item is StaticMajor =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as StaticMajor).id === "string" &&
            typeof (item as StaticMajor).src === "string"
        );
      })
      .then((items) => {
        cache = items;
        return items;
      })
      .catch(() => []);
  }

  return loading;
}
