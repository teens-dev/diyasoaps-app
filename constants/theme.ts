/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1F1B18';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F1B18',
    background: '#FAF4EE',
    tint: tintColorLight,
    icon: '#4A4543',
    tabIconDefault: '#9E978F',
    tabIconSelected: '#1F1B18',
    // Custom Diya Soaps brand design tokens
    headerBg: '#FAF4EE',
    cardBg: '#FFFFFF',
    searchBg: '#F7ECE5',
    searchPlaceholder: '#9E978F',
    announcementBg: '#1F1B18',
    announcementText: '#FFFFFF',
    accentOrange: '#E86C38',
    discountGreen: '#2D7D46',
    badgeRed: '#E63946',
    badgeRedBg: '#FFF0F0',
    borderWarm: '#EAE2D8',
    pillDark: '#231F20',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    headerBg: '#151718',
    cardBg: '#1E2022',
    searchBg: '#282A2C',
    searchPlaceholder: '#888888',
    announcementBg: '#000000',
    announcementText: '#FFFFFF',
    accentOrange: '#E86C38',
    discountGreen: '#4ADE80',
    badgeRed: '#EF4444',
    badgeRedBg: '#3F1D1D',
    borderWarm: '#333333',
    pillDark: '#FAF4EE',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
