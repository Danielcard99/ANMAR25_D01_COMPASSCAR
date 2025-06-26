export default function toSnakeCase(obj) {
  const newObj = {};

  for (const key in obj) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );

    const value = obj[key];

    if (value instanceof Date) {
      const localDate = new Date(value.getTime() - 3 * 60 * 60 * 1000);

      newObj[snakeKey] = localDate.toISOString().replace("Z", "");
    } else {
      newObj[snakeKey] = value;
    }
  }

  return newObj;
}
