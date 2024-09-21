export const Colors = {
    primary: "#000",
    secondary: "#CCC",
    light: "#FFF",
    gray: "#ADB3B3",
    dark: "#4B4C4C",
  };
  
  const tintColorLight = "#2f95dc";
  const tintColorDark = "#E7E7E7";
  
  const colors = {
    light: {
      text: "#0D0D0D",
      background: "#F2F2F4",
      tint: tintColorLight,
      tabIconDefault: "#ccc",
      tabIconSelected: tintColorLight,
      red: "#EF4444",
    },
    dark: {
      text: "#F2F2F4",
      background: "#0D0D0D",
      tint: tintColorDark,
      tabIconDefault: "#ccc",
      tabIconSelected: tintColorDark,
      red: "#EF4444",
    },
  };
  
  export default { Colors, ...colors };