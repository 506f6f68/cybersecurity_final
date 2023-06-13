export const isLoggedIn = async () => {
  const token = localStorage.getItem("token");
  return !!token;
};
