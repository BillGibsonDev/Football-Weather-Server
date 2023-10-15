export const generateUserAgent = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 21; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};