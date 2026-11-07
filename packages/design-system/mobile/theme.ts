// Owezy theme for React Native / Expo (or any TS app). Generated from tokens.json.

export const light = {
  "background": "#F7F7FB",
  "surface": "#FFFFFF",
  "surfaceRaised": "#FFFFFF",
  "subtle": "#F4F3FA",
  "track": "#EEEDF6",
  "border": "#ECECF3",
  "borderStrong": "#E4E3EE",
  "divider": "#F0EFF5",
  "text": "#14142B",
  "textSecondary": "#4B4B66",
  "textMuted": "#6E6E87",
  "primary": "#635BDB",
  "primaryPressed": "#4B43C4",
  "primaryText": "#635BDB",
  "accentText": "#4B43C4",
  "primarySoft": "#EFEEFC",
  "onPrimary": "#FFFFFF",
  "owed": "#0E8A5F",
  "owedSoft": "#E6F6EF",
  "owe": "#C2410C",
  "oweSoft": "#FFF1E6",
  "danger": "#B42318",
  "warningText": "#8A2E06",
  "inverse": "#14142B"
} as const;

export const dark = {
  "background": "#0E0D1A",
  "surface": "#1A1930",
  "surfaceRaised": "#2D2B4D",
  "subtle": "#24233D",
  "track": "#22213A",
  "border": "#2A2944",
  "borderStrong": "#34334F",
  "divider": "#26253E",
  "text": "#F2F1FA",
  "textSecondary": "#C9C8DE",
  "textMuted": "#A3A2BD",
  "primary": "#635BDB",
  "primaryPressed": "#4B43C4",
  "primaryText": "#9C96FF",
  "accentText": "#A9A4FF",
  "primarySoft": "#2A2752",
  "onPrimary": "#FFFFFF",
  "owed": "#4CD592",
  "owedSoft": "#12321F",
  "owe": "#FF9A5C",
  "oweSoft": "#3A2416",
  "danger": "#FF8A80",
  "warningText": "#FFC9A8",
  "inverse": "#2A2650"
} as const;

export type ThemeColors = { [K in keyof typeof light]: string };

export const chart = {
  "series": [
    "#635BDB",
    "#7FC8EC",
    "#F2A541",
    "#2FB57A",
    "#E05B9B"
  ],
  "positive": "#2FB57A",
  "negative": "#F08A4B",
  "barMuted": {
    "light": "#D9D6F8",
    "dark": "#3A3670"
  },
  "areaFillOpacity": 0.1
} as const;

export const category = {
  "food": {
    "light": {
      "bg": "#FFF1E6",
      "fg": "#C2410C"
    },
    "dark": {
      "bg": "#3A2416",
      "fg": "#FF9A5C"
    }
  },
  "bills": {
    "light": {
      "bg": "#FEF7D6",
      "fg": "#8A6100"
    },
    "dark": {
      "bg": "#352C10",
      "fg": "#EBC75A"
    }
  },
  "travel": {
    "light": {
      "bg": "#E8F3FE",
      "fg": "#0B6A9E"
    },
    "dark": {
      "bg": "#13304A",
      "fg": "#8DCBF5"
    }
  },
  "settlement": {
    "light": {
      "bg": "#E6F6EF",
      "fg": "#0E8A5F"
    },
    "dark": {
      "bg": "#12321F",
      "fg": "#4CD592"
    }
  },
  "groceries": {
    "light": {
      "bg": "#F1EEFE",
      "fg": "#635BDB"
    },
    "dark": {
      "bg": "#26244A",
      "fg": "#9C96FF"
    }
  },
  "entertainment": {
    "light": {
      "bg": "#FCE7F1",
      "fg": "#A3245F"
    },
    "dark": {
      "bg": "#3D1E30",
      "fg": "#F5A3CB"
    }
  }
} as const;

