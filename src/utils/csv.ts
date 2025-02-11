export const formatFunctionalLevel = (level: string) => {
  switch (level) {
    case "自立":
      return "Independence";
    case "要支援１":
    case "要支援1":
      return "Support required 1";
    case "要支援２":
    case "要支援2":
      return "Support required 2";
    case "要介護１":
    case "要介護1":
      return "Nursing care required 1";
    case "要介護２":
    case "要介護2":
      return "Nursing care required 2";
    case "要介護３":
    case "要介護3":
      return "Nursing care required 3";
    case "要介護４":
    case "要介護4":
      return "Nursing care required 4";
    case "要介護５":
    case "要介護5":
      return "Other";
    default:
      return level;
  }
};

export const formatGender = (gender: string) => {
  switch (gender) {
    case "男性":
      return "Male";
    case "女性":
      return "Female";
    case "その他":
      return "Other";
    default:
      return gender;
  }
};

export const validGenders = ["男性", "女性", "その他"];

export const validFunctionalLevels = [
  "自立",
  "要支援１",
  "要支援２",
  "要介護１",
  "要介護２",
  "要介護３",
  "要介護４",
  "要介護５",
  "要支援1",
  "要支援2",
  "要介護1",
  "要介護2",
  "要介護3",
  "要介護4",
  "要介護5",
];

export const convertToDate = (dateString: string): string | null => {
  const normalizedDateString = dateString
    .replace(/[-\/]/g, "-")
    .split("-")
    .map((part) => part.padStart(2, "0"))
    .join("-");

  const datePattern = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!datePattern.test(normalizedDateString)) {
    return null;
  }

  return normalizedDateString;
};
