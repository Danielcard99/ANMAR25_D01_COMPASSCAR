const isValidPlate = (plate) => {
  if (typeof plate !== "string" || plate.length !== 8) {
    return false;
  }

  const [letters, rest] = plate.split("-");

  if (!letters || !rest) {
    return false;
  }

  if (
    letters.length !== 3 ||
    !letters.split("").every((c) => c >= "A" && c <= "Z")
  ) {
    return false;
  }

  if (rest.length !== 4) {
    return false;
  }

  const [char1, char2, char3, char4] = rest;

  if (isNaN(char1)) return false;
  if (!(char2 >= "A" && char2 <= "Z")) return false;
  if (isNaN(char3) || isNaN(char4)) return false;

  return true;
};

export default isValidPlate;
