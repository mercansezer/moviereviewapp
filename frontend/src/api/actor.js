import client from "./client";

function getToken() {
  return localStorage.getItem("auth-token");
}
export const createActor = async (formData) => {
  console.log(formData);
  const token = getToken();
  try {
    const { data } = await client.post("/actor/createActor", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const searchActor = async (query) => {
  const token = getToken();
  try {
    const { data } = await client.get(`/actor/searchActor?name=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    const { response } = error;

    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};
