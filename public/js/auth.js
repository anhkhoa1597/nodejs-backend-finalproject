const checkAuth = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      //Handle Invalid Token -> clear localstorag
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      return null;
    }

    const data = await res.json();
    return data; // { message, user:{} }
  } catch (error) {
    console.error("Error checking auth", error);
    return null;
  }
};

export default checkAuth;
