// Function to convert an object's keys from camelCase to snake_case
export default function toSnakeCase(obj) {
  const newObj = {};

  // Iterate through each key in the original object
  for (const key in obj) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );

    const value = obj[key];

    // If the value is a Date, format it to Brasília time (GMT-3)
    if (value instanceof Date) {
      // Subtract 3 hours to adjust to Brasília timezone
      const localDate = new Date(value.getTime() - 3 * 60 * 60 * 1000);

      // Convert to ISO string and remove the "Z" (which represents UTC)
      newObj[snakeKey] = localDate.toISOString().replace("Z", "");
    } else {
      // Otherwise, just assign the value to the new key
      newObj[snakeKey] = value;
    }
  }

  // Return the new object with snake_case keys
  return newObj;
}
