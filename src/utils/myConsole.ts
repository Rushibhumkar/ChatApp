export const myConsole = (key: string, value: any) => {
  let type = typeof value;
  return type === 'string'
    ? console.log(key, value)
    : console.log(key, JSON.stringify(value, null, 2));
};
