const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "https://localhost:7155";

export const streamChat = (
  query: string,
  onMessage: (data: string) => void,
  onError: () => void
) => {
  const token = localStorage.getItem("token");
  const tenant = localStorage.getItem("tenant");
  const url = new URL("/api/chat/stream", baseURL);
  url.searchParams.set("query", query);
  if (token) {
    url.searchParams.set("access_token", token);
  }
  if (tenant) {
    url.searchParams.set("tenant", tenant);
  }

  const source = new EventSource(url.toString());

  source.onmessage = (event) => {
    onMessage(event.data);
  };

  source.onerror = () => {
    source.close();
    onError();
  };

  return () => source.close();
};
