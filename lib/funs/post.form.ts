export const POSTForm = async (url: string, body: object) => {
  const formData = new FormData();

  Object.keys(body).forEach((key) => {
    formData.append(key, (body as any)[key]);
  });

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};