export const avatar = {
  "you": {
    "light": {
      "bg": "#635BDB",
      "fg": "#FFFFFF"
    },
    "dark": {
      "bg": "#635BDB",
      "fg": "#FFFFFF"
    }
  },
  "pink": {
    "light": {
      "bg": "#FCE7F1",
      "fg": "#A3245F"
    },
    "dark": {
      "bg": "#3D1E30",
      "fg": "#F5A3CB"
    }
  },
  "sky": {
    "light": {
      "bg": "#E0F2FE",
      "fg": "#0B6A9E"
    },
    "dark": {
      "bg": "#13304A",
      "fg": "#8DCBF5"
    }
  },
  "amber": {
    "light": {
      "bg": "#FEF3C7",
      "fg": "#8A5A00"
    },
    "dark": {
      "bg": "#3A2E10",
      "fg": "#F2CF73"
    }
  },
  "green": {
    "light": {
      "bg": "#DCFCE7",
      "fg": "#166A3D"
    },
    "dark": {
      "bg": "#143826",
      "fg": "#7FDCA6"
    }
  },
  "peach": {
    "light": {
      "bg": "#FFE4D6",
      "fg": "#A3410F"
    },
    "dark": {
      "bg": "#3D2418",
      "fg": "#FFB48A"
    }
  },
  "violet": {
    "light": {
      "bg": "#E8E6FB",
      "fg": "#4B43C4"
    },
    "dark": {
      "bg": "#26244A",
      "fg": "#A9A4FF"
    }
  }
} as const;

export const fontFamily = { regular: 'Inter-Regular', medium: 'Inter-Medium', semibold: 'Inter-SemiBold', bold: 'Inter-Bold', extrabold: 'Inter-ExtraBold' } as const;

export const typography = {
  "display": {
    "size": 40,
    "weight": 800,
    "lineHeight": 1.1,
    "letterSpacing": -1.4
  },
  "amountLg": {
    "size": 30,
    "weight": 800,
    "lineHeight": 1.1,
    "letterSpacing": -1.0
  },
  "title": {
    "size": 28,
    "weight": 800,
    "lineHeight": 1.15,
    "letterSpacing": -0.8
  },
  "amount": {
    "size": 24,
    "weight": 800,
    "lineHeight": 1.2,
    "letterSpacing": -0.6
  },
  "headline": {
    "size": 17,
    "weight": 700,
    "lineHeight": 1.3,
    "letterSpacing": -0.2
  },
  "bodyStrong": {
    "size": 15,
    "weight": 700,
    "lineHeight": 1.35,
    "letterSpacing": 0
  },
  "body": {
    "size": 15,
    "weight": 600,
    "lineHeight": 1.35,
    "letterSpacing": 0
  },
  "label": {
    "size": 13,
    "weight": 600,
    "lineHeight": 1.35,
    "letterSpacing": 0
  },
  "caption": {
    "size": 12,
    "weight": 500,
    "lineHeight": 1.35,
    "letterSpacing": 0
  },
  "micro": {
    "size": 11,
    "weight": 600,
    "lineHeight": 1.3,
    "letterSpacing": 0
  },
  "overline": {
    "size": 12,
    "weight": 700,
    "lineHeight": 1.3,
    "letterSpacing": 0.5,
    "transform": "uppercase"
  }
} as const;

export const space = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32
} as const;

export const radius = {
  "xs": 8,
  "sm": 12,
  "md": 14,
  "lg": 16,
  "xl": 18,
  "2xl": 22,
  "3xl": 24,
  "4xl": 28,
  "pill": 999
} as const;

export const layout = {
  "frame": {
    "width": 390,
    "height": 844
  },
  "screenPaddingX": 20,
  "safeAreaTop": 56,
  "bottomNavHeight": 88,
  "bottomBarPadding": "14px 20px 30px",
  "touchTargetMin": 44
} as const;

export const theme = { light, dark, chart, category, avatar, fontFamily, typography, space, radius, layout };

export default theme;
