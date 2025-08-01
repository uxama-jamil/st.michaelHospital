import type { ThemeConfig } from 'antd';
import variables from '@assets/scss/utils/_variables.module.scss';
export const config: ThemeConfig = {
  token: {
    colorPrimary: variables.primaryColor,
    colorInfo: variables.primaryColor,
    colorError: variables.baseDanger,
    colorLink: variables.primaryColor,
    colorTextBase: variables.baseText,
    colorBgBase: variables.baseBg,
    fontFamily: variables.baseFontFamily,
    boxShadow: 'none',
    boxShadowSecondary: 'none',
  },
  components: {
    Button: {
      defaultActiveBorderColor: variables.primaryColor,
      defaultActiveColor: variables.primaryColor,
      defaultBg: variables.buttonBackground,
      defaultBorderColor: variables.primaryColor,
      defaultColor: variables.baseWhite,
      defaultHoverBg: variables.buttonBackground,
      defaultHoverBorderColor: variables.primaryColor,
      defaultHoverColor: variables.baseWhite,
      colorPrimary: variables.baseWhite,
      colorBgBase: variables.buttonBackground,
      colorLinkHover: variables.baseWhite,
      colorLinkActive: variables.baseWhite,
      colorLink: variables.baseWhite,
      colorPrimaryActive: variables.buttonBackground,
      colorPrimaryBg: variables.buttonBackground,
      colorPrimaryBorder: variables.primaryColor,
      colorPrimaryText: variables.baseWhite,
      colorText: variables.baseWhite,
      defaultActiveBg: variables.buttonBackground,
      colorBgContainer: variables.buttonBackground,
      colorBgSolid: variables.buttonBackground,
      colorBgSolidActive: variables.buttonBackground,
      colorBgTextActive: variables.primaryColor,
      colorPrimaryBgHover: variables.primaryColor,
      colorPrimaryHover: variables.buttonBackground,
      colorPrimaryTextActive: variables.baseWhite,
      colorPrimaryTextHover: variables.baseWhite,
      defaultShadow: 'none',
      paddingBlock: 11,
      paddingInline: 16,
      borderRadius: 100,
      controlHeightLG: 52,
      controlHeight: 40,
      borderRadiusLG: 100,
      borderRadiusSM: 100,
      controlHeightSM: 35,
      paddingInlineSM: 24,
      contentFontSizeSM: 13,
      colorTextDisabled: variables.baseWhite,
    },
    Input: {
      activeBg: variables.inputBackGround,
      activeBorderColor: variables.primaryColor,
      hoverBg: variables.inputBackGround,
      hoverBorderColor: variables.primaryColor,
      colorBorder: variables.borderColor,
      colorErrorText: variables.baseDanger,
      paddingBlock: 10,
      paddingInline: 14,
      controlHeight: 52,
      fontWeightStrong: 600,
    },
    Select: {
      selectorBg: variables.inputBackGround,
      controlHeight: 44,
      hoverBorderColor: variables.primaryColor,
      colorBorder: variables.borderColor,
      colorErrorText: variables.baseDanger,
      lineWidth: 2,
      fontSizeIcon: 12,
      fontWeightStrong: 600,
      borderRadius: 6,
      paddingContentHorizontal: 12,
      paddingContentVertical: 14,
    },
    Layout: {
      headerBg: variables.baseWhite,
      headerPadding: '0 24px',
    },
    Menu: {
      itemColor: variables.baseWhite,
      itemHoverColor: variables.baseWhite,
      itemSelectedBg: variables.baseWhite,
      itemSelectedColor: variables.baseText,
      colorPrimaryBorder: variables.baseText,
      colorText: variables.baseWhite,
      itemActiveBg: variables.baseWhite,
      itemBg: variables.primaryColor,
      itemHoverBg: variables.primaryColor,
      popupBg: variables.primaryColor,
      fontFamily: variables.SecondaryFontFamily,
    },
    Divider: {
      colorSplit: variables.borderColor,
      verticalMarginInline: 16,
    },
    Table: {
      borderColor: variables.borderColor,
      footerColor: variables.baseText,
      headerColor: variables.baseText,
      colorIcon: variables.baseText,
      colorPrimary: variables.baseText,
      colorText: variables.baseText,
      colorTextHeading: variables.baseText,
      colorLink: variables.baseText,
      headerBg: '#F8F6FB',
      colorLinkActive: variables.baseText,
      colorLinkHover: variables.baseText,
      bodySortBg: variables.baseWhite,
      footerBg: variables.baseWhite,
      colorPrimaryBorder: variables.borderColor,
      borderRadius: 8,
      fontFamily: variables.SecondaryFontFamily,
    },
    Tag: {
      borderRadiusSM: 100,
      fontFamily: variables.baseFontFamily,
      paddingXXS: 12,
    },
    Card: {
      colorBgBase: variables.baseWhite,
      bodyPadding: 16,
      headerBg: variables.cardHeaderBg,
      headerFontSize: 13,
      headerPadding: 16,
      colorTextHeading: variables.primaryColor,
      fontFamily: variables.SecondaryFontFamily,
    },
    Upload: {
      fontFamily: variables.SecondaryFontFamily,
    },
    Pagination: {
      itemActiveBg: variables.primaryColor,
      itemActiveBgDisabled: "rgb(145,158,171)",
      itemActiveColorDisabled: variables.baseWhite,
      colorPrimaryBorder: variables.primaryColor,
      colorPrimary: variables.baseWhite,
    },
    Tooltip: {
      colorBgSpotlight: variables.baseWhite,
      colorText: variables.baseText,
      colorTextLightSolid: variables.baseText,
    }
  },
};
