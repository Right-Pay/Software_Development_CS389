const lightColors = {
  primary: '#4d654e',
  secondary: '#Ffffff',
  tertiary: '#e6ffe3',
};

const darkColors = {
  primary: '#e6ffe3',
  secondary: '#272727',
  tertiary: '#4d654e',
};

const colors = (colorMode: string) => {
  if (colorMode === 'dark') {
    return darkColors;
  } else {
    return lightColors;
  }
};

export { darkColors, lightColors };
export default colors;
