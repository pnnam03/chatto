export const upload = async (file, accessToken) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/api/v1/media", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    console.error(err);
  }
};
