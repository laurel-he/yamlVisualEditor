export const usersetting = {
  "base": {
    "version": 1.0
  },
  "params": {
    "chang_jing": {
      "enable": true,
      "description": "场景配置，如果这里指定了场景，将会强制使用该场景；",
      "filepath": "makeup.json"
    },
    "auto_shadow_highlight": {
      "description": "15.高光阴影 默认false",
      "enable": false
    },
    "raw_to_jpg": {
      "description": "白平衡计算那个控制开关，默认为true, 也就是不写的情况默认为true ,设置为false就不计算",
      "dynamicWBSetting": false,
      "isTheSceneASolidBackground": false,
      "rtExposureCompensationX": 180
    },
    "auto_levels": {
      "description": "20.log2自动色阶   eAutoLevelOperationType(DEFAULT_R_G_B_OPERATION,ALL_RGB_OPERATION) ;  eAutoLeveCutType(DEFAULT_BIN_CUT, SINGLE_CUT) ; auto_level_type 0 = （新）全图、一级（0.0005）、ALL  1 = （老流程）蒙版、二级（0.0005，0.01，0.01，0.0005）、RGB",
      "enable": false,
      "isTheSceneASolidBackground": false,
      "auto_level_type": 0,
      "0": {
        "fLowCutL": 0.001,
        "fLowCutR": 0.001,
        "fHigCutL": 0.001,
        "fHigCutR": 0.001,
        "eAutoLevelOperationType": "ALL_RGB_OPERATION"
      },
      "1": {
        "fLowCutL": 0.0005,
        "fLowCutR": 0.001,
        "fHigCutL": 0.001,
        "fHigCutR": 0.0005,
        "eAutoLevelOperationType": "DEFAULT_R_G_B_OPERATION"
      }
    },
    "exposure": {
      "description": "曝光矫正",
      "enable": false,
      "stdSkinLum": 180,
      "useFaceRectMask": true
    },
    "contrast": {
      "description": "矫正对比度",
      "enable": false,
      "dark": 35,
      "highlights": 220
    },
    "correction_LUT": {
      "description": "70.矫正LUT",
      "enable": false,
      "filepath": "lut.png",
      "black_levels": 0.0,
      "blend_over_strength": 0.2,
      "blend_screen_strength": 0.25
    },
    "skin_correction": {
      "description": "肤色矫正 80",
      "enable": false,
      "iR": 173,
      "iG": 136,
      "iB": 118,
      "iLum": 160,
      "useFaceRectMask": false
    },
    "skin_adjust16HSV": {
      "description": "肤色矫正 90",
      "enable": false,
      "iH": 20,
      "useFaceRectMask": true
    }
  }
}

export const makeup = {
  "base": {
    "version": 1.0
  },
  "params": {
    "list": [
      {
        "enable": true,
        "description": "皮肤改善工作流",
        "type": "SkinImprove",
        "skinSmooth": 60,
        "dynamicSkinSmooth": {
          "enable": true,
          "low": 40,
          "mid": 50,
          "high": 60
        },
        "xiuRong": 0,
        "removeAcneValue": 50,
        "skinTextureValue": 30,
        "adjustSkinColor": 15,
        "skinColor": {
          "description": "设置肤色，colorType－肤色类型　０：灰色　１：粉色　２：红色　３：白色（默认)",
          "colorType": 3,
          "value": 30
        },
        "skinAdjustTargetH": 10.0,
        "skinAdjustTargetV": 0.8,
        "enableSkinAdjustMask": true,
        "useFaceMask": {
          "enable": true,
          "blendOpacity": 100,
          "blendMode": 0,
          "contentMode": 1,
          "alignmentMode": 1,
          "gaussianBlur": 10.0,
          "rad_reverse": 1
        }
      }, {
        "enable": true,
        "description": "高反差保留",
        "type": "HighPass",
        "param_a": 0.0033,
        "param_b": 1.259,
        "useFaceMask": {
          "enable": true,
          "blendOpacity": 30,
          "blendMode": 10,
          "contentMode": 1,
          "alignmentMode": 1,
          "gaussianBlur": 1.0,
          "rad_reverse": 0
        }
      },
      {
        "enable": true,
        "description": "美妆",
        "type": "Makeup",
        "baiYa": 50.0,
        "liangYan": 12.0,
        "ageRange": {
          "enable": false,
          "min": 16,
          "max": 80
        },
        "men": {
          "faLingWen": 0.0,
          "yuWeiWen": 0.0,
          "heiYanQuan": 0.0,
          "shouBi": 9.0,
          "daYan": 12.0,
          "daYanRight": 8.0,
          "conditionalJudgment": {
            "shouLian": 24.0,
            "xiaoLian": 3.0,
            "VLian": 12.0
          },
          "conditionalJudgmentRight": {
            "shouLian": 24.0,
            "xiaoLian": 3.0,
            "VLian": 12.0
          },
          "isEnableMask": false,
          "isEnforceMake": true
        },
        "women": {
          "faLingWen": 0.0,
          "yuWeiWen": 0.0,
          "heiYanQuan": 0.0,
          "shouBi": 12.0,
          "daYan": 16.0,
          "daYanRight": 16.0,
          "conditionalJudgment": {
            "shouLian": 40.0,
            "xiaoLian": 7.0,
            "VLian": 24.0
          },
          "conditionalJudgmentRight": {
            "shouLian": 40.0,
            "xiaoLian": 7.0,
            "VLian": 24.0
          },
          "isEnableMask": false,
          "isEnforceMake": true
        }
      }
    ]
  }
}
