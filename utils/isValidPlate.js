// Function to validate a license plate in the format "ABC-1A23"
const isValidPlate = (plate) => {
  // Check if plate is a string and has exactly 8 characters
  if (typeof plate !== "string" || plate.length !== 8) {
    return false;
  }

  // Split the plate into two parts using the dash: ["ABC", "1A23"]
  const [letters, rest] = plate.split("-");

  // If the split does not result in two parts, it's invalid
  if (!letters || !rest) {
    return false;
  }

  // Validate the first part (should be exactly 3 uppercase letters)
  if (
    letters.length !== 3 ||
    !letters.split("").every((c) => c >= "A" && c <= "Z")
  ) {
    return false;
  }

  // The second part should be exactly 4 characters long
  if (rest.length !== 4) {
    return false;
  }

  // Destructure each character from the second part
  const [char1, char2, char3, char4] = rest;

  // Validate format: digit + uppercase letter + 2 digits
  if (isNaN(char1)) return false;
  if (!(char2 >= "A" && char2 <= "Z")) return false;
  if (isNaN(char3) || isNaN(char4)) return false;

  // If all checks pass, the plate is valid
  return true;
};

export default isValidPlate;
