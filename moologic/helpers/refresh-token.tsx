export const refreshAccessToken = async (refreshToken: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/refresh-token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
  
      if (!res.ok) {
        throw new Error("Token refresh failed");
      }
  
      const data = await res.json();
      return data.access_token;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };
  