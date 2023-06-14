export const sendRequest = async (url, method, body = null) => {
  const token = localStorage.getItem("token");

  let config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  };
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  return response;
};
