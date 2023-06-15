export const getProfile = async (setUser) => {
  const token = localStorage.getItem("fidoauth_token");
  if (token) {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res?.ok) {
        const data = await res.json();
        setUser(data);
        return;
      }
      localStorage.removeItem("fidoauth_token");
      setUser(null);
    } catch (error) {
      console.log("error");
      localStorage.removeItem("fidoauth_token");
      setUser(null);
    }
  }
};
