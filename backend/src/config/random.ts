export const randomString = (Length: number) => {
  let options = "1234567890qwertyuiopasdfghjklzxcvbnm";
  let resLength = options.length;
  let result = "";

  for (let i = 0; i < Length; i++) {
    result += options[Math.floor(Math.random() * resLength)];
  }
  return result;
};
