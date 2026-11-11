/**
 * StoryFrame Studio - Instagram Story Frame Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Canvas & Context ---
  const canvas = document.getElementById('mainCanvas');
  const ctx = canvas.getContext('2d');
  const canvasWrapper = document.getElementById('canvasWrapper');
  const dropPrompt = document.getElementById('dropZonePrompt');

  // --- State ---
  const state = {
    image: null,
    imgX: 0,
    imgY: 0,
    imgScale: 1.0,
    imgRotation: 0,
    
    // Preset & Frames
    activeTab: 'presets',
    preset: 'fs_2_3',
    customOverlay: null,

    // Filters & Color Adjustments
    filterPreset: 'normal',
    exposure: 0,
    contrast: 0,
    saturation: 0,
    photoBlur: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    warmth: 0,
    grain: 0,
    grainSize: 2,
    vignette: 0,
    isRisograph: false,
    xmpProfile: null,
    cubeLUT: null,
    profileId: 0,
    
    // Frame Customizations
    margin: 80,
    borderWidth: 0,
    borderRadius: 32,
    frameColor: '#ffffff',
    hasShadow: true,
    
    // Background
    blurBg: true,
    blurAmount: 28,
    bgColor: '#121214',
    
    // Text
    text: {
      enabled: true,
      content: "TODAY'S MOMENT",
      font: "'Caveat', cursive",
      size: 42,
      weight: 600,        // 文字の太さ (300, 400, 600, 700, 900)
      color: '#2b2b2b',   // デフォルト黒/濃炭色
      position: 'bottom', // 'top', 'center', 'bottom', 'footer'
      x: null,            // 自由配置用のX座標 (nullなら自動中央)
      y: null,            // 自由配置用のY座標 (nullなら自動位置)
      customPos: false,   // 手動移動フラグ
      bgEnabled: false,   // 文字の背景に色ベタの四角を敷く（デフォルトOff）
      bgColor: '#111111', // 背景ベタ色
      padX: 8,            // 左右のアキ (デフォルトはギリギリ: 8px)
      padY: 4,            // 上下のアキ (デフォルトはギリギリ: 4px)
      bgRadius: 0         // 四角の角丸 (デフォルト0px: 完全な四角)
    },

    // Date Picker State
    selectedDate: new Date(),
    dateFormat: 'eng',    // 'eng', 'dot', 'slash', 'film', 'jp'

    // FS_2&3 Frame Graphic Settings (ベクター描画・3層タイポグラフィ)
    fsTextPrefix: 'FDS/',
    fsTextTitle: 'FORM AND SPACE DESIGN',
    fsTextGrade: '2nd & 3rd grade',
    fsTitleWeight: 800,   // メインタイトルのウェイト (500, 700, 800, 900)
    fsFontSize: 30,       // サンプルの正確なフォントサイズ (30px)
    fsLetterSpacing: 0,   // 文字間トラッキング (0px)
    fsTitleColor: '#090405',
    fsGradeColor: '#ffffff',
    fsBorderSides: 'all', // 'all' (4辺すべて) | 'top-bottom' (上下) | 'top' (上辺)

    // Drag State
    isDragging: false,
    dragTarget: null,     // 'image' | 'text'
    dragStartX: 0,
    dragStartY: 0,
    imgStartX: 0,
    imgStartY: 0,
    textStartX: 0,
    textStartY: 0,
    isHoveringText: false
  };

  // --- UI Elements ---
  const scaleSlider = document.getElementById('scaleSlider');
  const scaleVal = document.getElementById('scaleVal');
  const rotateSlider = document.getElementById('rotateSlider');
  const rotateVal = document.getElementById('rotateVal');
  const blurBgCheck = document.getElementById('blurBgCheck');
  const blurSlider = document.getElementById('blurSlider');
  const blurVal = document.getElementById('blurVal');
  const blurAmountGroup = document.getElementById('blurAmountGroup');
  const bgColorPicker = document.getElementById('bgColorPicker');

  const frameMarginSlider = document.getElementById('frameMarginSlider');
  const marginVal = document.getElementById('marginVal');
  const borderWidthSlider = document.getElementById('borderWidthSlider');
  const borderWidthVal = document.getElementById('borderWidthVal');
  const borderRadiusSlider = document.getElementById('borderRadiusSlider');
  const radiusVal = document.getElementById('radiusVal');
  const frameColorPicker = document.getElementById('frameColorPicker');
  const shadowCheck = document.getElementById('shadowCheck');

  const enableTextCheck = document.getElementById('enableTextCheck');
  const textControlsSection = document.getElementById('textControlsSection');
  const textInput = document.getElementById('textInput');
  const fontSelect = document.getElementById('fontSelect');
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  const fontSizeVal = document.getElementById('fontSizeVal');
  const fontWeightVal = document.getElementById('fontWeightVal');
  const textColorPicker = document.getElementById('textColorPicker');
  const textBgCheck = document.getElementById('textBgCheck');
  const textBgControlsGroup = document.getElementById('textBgControlsGroup');
  const textBgColorPicker = document.getElementById('textBgColorPicker');
  const textPadXSlider = document.getElementById('textPadXSlider');
  const textPadXVal = document.getElementById('textPadXVal');
  const textPadYSlider = document.getElementById('textPadYSlider');
  const textPadYVal = document.getElementById('textPadYVal');
  const textBgRadiusSlider = document.getElementById('textBgRadiusSlider');
  const textBgRadiusVal = document.getElementById('textBgRadiusVal');
  const todayDateBtn = document.getElementById('todayDateBtn');
  const calendarBtn = document.getElementById('calendarBtn');
  const datePickerInput = document.getElementById('datePickerInput');
  const resetTextPosBtn = document.getElementById('resetTextPosBtn');

  // FS_2&3 Graphic Controls
  const fs23ControlsSection = document.getElementById('fs23ControlsSection');
  const fsPrefixInput = document.getElementById('fsPrefixInput');
  const fsTitleInput = document.getElementById('fsTitleInput');
  const fsGradeInput = document.getElementById('fsGradeInput');
  const fsTitleWeightVal = document.getElementById('fsTitleWeightVal');
  const fsTitleWeightBadge = document.getElementById('fsTitleWeightBadge');
  const fsFontSizeSlider = document.getElementById('fsFontSizeSlider');
  const fsFontSizeVal = document.getElementById('fsFontSizeVal');
  const fsSpacingSlider = document.getElementById('fsSpacingSlider');
  const fsSpacingVal = document.getElementById('fsSpacingVal');
  const fsTitleColorPicker = document.getElementById('fsTitleColorPicker');
  const fsGradeColorPicker = document.getElementById('fsGradeColorPicker');
  const fsTodayDateBtn = document.getElementById('fsTodayDateBtn');
  const fsCalendarBtn = document.getElementById('fsCalendarBtn');
  const fsDatePickerInput = document.getElementById('fsDatePickerInput');
  const resetFs23TextBtn = document.getElementById('resetFs23TextBtn');

  const imageUpload = document.getElementById('imageUpload');
  const changeImageBtn = document.getElementById('changeImageBtn');
  const headerPhotoUpload = document.getElementById('headerPhotoUpload');
  const floatingPhotoUpload = document.getElementById('floatingPhotoUpload');
  const fitImageBtn = document.getElementById('fitImageBtn');
  const fillImageBtn = document.getElementById('fillImageBtn');
  const overlayUpload = document.getElementById('overlayUpload');
  const removeOverlayBtn = document.getElementById('removeOverlayBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Filter & Adjustments UI Elements
  const exposureSlider = document.getElementById('exposureSlider');
  const exposureVal = document.getElementById('exposureVal');
  const contrastSlider = document.getElementById('contrastSlider');
  const contrastVal = document.getElementById('contrastVal');
  const saturationSlider = document.getElementById('saturationSlider');
  const saturationVal = document.getElementById('saturationVal');
  const photoBlurSlider = document.getElementById('photoBlurSlider');
  const photoBlurVal = document.getElementById('photoBlurVal');
  const highlightsSlider = document.getElementById('highlightsSlider');
  const highlightsVal = document.getElementById('highlightsVal');
  const shadowsSlider = document.getElementById('shadowsSlider');
  const shadowsVal = document.getElementById('shadowsVal');
  const whitesSlider = document.getElementById('whitesSlider');
  const whitesVal = document.getElementById('whitesVal');
  const blacksSlider = document.getElementById('blacksSlider');
  const blacksVal = document.getElementById('blacksVal');
  const warmthSlider = document.getElementById('warmthSlider');
  const warmthVal = document.getElementById('warmthVal');
  const grainSlider = document.getElementById('grainSlider');
  const grainVal = document.getElementById('grainVal');
  const grainSizeSlider = document.getElementById('grainSizeSlider');
  const grainSizeVal = document.getElementById('grainSizeVal');
  const vignetteSlider = document.getElementById('vignetteSlider');
  const vignetteVal = document.getElementById('vignetteVal');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const lutUpload = document.getElementById('lutUpload');
  const lutStatus = document.getElementById('lutStatus');

  // --- Built-in Preset Frame Assets ---
  const fs23FrameImg = new Image();
  fs23FrameImg.src = 'assets/frame-fs23.png';
  fs23FrameImg.onload = () => {
    if (state.preset === 'fs_2_3') render();
  };

  // --- Filter Preset Definitions ---
  const BUILTIN_XMP_DATA = {
    kodak_gold: {
      name: 'Kodak Gold 100',
      xml: `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000 1.000000, 0000/00/00-00:00:00        ">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
   crs:PresetType="Normal"
   crs:Version="18.7"
   crs:Contrast2012="0"
   crs:Highlights2012="-50"
   crs:Shadows2012="+30"
   crs:Whites2012="-45"
   crs:Blacks2012="+15"
   crs:Saturation="-5"
   crs:HueAdjustmentGreen="+10"
   crs:HueAdjustmentAqua="+10"
   crs:HueAdjustmentBlue="-5"
   crs:HueAdjustmentPurple="+20"
   crs:HueAdjustmentMagenta="+20"
   crs:SaturationAdjustmentRed="-30"
   crs:SaturationAdjustmentOrange="-8"
   crs:SaturationAdjustmentYellow="-15"
   crs:SaturationAdjustmentGreen="-50"
   crs:SaturationAdjustmentAqua="-50"
   crs:SaturationAdjustmentBlue="-30"
   crs:SaturationAdjustmentPurple="-50"
   crs:SaturationAdjustmentMagenta="-40"
   crs:LuminanceAdjustmentRed="+5"
   crs:LuminanceAdjustmentOrange="-4"
   crs:LuminanceAdjustmentYellow="+10"
   crs:LuminanceAdjustmentGreen="-5"
   crs:LuminanceAdjustmentAqua="+10"
   crs:LuminanceAdjustmentBlue="-15"
   crs:LuminanceAdjustmentPurple="+20"
   crs:LuminanceAdjustmentMagenta="+20"
   crs:GrainAmount="15"
   crs:GrainSize="40"
   crs:GrainFrequency="45"
   crs:ShadowTint="-2"
   crs:RedHue="+18"
   crs:RedSaturation="+20"
   crs:GreenHue="+35"
   crs:GreenSaturation="0"
   crs:BlueHue="-5"
   crs:BlueSaturation="+25"
   crs:CameraProfile="Kodak Gold 100 - F">
   <crs:ToneCurvePV2012>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>76, 75</rdf:li>
     <rdf:li>186, 187</rdf:li>
     <rdf:li>255, 250</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012>
   <crs:ToneCurvePV2012Red>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>30, 11</rdf:li>
     <rdf:li>71, 51</rdf:li>
     <rdf:li>119, 122</rdf:li>
     <rdf:li>182, 196</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Red>
   <crs:ToneCurvePV2012Green>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>28, 9</rdf:li>
     <rdf:li>120, 124</rdf:li>
     <rdf:li>181, 198</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Green>
   <crs:ToneCurvePV2012Blue>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>24, 11</rdf:li>
     <rdf:li>83, 70</rdf:li>
     <rdf:li>119, 122</rdf:li>
     <rdf:li>183, 200</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Blue>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`
    },
    original_xmp: {
      name: 'Original XMP',
      xml: `<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 7.0-c000 1.000000, 0000/00/00-00:00:00        ">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:crs="http://ns.adobe.com/camera-raw-settings/1.0/"
   crs:PresetType="Normal"
   crs:Version="18.7"
   crs:Exposure2012="+0.70"
   crs:Contrast2012="-31"
   crs:Highlights2012="-55"
   crs:Shadows2012="+40"
   crs:Whites2012="-50"
   crs:Blacks2012="+25"
   crs:Saturation="-5"
   crs:HueAdjustmentGreen="+10"
   crs:HueAdjustmentAqua="+10"
   crs:HueAdjustmentBlue="-5"
   crs:HueAdjustmentPurple="+20"
   crs:HueAdjustmentMagenta="+20"
   crs:SaturationAdjustmentRed="-30"
   crs:SaturationAdjustmentOrange="-8"
   crs:SaturationAdjustmentYellow="-15"
   crs:SaturationAdjustmentGreen="-50"
   crs:SaturationAdjustmentAqua="-50"
   crs:SaturationAdjustmentBlue="-30"
   crs:SaturationAdjustmentPurple="-50"
   crs:SaturationAdjustmentMagenta="-40"
   crs:LuminanceAdjustmentRed="+5"
   crs:LuminanceAdjustmentOrange="-4"
   crs:LuminanceAdjustmentYellow="+10"
   crs:LuminanceAdjustmentGreen="-5"
   crs:LuminanceAdjustmentAqua="+10"
   crs:LuminanceAdjustmentBlue="-15"
   crs:LuminanceAdjustmentPurple="+20"
   crs:LuminanceAdjustmentMagenta="+20"
   crs:SplitToningShadowHue="186"
   crs:SplitToningShadowSaturation="26"
   crs:SplitToningHighlightHue="0"
   crs:SplitToningHighlightSaturation="0"
   crs:SplitToningBalance="0"
   crs:GrainAmount="5"
   crs:GrainSize="40"
   crs:GrainFrequency="45"
   crs:ShadowTint="-2"
   crs:RedHue="+18"
   crs:RedSaturation="+20"
   crs:GreenHue="+35"
   crs:GreenSaturation="0"
   crs:BlueHue="-5"
   crs:BlueSaturation="+25">
   <crs:ToneCurvePV2012>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>76, 75</rdf:li>
     <rdf:li>186, 187</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012>
   <crs:ToneCurvePV2012Red>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>30, 11</rdf:li>
     <rdf:li>71, 51</rdf:li>
     <rdf:li>119, 122</rdf:li>
     <rdf:li>182, 196</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Red>
   <crs:ToneCurvePV2012Green>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>28, 9</rdf:li>
     <rdf:li>120, 124</rdf:li>
     <rdf:li>181, 198</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Green>
   <crs:ToneCurvePV2012Blue>
    <rdf:Seq>
     <rdf:li>0, 0</rdf:li>
     <rdf:li>24, 11</rdf:li>
     <rdf:li>83, 70</rdf:li>
     <rdf:li>119, 122</rdf:li>
     <rdf:li>183, 200</rdf:li>
     <rdf:li>255, 255</rdf:li>
    </rdf:Seq>
   </crs:ToneCurvePV2012Blue>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`
    }
  };

  const FILTER_PRESETS = {
    normal: {
      exposure: 0,
      contrast: 0,
      saturation: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      warmth: 0,
      grain: 0,
      grainSize: 2,
      vignette: 0,
      isRisograph: false
    },
    cinematic: {
      exposure: -12,
      contrast: 26,
      saturation: -12,
      highlights: -22,
      shadows: -14,
      whites: -18,
      blacks: 24,          // 美しい黒浮き・マットフィルム
      warmth: -8,          // クール・ムーディ
      grain: 24,           // 自然なフィルムグレイン
      grainSize: 2,
      vignette: 36,
      isRisograph: false
    },
    tealorange: {
      exposure: -6,
      contrast: 30,
      saturation: 16,
      highlights: 12,
      shadows: -16,
      whites: 8,
      blacks: 14,
      warmth: 26,
      grain: 18,
      grainSize: 2,
      vignette: 28,
      isRisograph: false
    },
    risograph: {
      exposure: 4,
      contrast: 22,
      saturation: 15,
      highlights: 15,
      shadows: 15,
      whites: 10,
      blacks: 18,
      warmth: 6,
      grain: 45,           // リソグラフのインクざらつき
      grainSize: 3,        // 粗め
      vignette: 15,
      isRisograph: true     // 特殊リソグラフ2色刷り
    },
    fds: {
      exposure: 6,
      contrast: 16,
      saturation: 15,
      highlights: -15,
      shadows: 20,
      whites: -5,
      blacks: 18,
      warmth: 35,
      grain: 22,
      grainSize: 2,
      vignette: 20,
      isRisograph: false
    },
    fuji: {
      exposure: 4,
      contrast: 22,
      saturation: -10,
      highlights: 12,
      shadows: -10,
      whites: 10,
      blacks: 8,
      warmth: -28,
      grain: 16,
      grainSize: 2,
      vignette: 15,
      isRisograph: false
    },
    fade: {
      exposure: 14,
      contrast: -18,
      saturation: -16,
      highlights: -24,
      shadows: 44,
      whites: -15,
      blacks: 40,
      warmth: 15,
      grain: 28,
      grainSize: 2,
      vignette: 25,
      isRisograph: false
    },
    noir: {
      exposure: 8,
      contrast: 52,
      saturation: -100,
      highlights: 25,
      shadows: -25,
      whites: 22,
      blacks: 16,
      warmth: 0,
      grain: 32,
      grainSize: 2,
      vignette: 42,
      isRisograph: false
    },
    instant: {
      exposure: 22,
      contrast: -12,
      saturation: -8,
      highlights: 30,
      shadows: 35,
      whites: 12,
      blacks: 26,
      warmth: 12,
      grain: 20,
      grainSize: 2,
      vignette: 28,
      isRisograph: false
    }
  };

  // --- Cross-Browser Canvas Filter Support & iOS Safari Gaussian Blur Engine ---
  const supportsCanvasFilter = (() => {
    try {
      const tc = document.createElement('canvas');
      tc.width = 1;
      tc.height = 1;
      const tctx = tc.getContext('2d');
      tctx.filter = 'brightness(0%)';
      tctx.fillStyle = '#ffffff';
      tctx.fillRect(0, 0, 1, 1);
      const pixel = tctx.getImageData(0, 0, 1, 1).data;
      return pixel[0] === 0;
    } catch (e) {
      return false;
    }
  })();

  const bgBlurCache = { img: null, blurPx: -1, canvas: null };
  const photoBlurCache = { img: null, blurPx: -1, canvas: null };

  function boxBlurRGBA(src, dst, w, h, radius) {
    const r = Math.min(Math.floor(radius), Math.floor((Math.min(w, h) - 1) / 2));
    if (r < 1) {
      dst.set(src);
      return;
    }
    const iarr = 1 / (r + r + 1);
    const tmp = new Uint8ClampedArray(src.length);

    // Horizontal pass: src -> tmp
    for (let y = 0; y < h; y++) {
      let ti = y * w * 4;
      let li = ti;
      let ri = ti + r * 4;
      const fvR = src[ti], fvG = src[ti + 1], fvB = src[ti + 2], fvA = src[ti + 3];
      const lastInRow = ti + (w - 1) * 4;
      const lvR = src[lastInRow], lvG = src[lastInRow + 1], lvB = src[lastInRow + 2], lvA = src[lastInRow + 3];
      let valR = (r + 1) * fvR;
      let valG = (r + 1) * fvG;
      let valB = (r + 1) * fvB;
      let valA = (r + 1) * fvA;

      for (let j = 0; j < r; j++) {
        const idx = ti + j * 4;
        valR += src[idx];
        valG += src[idx + 1];
        valB += src[idx + 2];
        valA += src[idx + 3];
      }
      for (let j = 0; j <= r; j++) {
        valR += src[ri] - fvR;
        valG += src[ri + 1] - fvG;
        valB += src[ri + 2] - fvB;
        valA += src[ri + 3] - fvA;
        tmp[ti] = Math.round(valR * iarr);
        tmp[ti + 1] = Math.round(valG * iarr);
        tmp[ti + 2] = Math.round(valB * iarr);
        tmp[ti + 3] = Math.round(valA * iarr);
        ri += 4;
        ti += 4;
      }
      for (let j = r + 1; j < w - r; j++) {
        valR += src[ri] - src[li];
        valG += src[ri + 1] - src[li + 1];
        valB += src[ri + 2] - src[li + 2];
        valA += src[ri + 3] - src[li + 3];
        tmp[ti] = Math.round(valR * iarr);
        tmp[ti + 1] = Math.round(valG * iarr);
        tmp[ti + 2] = Math.round(valB * iarr);
        tmp[ti + 3] = Math.round(valA * iarr);
        li += 4;
        ri += 4;
        ti += 4;
      }
      for (let j = w - r; j < w; j++) {
        valR += lvR - src[li];
        valG += lvG - src[li + 1];
        valB += lvB - src[li + 2];
        valA += lvA - src[li + 3];
        tmp[ti] = Math.round(valR * iarr);
        tmp[ti + 1] = Math.round(valG * iarr);
        tmp[ti + 2] = Math.round(valB * iarr);
        tmp[ti + 3] = Math.round(valA * iarr);
        li += 4;
        ti += 4;
      }
    }

    // Vertical pass: tmp -> dst
    const step = w * 4;
    for (let x = 0; x < w; x++) {
      let ti = x * 4;
      let li = ti;
      let ri = ti + r * step;
      const fvR = tmp[ti], fvG = tmp[ti + 1], fvB = tmp[ti + 2], fvA = tmp[ti + 3];
      const lastInCol = ti + step * (h - 1);
      const lvR = tmp[lastInCol], lvG = tmp[lastInCol + 1], lvB = tmp[lastInCol + 2], lvA = tmp[lastInCol + 3];
      let valR = (r + 1) * fvR;
      let valG = (r + 1) * fvG;
      let valB = (r + 1) * fvB;
      let valA = (r + 1) * fvA;

      for (let j = 0; j < r; j++) {
        const idx = ti + j * step;
        valR += tmp[idx];
        valG += tmp[idx + 1];
        valB += tmp[idx + 2];
        valA += tmp[idx + 3];
      }
      for (let j = 0; j <= r; j++) {
        valR += tmp[ri] - fvR;
        valG += tmp[ri + 1] - fvG;
        valB += tmp[ri + 2] - fvB;
        valA += tmp[ri + 3] - fvA;
        dst[ti] = Math.round(valR * iarr);
        dst[ti + 1] = Math.round(valG * iarr);
        dst[ti + 2] = Math.round(valB * iarr);
        dst[ti + 3] = Math.round(valA * iarr);
        ri += step;
        ti += step;
      }
      for (let j = r + 1; j < h - r; j++) {
        valR += tmp[ri] - tmp[li];
        valG += tmp[ri + 1] - tmp[li + 1];
        valB += tmp[ri + 2] - tmp[li + 2];
        valA += tmp[ri + 3] - tmp[li + 3];
        dst[ti] = Math.round(valR * iarr);
        dst[ti + 1] = Math.round(valG * iarr);
        dst[ti + 2] = Math.round(valB * iarr);
        dst[ti + 3] = Math.round(valA * iarr);
        li += step;
        ri += step;
        ti += step;
      }
      for (let j = h - r; j < h; j++) {
        valR += lvR - tmp[li];
        valG += lvG - tmp[li + 1];
        valB += lvB - tmp[li + 2];
        valA += lvA - tmp[li + 3];
        dst[ti] = Math.round(valR * iarr);
        dst[ti + 1] = Math.round(valG * iarr);
        dst[ti + 2] = Math.round(valB * iarr);
        dst[ti + 3] = Math.round(valA * iarr);
        li += step;
        ti += step;
      }
    }
  }

  function getBlurredCanvas(img, blurPx, maxDim, cacheObj, extraKey = '') {
    if (!img || blurPx <= 0) return img;
    if (
      cacheObj &&
      cacheObj.img === img &&
      cacheObj.blurPx === blurPx &&
      cacheObj.extraKey === extraKey &&
      cacheObj.canvas
    ) {
      return cacheObj.canvas;
    }

    const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
    const w = Math.max(8, Math.round(img.width * scale));
    const h = Math.max(8, Math.round(img.height * scale));

    const off = (cacheObj && cacheObj.canvas) ? cacheObj.canvas : document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    octx.clearRect(0, 0, w, h);
    octx.drawImage(img, 0, 0, w, h);

    const imgData = octx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const buf = new Uint8ClampedArray(data.length);
    const scaledRadius = Math.max(1, Math.round(blurPx * 0.36));

    // 3-pass separable box blur approximates true Gaussian blur
    boxBlurRGBA(data, buf, w, h, scaledRadius);
    boxBlurRGBA(buf, data, w, h, scaledRadius);
    boxBlurRGBA(data, buf, w, h, scaledRadius);

    imgData.data.set(buf);
    octx.putImageData(imgData, 0, 0);

    if (cacheObj) {
      cacheObj.img = img;
      cacheObj.blurPx = blurPx;
      cacheObj.extraKey = extraKey;
      cacheObj.canvas = off;
    }
    return off;
  }

  // --- Lightroom / Instagram-Grade Filmic Tone & Color Grading Engine (Zero Highlight Clipping + Full XMP/LUT) ---
  const gradedPhotoCache = {
    img: null,
    w: 0,
    h: 0,
    baseData: null,
    outImageData: null,
    outCanvas: null,
    gradeKey: ''
  };

  // Monotone Cubic Hermite Spline (Fritsch-Carlson) for Lightroom ToneCurvePV2012
  function buildMonotoneCubicLUT(points) {
    if (!points || points.length === 0) return null;
    const lut = new Float32Array(256);
    const pts = points.slice().sort((a, b) => a[0] - b[0]);
    if (pts.length === 1) {
      const val = Math.max(0, Math.min(255, pts[0][1]));
      for (let i = 0; i < 256; i++) lut[i] = val;
      return lut;
    }
    const n = pts.length;
    const xs = pts.map(p => p[0]);
    const ys = pts.map(p => p[1]);

    const d = new Float32Array(n - 1);
    const dx = new Float32Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      dx[i] = Math.max(1e-4, xs[i + 1] - xs[i]);
      d[i] = (ys[i + 1] - ys[i]) / dx[i];
    }

    const m = new Float32Array(n);
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) {
      if (d[i - 1] * d[i] <= 0) {
        m[i] = 0;
      } else {
        m[i] = (d[i - 1] + d[i]) * 0.5;
      }
    }
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(d[i]) < 1e-5) {
        m[i] = 0;
        m[i + 1] = 0;
      } else {
        const a = m[i] / d[i];
        const b = m[i + 1] / d[i];
        const h = Math.hypot(a, b);
        if (h > 3) {
          const t = 3 / h;
          m[i] = t * a * d[i];
          m[i + 1] = t * b * d[i];
        }
      }
    }

    let seg = 0;
    for (let x = 0; x < 256; x++) {
      if (x <= xs[0]) {
        lut[x] = Math.max(0, Math.min(255, ys[0]));
        continue;
      }
      if (x >= xs[n - 1]) {
        lut[x] = Math.max(0, Math.min(255, ys[n - 1]));
        continue;
      }
      while (seg < n - 2 && x > xs[seg + 1]) seg++;
      const h = dx[seg];
      const t = (x - xs[seg]) / h;
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      const y = h00 * ys[seg] + h10 * h * m[seg] + h01 * ys[seg + 1] + h11 * h * m[seg + 1];
      lut[x] = Math.max(0, Math.min(255, y));
    }
    return lut;
  }

  // 8-Band HSL (Red, Orange, Yellow, Green, Aqua, Blue, Purple, Magenta) Lookup Tables (0..359 deg)
  const HSL_BAND_CENTERS = [0, 30, 60, 120, 180, 240, 275, 315, 360];
  const HSL_BAND_NAMES = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta', 'Red'];

  function buildHSLTables(hsl) {
    if (!hsl) return null;
    const hueShift = new Float32Array(360);
    const satScale = new Float32Array(360);
    const lumShift = new Float32Array(360);

    let seg = 0;
    for (let deg = 0; deg < 360; deg++) {
      while (seg < 7 && deg >= HSL_BAND_CENTERS[seg + 1]) seg++;
      const c0 = HSL_BAND_CENTERS[seg];
      const c1 = HSL_BAND_CENTERS[seg + 1];
      const n0 = HSL_BAND_NAMES[seg];
      const n1 = HSL_BAND_NAMES[seg + 1];
      const t = (deg - c0) / (c1 - c0);
      const w1 = 0.5 - 0.5 * Math.cos(Math.PI * t);
      const w0 = 1 - w1;

      const hVal = (hsl.hue[n0] || 0) * w0 + (hsl.hue[n1] || 0) * w1;
      hueShift[deg] = hVal * 0.36;

      const sVal = (hsl.sat[n0] || 0) * w0 + (hsl.sat[n1] || 0) * w1;
      satScale[deg] = Math.max(0, 1 + sVal / 100);

      const lVal = (hsl.lum[n0] || 0) * w0 + (hsl.lum[n1] || 0) * w1;
      lumShift[deg] = lVal / 100;
    }
    return { hueShift, satScale, lumShift };
  }

  // Convert Hue (0..360) and Sat (0..100) to Luma-Neutral RGB Tint Vector
  function hueSatToChromaRGB(hueDeg, satPct) {
    if (!satPct || satPct <= 0) return [0, 0, 0];
    const h = ((hueDeg % 360) + 360) % 360;
    const x = 1 - Math.abs(((h / 60) % 2) - 1);
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = 1; g = x; b = 0; }
    else if (h < 120) { r = x; g = 1; b = 0; }
    else if (h < 180) { r = 0; g = 1; b = x; }
    else if (h < 240) { r = 0; g = x; b = 1; }
    else if (h < 300) { r = x; g = 0; b = 1; }
    else { r = 1; g = 0; b = x; }

    // Subtract Rec.709 luma so tint is pure chromaticity without unintended brightness jump
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const strength = (satPct / 100) * 62;
    return [
      (r - y) * strength,
      (g - y) * strength,
      (b - y) * strength
    ];
  }

  // 3-Way Color Grading Wheels (Shadows / Midtones / Highlights / Global) + Split Toning Balance/Blending
  function buildColorGradingTables(cg) {
    if (!cg) return null;
    const cgR = new Int16Array(256);
    const cgG = new Int16Array(256);
    const cgB = new Int16Array(256);
    const cgLum = new Float32Array(256);

    const [sR, sG, sB] = hueSatToChromaRGB(cg.shadowHue || 0, cg.shadowSat || 0);
    const [mR, mG, mB] = hueSatToChromaRGB(cg.midtoneHue || 0, cg.midtoneSat || 0);
    const [hR, hG, hB] = hueSatToChromaRGB(cg.highlightHue || 0, cg.highlightSat || 0);
    const [gR, gG, gB] = hueSatToChromaRGB(cg.globalHue || 0, cg.globalSat || 0);

    const sLum = (cg.shadowLum || 0) / 100;
    const mLum = (cg.midtoneLum || 0) / 100;
    const hLum = (cg.highlightLum || 0) / 100;
    const gLum = (cg.globalLum || 0) / 100;

    const balance = Math.max(-100, Math.min(100, cg.balance || 0)) / 100; // -1..1
    const blending = Math.max(0, Math.min(100, cg.blending !== undefined ? cg.blending : 50)) / 100; // 0..1
    const pivot = Math.max(0.18, Math.min(0.82, 0.5 - balance * 0.28));
    const expPower = 1.75 - blending * 0.75;

    for (let i = 0; i < 256; i++) {
      const l = i / 255;
      // Smooth shadow/midtone/highlight weights across luminance
      const wShadow = l < pivot
        ? Math.pow(1 - (l / pivot) * 0.5, expPower)
        : Math.pow(Math.max(0, (1 - l) / (1 - pivot)) * 0.5, expPower);
      const wHighlight = l >= pivot
        ? Math.pow(0.5 + ((l - pivot) / (1 - pivot)) * 0.5, expPower)
        : Math.pow((l / pivot) * 0.5, expPower);
      const wMid = 4 * l * (1 - l);
      // Taper slightly at pure 0 and pure 255 so black/white endpoints don't clip
      const endpointGuard = Math.sin(Math.PI * l);
      const wGlobal = 0.35 + 0.65 * endpointGuard;

      cgR[i] = Math.round(sR * wShadow + mR * wMid + hR * wHighlight + gR * wGlobal);
      cgG[i] = Math.round(sG * wShadow + mG * wMid + hG * wHighlight + gG * wGlobal);
      cgB[i] = Math.round(sB * wShadow + mB * wMid + hB * wHighlight + gB * wGlobal);

      cgLum[i] = (sLum * wShadow + mLum * wMid + hLum * wHighlight + gLum * wGlobal) * 0.22 * endpointGuard;
    }

    return { cgR, cgG, cgB, cgLum };
  }

  // Camera Calibration 3x3 RGB Primary Shift Matrix
  function buildCalibrationMatrix(cal) {
    if (!cal) return null;
    const rH = (cal.redHue || 0) / 100;
    const gH = (cal.greenHue || 0) / 100;
    const bH = (cal.blueHue || 0) / 100;
    const rS = (cal.redSat || 0) / 100;
    const gS = (cal.greenSat || 0) / 100;
    const bS = (cal.blueSat || 0) / 100;

    // Row-normalized 3x3 matrix so neutral grays (R=G=B) remain 100% neutral!
    // Red Hue > 0 shifts Red toward Orange/Green (+G); < 0 shifts toward Magenta (+B)
    let r_r = 1 + rS * 0.28;
    let r_g = rH * 0.18 - rS * 0.14;
    let r_b = -rH * 0.18 - rS * 0.14;
    const rSum = r_r + r_g + r_b;
    r_r /= rSum; r_g /= rSum; r_b /= rSum;

    // Green Hue > 0 shifts Green toward Cyan (+B); < 0 shifts toward Yellow (+R)
    let g_r = -gH * 0.18 - gS * 0.14;
    let g_g = 1 + gS * 0.28;
    let g_b = gH * 0.18 - gS * 0.14;
    const gSum = g_r + g_g + g_b;
    g_r /= gSum; g_g /= gSum; g_b /= gSum;

    // Blue Hue > 0 shifts Blue toward Purple/Magenta (+R); < 0 shifts toward Aqua/Cyan (+G)
    let b_r = bH * 0.18 - bS * 0.14;
    let b_g = -bH * 0.18 - bS * 0.14;
    let b_b = 1 + bS * 0.28;
    const bSum = b_r + b_g + b_b;
    b_r /= bSum; b_g /= bSum; b_b /= bSum;

    return {
      m: [
        Math.round(r_r * 1024), Math.round(r_g * 1024), Math.round(r_b * 1024),
        Math.round(g_r * 1024), Math.round(g_g * 1024), Math.round(g_b * 1024),
        Math.round(b_r * 1024), Math.round(b_g * 1024), Math.round(b_b * 1024)
      ],
      shadowTint: (cal.shadowTint || 0) / 100
    };
  }

  function gradePixelsFilmic(src, dst) {
    const ev = (state.exposure || 0) / 100;     // -1..1
    const cont = (state.contrast || 0) / 100;   // -1..1
    const hl = (state.highlights || 0) / 100;   // -1..1
    const sh = (state.shadows || 0) / 100;      // -1..1
    const wh = (state.whites || 0) / 100;       // -1..1
    const bl = (state.blacks || 0) / 100;       // -1..1
    const wm = (state.warmth || 0) / 100;       // -1..1
    const sat = (state.saturation || 0) / 100;  // -1..1

    const xmp = state.xmpProfile;
    const cube = state.cubeLUT;

    const tint = xmp ? (xmp.tint || 0) / 100 : 0;
    const vibrance = xmp ? (xmp.vibrance || 0) / 100 : 0;
    const clarity = xmp ? (xmp.clarity || 0) / 100 : 0;
    const dehaze = xmp ? (xmp.dehaze || 0) / 100 : 0;
    const isGrayscale = !!(xmp && xmp.isGrayscale);

    const hasCalibration = !!(xmp && xmp.calMatrix);
    const calM = hasCalibration ? xmp.calMatrix.m : null;
    const shadowTint = hasCalibration ? xmp.calMatrix.shadowTint : 0;

    const hasHSL = !!(xmp && xmp.hslTables);
    const hueShiftTable = hasHSL ? xmp.hslTables.hueShift : null;
    const satScaleTable = hasHSL ? xmp.hslTables.satScale : null;
    const lumShiftTable = hasHSL ? xmp.hslTables.lumShift : null;

    const hasCG = !!(xmp && xmp.cgTables);
    const cgR = hasCG ? xmp.cgTables.cgR : null;
    const cgG = hasCG ? xmp.cgTables.cgG : null;
    const cgB = hasCG ? xmp.cgTables.cgB : null;
    const cgLum = hasCG ? xmp.cgTables.cgLum : null;

    const paramCurve = xmp ? xmp.parametric : null;
    const masterCurve = xmp && xmp.curves ? xmp.curves.master : null;
    const redCurve = xmp && xmp.curves ? xmp.curves.red : null;
    const greenCurve = xmp && xmp.curves ? xmp.curves.green : null;
    const blueCurve = xmp && xmp.curves ? xmp.curves.blue : null;

    const lutR = new Uint8Array(256);
    const lutG = new Uint8Array(256);
    const lutB = new Uint8Array(256);
    const lumaGain = new Int32Array(256); // 1024 = 1.0x gain driven by pixel Luminance

    // Filmic Exposure & S-Curve parameters (high-precision, smooth highlight roll-off)
    const kExp = Math.pow(2, ev * 1.35);
    const gammaExp = Math.pow(2, -ev * 0.45);
    const effCont = Math.max(-1, Math.min(1, cont + clarity * 0.28 + dehaze * 0.25));
    const alphaCont = Math.pow(2, effCont * 0.72);
    const hasLumaGain = (sh !== 0 || hl < 0 || dehaze !== 0 || hasCG);

    for (let i = 0; i < 256; i++) {
      const lNorm = i / 255;

      // A. Luminance-Masked Shadows, Highlight Recovery, Dehaze & ColorGrade Lum
      let lTarget = lNorm;
      if (sh !== 0) {
        const inv = 1 - lNorm;
        const shMask = inv * inv * inv;
        if (sh > 0) {
          lTarget += sh * 0.34 * shMask * Math.pow(Math.max(0.02, lNorm), 0.35);
        } else {
          lTarget += sh * 0.30 * shMask * lNorm;
        }
      }
      if (hl < 0) {
        const hlMask = lNorm * lNorm * (0.65 + 0.35 * lNorm);
        lTarget += hl * 0.32 * hlMask;
      }
      if (dehaze !== 0) {
        lTarget -= dehaze * 0.18 * (1 - lNorm) * lNorm;
      }
      if (hasCG && cgLum) {
        lTarget += cgLum[i];
      }
      lTarget = Math.max(0, Math.min(1, lTarget));
      lumaGain[i] = i > 0 ? Math.round((lTarget / lNorm) * 1024) : 1024;

      // B. Per-Channel Filmic Tone Curve (0 -> 0, 1 -> 1, smooth highlight shoulder roll-off)
      let x = lNorm;

      // 1. Filmic Exposure (Rational shoulder + gamma: lifts midtones while protecting highlights from clipping)
      if (ev !== 0) {
        const rational = (x * kExp) / (1 + x * (kExp - 1));
        const gamma = Math.pow(x, gammaExp);
        x = rational * 0.78 + gamma * 0.22;
        if (ev > 0) {
          x -= ev * 0.06 * (x * x * (1 - x));
        }
      }

      // 2. Positive Highlights (with strict (1 - x) shoulder protection so whites never blow out)
      if (hl > 0) {
        x += hl * 0.34 * (x * x * (1 - x));
      }

      x = Math.max(0, Math.min(1, x));

      // 3. Filmic S-Curve Contrast (C1 smooth at 0.5, anchored at 0 and 1)
      if (effCont !== 0) {
        if (x < 0.5) {
          x = 0.5 * Math.pow(2 * x, alphaCont);
        } else {
          x = 1 - 0.5 * Math.pow(2 * (1 - x), alphaCont);
        }
      }

      // 4. Whites (Soft-knee upper tone curve)
      if (wh !== 0) {
        if (wh > 0) {
          const boost = 1 + wh * 0.85;
          const lifted = (x * boost) / (1 + x * (boost - 1));
          x = x + (lifted - x) * (x * x);
        } else {
          x += wh * 0.20 * (x * x * x);
        }
      }

      // 5. Blacks (Filmic matte black lift / black point toe)
      if (bl !== 0) {
        const inv = 1 - x;
        if (bl > 0) {
          x += bl * 0.20 * Math.pow(inv, 2.4);
        } else {
          x += bl * 0.28 * inv * inv * x;
        }
      }

      // 6. XMP Parametric Tone Curve (Shadows, Darks, Lights, Highlights)
      if (paramCurve) {
        const ps = (paramCurve.shadows || 0) / 100;
        const pd = (paramCurve.darks || 0) / 100;
        const pl = (paramCurve.lights || 0) / 100;
        const ph = (paramCurve.highlights || 0) / 100;
        const inv = 1 - x;
        x += ps * 0.22 * (inv * inv * inv) * x;
        x += pd * 0.25 * 4 * (inv * inv * x);
        x += pl * 0.25 * 4 * (x * x * inv);
        x += ph * 0.22 * (x * x * x) * inv;
      }

      x = Math.max(0, Math.min(1, x));

      // 7. Warmth (Temperature) & Tint (Green-Magenta) + ShadowTint
      const bell = 4 * x * (1 - x);
      const shBell = (1 - x) * (1 - x) * 4 * x;
      let rF = Math.max(0, Math.min(1, x + wm * 0.11 * bell + tint * 0.05 * bell + shadowTint * 0.08 * shBell));
      let gF = Math.max(0, Math.min(1, x + wm * 0.025 * bell - tint * 0.08 * bell - shadowTint * 0.08 * shBell));
      let bF = Math.max(0, Math.min(1, x - wm * 0.11 * bell + tint * 0.05 * bell));

      let r255 = rF * 255;
      let g255 = gF * 255;
      let b255 = bF * 255;

      // 8. XMP Point Tone Curves (Master ToneCurvePV2012 + Red / Green / Blue Channel Curves)
      if (masterCurve) {
        r255 = masterCurve[Math.min(255, Math.max(0, Math.round(r255)))];
        g255 = masterCurve[Math.min(255, Math.max(0, Math.round(g255)))];
        b255 = masterCurve[Math.min(255, Math.max(0, Math.round(b255)))];
      }
      if (redCurve) {
        r255 = redCurve[Math.min(255, Math.max(0, Math.round(r255)))];
      }
      if (greenCurve) {
        g255 = greenCurve[Math.min(255, Math.max(0, Math.round(g255)))];
      }
      if (blueCurve) {
        b255 = blueCurve[Math.min(255, Math.max(0, Math.round(b255)))];
      }

      lutR[i] = Math.min(255, Math.max(0, Math.round(r255)));
      lutG[i] = Math.min(255, Math.max(0, Math.round(g255)));
      lutB[i] = Math.min(255, Math.max(0, Math.round(b255)));
    }

    const len = src.length;
    const satInt = isGrayscale ? -256 : Math.round(sat * 256);
    const vibInt = isGrayscale ? 0 : Math.round(vibrance * 256);

    for (let i = 0; i < len; i += 4) {
      let r = src[i];
      let g = src[i + 1];
      let b = src[i + 2];

      // 1. Camera Calibration (3x3 Primary RGB Shift)
      if (hasCalibration) {
        const nr = (r * calM[0] + g * calM[1] + b * calM[2]) >> 10;
        const ng = (r * calM[3] + g * calM[4] + b * calM[5]) >> 10;
        const nb = (r * calM[6] + g * calM[7] + b * calM[8]) >> 10;
        r = nr < 0 ? 0 : (nr > 255 ? 255 : nr);
        g = ng < 0 ? 0 : (ng > 255 ? 255 : ng);
        b = nb < 0 ? 0 : (nb > 255 ? 255 : nb);
      }

      // 2. Luminance-Masked Shadows / Highlight Recovery
      if (hasLumaGain) {
        const lIn = (54 * r + 183 * g + 19 * b) >> 8;
        const gain = lumaGain[lIn];
        if (gain !== 1024) {
          r = (r * gain) >> 10;
          g = (g * gain) >> 10;
          b = (b * gain) >> 10;
          if (r > 255) r = 255;
          if (g > 255) g = 255;
          if (b > 255) b = 255;
        }
      }

      // 3. 8-Band HSL / Color Mixer (Hue, Saturation, Luminance per color band)
      if (hasHSL && !isGrayscale) {
        const maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
        const delta = maxC - minC;
        if (delta >= 3) {
          let h;
          if (maxC === r) {
            h = 60 * (((g - b) / delta) % 6);
          } else if (maxC === g) {
            h = 60 * ((b - r) / delta + 2);
          } else {
            h = 60 * ((r - g) / delta + 4);
          }
          if (h < 0) h += 360;
          const hIdx = h >= 360 ? 0 : (h | 0);

          const dH = hueShiftTable[hIdx];
          const sMult = satScaleTable[hIdx];
          const dL = lumShiftTable[hIdx];

          if (dH !== 0 || sMult !== 1 || dL !== 0) {
            let newH = (h + dH) % 360;
            if (newH < 0) newH += 360;

            let l = (maxC + minC) / 510;
            const denom = 1 - Math.abs(2 * l - 1);
            let s = denom > 1e-4 ? (delta / (255 * denom)) : 0;
            s = Math.max(0, Math.min(1, s * sMult));

            if (dL !== 0) {
              const satWeight = Math.min(1, delta / 42);
              if (dL > 0) {
                l += dL * satWeight * 0.42 * (1 - l);
              } else {
                l += dL * satWeight * 0.42 * l;
              }
              l = Math.max(0, Math.min(1, l));
            }

            const c = (1 - Math.abs(2 * l - 1)) * s;
            const x = c * (1 - Math.abs(((newH / 60) % 2) - 1));
            const m = l - c * 0.5;
            let r1, g1, b1;
            if (newH < 60) { r1 = c; g1 = x; b1 = 0; }
            else if (newH < 120) { r1 = x; g1 = c; b1 = 0; }
            else if (newH < 180) { r1 = 0; g1 = c; b1 = x; }
            else if (newH < 240) { r1 = 0; g1 = x; b1 = c; }
            else if (newH < 300) { r1 = x; g1 = 0; b1 = c; }
            else { r1 = c; g1 = 0; b1 = x; }

            r = Math.min(255, Math.max(0, Math.round((r1 + m) * 255)));
            g = Math.min(255, Math.max(0, Math.round((g1 + m) * 255)));
            b = Math.min(255, Math.max(0, Math.round((b1 + m) * 255)));
          }
        }
      }

      // 4. Filmic Tone + Warmth/Tint + Master & RGB Channel Tone Curves
      r = lutR[r];
      g = lutG[g];
      b = lutB[b];

      // 5. 3-Way Color Grading Wheels (Shadows / Midtones / Highlights / Global + Split Toning)
      if (hasCG) {
        const y = (54 * r + 183 * g + 19 * b) >> 8;
        r = Math.min(255, Math.max(0, r + cgR[y]));
        g = Math.min(255, Math.max(0, g + cgG[y]));
        b = Math.min(255, Math.max(0, b + cgB[y]));
      }

      // 6. Vibrance & Saturation (Rec.709 Luminance with Highlight Chroma Protection)
      if (satInt !== 0 || vibInt !== 0) {
        const y = (54 * r + 183 * g + 19 * b) >> 8;
        const maxC = r > g ? (r > b ? r : b) : (g > b ? g : b);
        const minC = r < g ? (r < b ? r : b) : (g < b ? g : b);
        const chroma = maxC - minC;

        // Vibrance boosts muted colors more than already-saturated colors
        const vibWeight = 256 - ((chroma * 190) >> 8);
        const vibDelta = (vibInt * vibWeight) >> 8;

        let totalSat = satInt + vibDelta;
        let sFactor = 256 + totalSat;
        if (totalSat > 0) {
          const satWeight = 256 - (chroma >> 1);
          const hlProt = y > 190 ? ((255 - y) * 4) : 256;
          const prot = (satWeight * (hlProt < 256 ? hlProt : 256)) >> 8;
          sFactor = 256 + ((totalSat * prot) >> 8);
        } else if (sFactor < 0) {
          sFactor = 0;
        }
        r = y + (((r - y) * sFactor) >> 8);
        g = y + (((g - y) * sFactor) >> 8);
        b = y + (((b - y) * sFactor) >> 8);
      }

      // 7. 3D LUT (.cube) Trilinear Lookup if active
      if (cube && cube.data && cube.size > 1) {
        const N = cube.size;
        const maxIdx = N - 1;
        const rf = (Math.min(255, Math.max(0, r)) / 255) * maxIdx;
        const gf = (Math.min(255, Math.max(0, g)) / 255) * maxIdx;
        const bf = (Math.min(255, Math.max(0, b)) / 255) * maxIdx;
        const r0 = Math.min(maxIdx, Math.floor(rf));
        const g0 = Math.min(maxIdx, Math.floor(gf));
        const b0 = Math.min(maxIdx, Math.floor(bf));
        const r1 = Math.min(maxIdx, r0 + 1);
        const g1 = Math.min(maxIdx, g0 + 1);
        const b1 = Math.min(maxIdx, b0 + 1);
        const dr = rf - r0;
        const dg = gf - g0;
        const db = bf - b0;

        // Standard .cube layout: R changes fastest, then G, then B: idx = ((b * N + g) * N + r) * 3
        const n2 = N * N;
        const c000 = ((b0 * n2) + (g0 * N) + r0) * 3;
        const c100 = ((b0 * n2) + (g0 * N) + r1) * 3;
        const c010 = ((b0 * n2) + (g1 * N) + r0) * 3;
        const c110 = ((b0 * n2) + (g1 * N) + r1) * 3;
        const c001 = ((b1 * n2) + (g0 * N) + r0) * 3;
        const c101 = ((b1 * n2) + (g0 * N) + r1) * 3;
        const c011 = ((b1 * n2) + (g1 * N) + r0) * 3;
        const c111 = ((b1 * n2) + (g1 * N) + r1) * 3;
        const d = cube.data;

        for (let ch = 0; ch < 3; ch++) {
          const v00 = d[c000 + ch] * (1 - dr) + d[c100 + ch] * dr;
          const v10 = d[c010 + ch] * (1 - dr) + d[c110 + ch] * dr;
          const v01 = d[c001 + ch] * (1 - dr) + d[c101 + ch] * dr;
          const v11 = d[c011 + ch] * (1 - dr) + d[c111 + ch] * dr;
          const v0 = v00 * (1 - dg) + v10 * dg;
          const v1 = v01 * (1 - dg) + v11 * dg;
          const v = (v0 * (1 - db) + v1 * db) * 255;
          if (ch === 0) r = v;
          else if (ch === 1) g = v;
          else b = v;
        }
      }

      dst[i] = r;
      dst[i + 1] = g;
      dst[i + 2] = b;
      dst[i + 3] = src[i + 3];
    }
  }

  function getGradedPhotoCanvas(img) {
    if (!img) return null;

    const isNeutralTone = (
      state.exposure === 0 &&
      state.contrast === 0 &&
      state.saturation === 0 &&
      state.highlights === 0 &&
      state.shadows === 0 &&
      state.whites === 0 &&
      state.blacks === 0 &&
      state.warmth === 0 &&
      !state.xmpProfile &&
      !state.cubeLUT
    );

    if (isNeutralTone) {
      gradedPhotoCache.gradeKey = 'neutral';
      return img;
    }

    const gradeKey = `${state.exposure}_${state.contrast}_${state.saturation}_${state.highlights}_${state.shadows}_${state.whites}_${state.blacks}_${state.warmth}_p${state.profileId || 0}`;

    // 1. Initialize or refresh base pixel buffer when source image changes
    if (gradedPhotoCache.img !== img || !gradedPhotoCache.baseData) {
      const maxDim = 1350;
      const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
      const w = Math.max(8, Math.round(img.width * scale));
      const h = Math.max(8, Math.round(img.height * scale));

      const outCanvas = gradedPhotoCache.outCanvas || document.createElement('canvas');
      outCanvas.width = w;
      outCanvas.height = h;
      const octx = outCanvas.getContext('2d');
      octx.clearRect(0, 0, w, h);
      octx.drawImage(img, 0, 0, w, h);

      const baseImgData = octx.getImageData(0, 0, w, h);
      gradedPhotoCache.img = img;
      gradedPhotoCache.w = w;
      gradedPhotoCache.h = h;
      gradedPhotoCache.baseData = new Uint8ClampedArray(baseImgData.data);
      gradedPhotoCache.outImageData = baseImgData;
      gradedPhotoCache.outCanvas = outCanvas;
      gradedPhotoCache.gradeKey = '';
    }

    // 2. Recompute Filmic Tone & Color Grading only when slider parameters or XMP/LUT change
    if (gradedPhotoCache.gradeKey !== gradeKey) {
      gradePixelsFilmic(gradedPhotoCache.baseData, gradedPhotoCache.outImageData.data);
      const octx = gradedPhotoCache.outCanvas.getContext('2d');
      octx.putImageData(gradedPhotoCache.outImageData, 0, 0);
      gradedPhotoCache.gradeKey = gradeKey;
    }

    return gradedPhotoCache.outCanvas;
  }

  // --- Organic Film Grain Generator (Silver Halide Simulation) ---
  const noisePatterns = {};
  function getNoisePattern(size = 2) {
    if (noisePatterns[size]) return noisePatterns[size];

    const W = 512;
    const H = 512;
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = W;
    baseCanvas.height = H;
    const bctx = baseCanvas.getContext('2d');

    // 1. 正規分布（中心極限定理）による自然な銀塩粒子ノイズ
    const imgData = bctx.createImageData(W, H);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      // 3つの乱数を平均してベルカーブ（正規分布）にする（砂嵐感を完全排除）
      const g = (Math.random() + Math.random() + Math.random() - 1.5) * 115;
      const v = Math.max(0, Math.min(255, 128 + g));
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    bctx.putImageData(imgData, 0, 0);

    // 2. 有機的な銀粒子クラスターの形成（サイズ・粗さ調整）
    const outCanvas = document.createElement('canvas');
    outCanvas.width = W;
    outCanvas.height = H;
    const octx = outCanvas.getContext('2d');

    if (size === 1) {
      // 微細な粒子 (Fine Grain)
      octx.drawImage(baseCanvas, 0, 0);
    } else {
      // 中〜粗（ISO 400〜1600相当の有機的クラスタ）
      // 滑らかなバイリニア補間拡大で四角いデジタルブロックを完全に無くす
      const scale = 1 / (1 + (size - 1) * 0.45);
      const sw = Math.round(W * scale);
      const sh = Math.round(H * scale);

      const sCanvas = document.createElement('canvas');
      sCanvas.width = sw;
      sCanvas.height = sh;
      const sctx = sCanvas.getContext('2d');
      sctx.drawImage(baseCanvas, 0, 0, sw, sh);

      octx.imageSmoothingEnabled = true;
      octx.imageSmoothingQuality = 'high';
      octx.drawImage(sCanvas, 0, 0, W, H);

      // 解像度感を損なわないよう極微細グレインを軽くブレンド
      octx.globalCompositeOperation = 'soft-light';
      octx.globalAlpha = 0.28;
      octx.drawImage(baseCanvas, 0, 0);
    }

    const pat = ctx.createPattern(outCanvas, 'repeat');
    noisePatterns[size] = pat;
    return pat;
  }

  // --- Preset Definitions ---
  const PRESET_CONFIGS = {
    polaroid: {
      margin: 90,
      borderWidth: 0,
      borderRadius: 16,
      frameColor: '#ffffff',
      hasShadow: true,
      textEnabled: true,
      font: "'Caveat', cursive",
      textColor: '#2b2b2b',
      textSize: 44,
      textWeight: 600,
      textPos: 'bottom'
    },
    fs_2_3: {
      margin: 43,
      borderWidth: 0,
      borderRadius: 14,
      frameColor: '#1bb9ee',
      hasShadow: false,
      textEnabled: false,
      font: "'Share Tech Mono', monospace",
      textColor: '#ffffff',
      textSize: 32,
      textWeight: 700,
      textPos: 'bottom'
    },
    minimal: {
      margin: 100,
      borderWidth: 3,
      borderRadius: 24,
      frameColor: '#ffffff',
      hasShadow: true,
      textEnabled: true,
      font: "'Inter', sans-serif",
      textColor: '#ffffff',
      textSize: 28,
      textWeight: 400,
      textPos: 'footer'
    },
    film: {
      margin: 70,
      borderWidth: 0,
      borderRadius: 8,
      frameColor: '#121212',
      hasShadow: true,
      textEnabled: true,
      font: "'Share Tech Mono', monospace",
      textColor: '#ff9800',
      textSize: 32,
      textWeight: 700,
      textPos: 'footer'
    },
    clean: {
      margin: 0,
      borderWidth: 0,
      borderRadius: 0,
      frameColor: '#ffffff',
      hasShadow: false,
      textEnabled: false,
      font: "'Inter', sans-serif",
      textColor: '#ffffff',
      textSize: 32,
      textWeight: 500,
      textPos: 'footer'
    }
  };

  // --- FS_2&3 Typography Templates & Weights ---
  const FS_TEMPLATES = {
    default: {
      prefix: 'FDS/',
      title: 'FORM AND SPACE DESIGN',
      grade: '2nd & 3rd grade',
      weight: 800,
      frameColor: '#1bb9ee',
      gradeColor: '#ffffff'
    },
    visual: {
      prefix: 'FDS/',
      title: 'VISUAL DESIGN',
      grade: '2nd & 3rd grade',
      weight: 800,
      frameColor: '#ee3a65', // 赤系（ピンク寄り）
      gradeColor: '#ffffff'
    },
    first_year: {
      prefix: 'FDS/',
      title: '1st Year Class',
      grade: '',
      weight: 800,
      frameColor: '#f8dc6c', // 黄色系（クリーム寄り）
      gradeColor: '#090405'
    },
    '1st': {
      prefix: 'FDS/',
      title: 'FORM AND SPACE DESIGN',
      grade: '1st grade',
      weight: 800,
      frameColor: '#1bb9ee',
      gradeColor: '#ffffff'
    },
    '4th': {
      prefix: 'FDS/',
      title: 'FORM AND SPACE DESIGN',
      grade: '4th grade',
      weight: 800,
      frameColor: '#1bb9ee',
      gradeColor: '#ffffff'
    },
    grad: {
      prefix: 'FDS/',
      title: 'GRADUATION EXHIBITION',
      grade: 'CLASS OF 2026',
      weight: 900,
      frameColor: '#111111',
      gradeColor: '#ffffff'
    },
    arch: {
      prefix: 'ARCH/',
      title: 'ARCHITECTURE & SPACE',
      grade: 'STUDIO WORKSHOP',
      weight: 800,
      frameColor: '#2b2d42',
      gradeColor: '#ffffff'
    }
  };

  // 専攻・クラス名に応じた専用フレームカラー・配色定義
  const FS_TITLE_STYLES = {
    'FORM AND SPACE DESIGN': {
      frameColor: '#1bb9ee', // シアンブルー (標準)
      gradeColor: '#ffffff'
    },
    'VISUAL DESIGN': {
      frameColor: '#ee3a65', // 赤系（ピンク寄り）
      gradeColor: '#ffffff'
    },
    '1st Year Class': {
      frameColor: '#f8dc6c', // 黄色系（クリーム寄り）
      gradeColor: '#090405'
    }
  };

  const FS_WEIGHT_LABELS = {
    '500': 'Medium (500)',
    '700': 'Bold (700)',
    '800': 'ExtraBold (800)',
    '900': 'Black (900)'
  };

  // --- Tabs Navigation ---
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      state.activeTab = btn.dataset.tab;
      const pane = document.getElementById(`pane-${btn.dataset.tab}`);
      if (pane) pane.classList.add('active');
      if (canvasWrapper) {
        canvasWrapper.style.cursor = isTextTabActive() ? 'default' : 'grab';
      }
      render();
    });
  });

  // --- Segmented Control for Text Position (位置プリセットのみ対象) ---
  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.text.position = btn.dataset.pos;
      state.text.customPos = false; // プリセットボタンを押した時のみスナップ
      state.text.x = null;
      state.text.y = null;
      render();
    });
  });

  if (resetTextPosBtn) {
    resetTextPosBtn.addEventListener('click', () => {
      state.text.customPos = false;
      state.text.x = null;
      state.text.y = null;
      state.text.position = state.preset === 'polaroid' ? 'bottom' : 'footer';
      document.querySelectorAll('.pos-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.pos === state.text.position);
      });
      render();
    });
  }

  const WEIGHT_LABELS = {
    '300': 'Light',
    '400': 'Regular',
    '600': 'Medium',
    '700': 'Bold',
    '900': 'Black'
  };

  // --- Segmented Control for Font Weight (太さ変更時は位置を100%保持) ---
  document.querySelectorAll('.weight-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const w = parseInt(btn.dataset.weight, 10);
      state.text.weight = w;
      if (fontWeightVal) fontWeightVal.textContent = WEIGHT_LABELS[btn.dataset.weight] || `${w}`;
      // ★位置 (customPos, x, y, position) は一切初期化せずそのまま保持！
      render();
    });
  });

  // --- Apply Preset ---
  function applyPreset(name) {
    const oldBox = state.image ? getPhotoRect() : null;
    state.preset = name;
    const cfg = PRESET_CONFIGS[name];
    if (!cfg) return;

    state.margin = cfg.margin;
    state.borderWidth = cfg.borderWidth;
    state.borderRadius = cfg.borderRadius;
    state.frameColor = cfg.frameColor;
    state.hasShadow = cfg.hasShadow;
    state.text.enabled = cfg.textEnabled;
    state.text.font = cfg.font;
    state.text.color = cfg.textColor;
    state.text.size = cfg.textSize;
    state.text.weight = cfg.textWeight || 600;
    state.text.position = cfg.textPos;

    // Sync UI controls
    const isFS23 = (name === 'fs_2_3');
    frameMarginSlider.value = state.margin;
    frameMarginSlider.disabled = isFS23;
    frameMarginSlider.style.opacity = isFS23 ? '0.35' : '1';
    marginVal.textContent = isFS23 ? '固定' : `${state.margin}px`;

    borderWidthSlider.value = state.borderWidth;
    borderWidthSlider.disabled = isFS23;
    borderWidthSlider.style.opacity = isFS23 ? '0.35' : '1';
    borderWidthVal.textContent = isFS23 ? '固定' : `${state.borderWidth}px`;

    const fs23FixedNote = document.getElementById('fs23FixedNote');
    if (fs23FixedNote) {
      fs23FixedNote.classList.toggle('hidden', !isFS23);
    }

    if (fs23ControlsSection) {
      fs23ControlsSection.classList.toggle('hidden', !isFS23);
      if (isFS23) {
        if (fsPrefixInput) fsPrefixInput.value = state.fsTextPrefix;
        if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;
        if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
        if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || `${state.fsTitleWeight}`;
        if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = `${FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || state.fsTitleWeight} (太字)`;
        if (fsFontSizeSlider) fsFontSizeSlider.value = state.fsFontSize || 30;
        if (fsFontSizeVal) fsFontSizeVal.textContent = (state.fsFontSize || 30) === 30 ? '30px (サンプル標準)' : `${state.fsFontSize}px`;
        if (fsSpacingSlider) fsSpacingSlider.value = state.fsLetterSpacing || 0;
        if (fsSpacingVal) fsSpacingVal.textContent = (state.fsLetterSpacing || 0) === 0 ? '0px (サンプル標準)' : `${state.fsLetterSpacing}px`;
        if (fsTitleColorPicker) fsTitleColorPicker.value = state.fsTitleColor;
        if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
        document.querySelectorAll('.fs-weight-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.fsWeight, 10) === state.fsTitleWeight);
        });
        document.querySelectorAll('.fs-sides-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.sides === state.fsBorderSides);
        });
        syncFsChips();
      }
    }

    borderRadiusSlider.value = state.borderRadius;
    radiusVal.textContent = `${state.borderRadius}px`;
    frameColorPicker.value = state.frameColor.length === 7 ? state.frameColor : '#ffffff';
    shadowCheck.checked = state.hasShadow;

    enableTextCheck.checked = state.text.enabled;
    textControlsSection.style.display = state.text.enabled ? 'block' : 'none';
    fontSelect.value = state.text.font;
    fontSizeSlider.value = state.text.size;
    fontSizeVal.textContent = `${state.text.size}px`;
    textColorPicker.value = state.text.color;

    if (textBgCheck) {
      textBgCheck.checked = state.text.bgEnabled;
      textBgControlsGroup.style.display = state.text.bgEnabled ? 'block' : 'none';
      textBgColorPicker.value = state.text.bgColor;
      textPadXSlider.value = state.text.padX;
      textPadXVal.textContent = state.text.padX <= 8 ? `${state.text.padX}px (ギリギリ)` : `${state.text.padX}px`;
      textPadYSlider.value = state.text.padY;
      textPadYVal.textContent = state.text.padY <= 4 ? `${state.text.padY}px (ギリギリ)` : `${state.text.padY}px`;
      textBgRadiusSlider.value = state.text.bgRadius;
      textBgRadiusVal.textContent = state.text.bgRadius === 0 ? '0px (完全な四角)' : `${state.text.bgRadius}px`;
    }

    if (fontWeightVal) {
      fontWeightVal.textContent = WEIGHT_LABELS[`${state.text.weight}`] || `${state.text.weight}`;
    }
    document.querySelectorAll('.weight-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.weight, 10) === state.text.weight);
    });

    document.querySelectorAll('.pos-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.pos === state.text.position);
    });

    document.querySelectorAll('.preset-card').forEach(c => {
      c.classList.toggle('active', c.dataset.preset === name);
    });

    if (state.image && oldBox) {
      const newBox = getPhotoRect();
      adjustImageForNewFrame(oldBox, newBox);
    }

    render();
  }

  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      applyPreset(card.dataset.preset);
    });
  });

  // --- Image Loading & Initialization ---
  function loadImageFromFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.image = img;
        dropPrompt.classList.add('has-image');
        resetImageTransform();
        render();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // フレーム（プリセット）やマージン変更時に写真の位置・構図をズレずに追従
  function adjustImageForNewFrame(oldBox, newBox) {
    if (!state.image || !oldBox || !newBox) return;

    const oldCenterX = oldBox.x + oldBox.width / 2;
    const oldCenterY = oldBox.y + oldBox.height / 2;
    const newCenterX = newBox.x + newBox.width / 2;
    const newCenterY = newBox.y + newBox.height / 2;

    const offsetX = state.imgX - oldCenterX;
    const offsetY = state.imgY - oldCenterY;

    // ユーザーが手動で位置を動かしたか？（6px以内なら中央揃えと判定）
    const isCentered = Math.hypot(offsetX, offsetY) < 6;

    if (isCentered) {
      state.imgX = newCenterX;
      state.imgY = newCenterY;
    } else {
      // ユーザーがドラッグして合わせた相対的なオフセットを枠サイズ変化に合わせて追従
      const scaleX = newBox.width / Math.max(1, oldBox.width);
      const scaleY = newBox.height / Math.max(1, oldBox.height);
      state.imgX = newCenterX + offsetX * scaleX;
      state.imgY = newCenterY + offsetY * scaleY;
    }

    // 新しい枠に対する fill 基準スケールを再計算（スライダーの % 倍率はそのまま維持！）
    const imgAspect = state.image.width / state.image.height;
    const newBoxAspect = newBox.width / newBox.height;
    state.imgScale = imgAspect > newBoxAspect
      ? (newBox.height / state.image.height)
      : (newBox.width / state.image.width);
  }

  function resetImageTransform(mode = 'fill') {
    if (!state.image) return;
    state.imgRotation = 0;
    rotateSlider.value = 0;
    rotateVal.textContent = '0°';

    // Calculate Photo Frame bounds
    const box = getPhotoRect();
    const imgAspect = state.image.width / state.image.height;
    const boxAspect = box.width / box.height;

    let baseScale;
    if (mode === 'fill') {
      baseScale = imgAspect > boxAspect ? (box.height / state.image.height) : (box.width / state.image.width);
    } else {
      // fit
      baseScale = imgAspect > boxAspect ? (box.width / state.image.width) : (box.height / state.image.height);
    }

    state.imgScale = baseScale;
    state.imgX = box.x + box.width / 2;
    state.imgY = box.y + box.height / 2;

    scaleSlider.value = 100;
    scaleVal.textContent = '100%';
  }

  // --- Initial Default Sample Image (9:16 Vertical Gradient Art) ---
  function createDefaultSampleImage() {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1080;
    sampleCanvas.height = 1920;
    const sctx = sampleCanvas.getContext('2d');

    // Chic gradient & abstract circles (9:16 vertical)
    const grad = sctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, '#ff9a9e');
    grad.addColorStop(0.5, '#fecfef');
    grad.addColorStop(1, '#a1c4fd');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 1080, 1920);

    // Warm Sun circle
    sctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    sctx.beginPath();
    sctx.arc(540, 860, 320, 0, Math.PI * 2);
    sctx.fill();

    // Geometric lines
    sctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    sctx.lineWidth = 14;
    sctx.beginPath();
    sctx.arc(540, 860, 420, 0, Math.PI * 2);
    sctx.stroke();

    const img = new Image();
    img.onload = () => {
      state.image = img;
      resetImageTransform('fill');
      render();
    };
    img.src = sampleCanvas.toDataURL();
  }

  // --- Drag & Drop for Canvas ---
  canvasWrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvasWrapper.style.outline = '2px dashed var(--accent)';
  });

  canvasWrapper.addEventListener('dragleave', () => {
    canvasWrapper.style.outline = 'none';
  });

  canvasWrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    canvasWrapper.style.outline = 'none';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImageFromFile(e.dataTransfer.files[0]);
    }
  });

  imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImageFromFile(e.target.files[0]);
    }
  });

  changeImageBtn.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImageFromFile(e.target.files[0]);
    }
  });

  if (headerPhotoUpload) {
    headerPhotoUpload.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadImageFromFile(e.target.files[0]);
      }
    });
  }

  if (floatingPhotoUpload) {
    floatingPhotoUpload.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        loadImageFromFile(e.target.files[0]);
      }
    });
  }

  // --- Clipboard Image Paste (Cmd+V / Ctrl+V) ---
  window.addEventListener('paste', (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            loadImageFromFile(file);
            break;
          }
        }
      }
    }
  });

  // Custom Overlay PNG
  overlayUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const ov = new Image();
        ov.onload = () => {
          state.customOverlay = ov;
          removeOverlayBtn.classList.remove('hidden');
          render();
        };
        ov.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  removeOverlayBtn.addEventListener('click', () => {
    state.customOverlay = null;
    overlayUpload.value = '';
    removeOverlayBtn.classList.add('hidden');
    render();
  });

  // --- Interaction: Dragging Photo or Text on Canvas ---
  function getCanvasCoord(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  // --- Active Tab & Text Hit-Test Helpers ---
  function isTextTabActive() {
    return state.activeTab === 'text' || document.querySelector('.tab-btn.active')?.dataset.tab === 'text';
  }

  function isPointInText(pos, bounds, inTextTab = false) {
    if (!bounds) return false;
    // テキストタブ時は指先での操作がよりスムーズになるよう、当たり判定を広めに拡張 (40px)
    const margin = inTextTab ? 40 : 16;
    return pos.x >= bounds.x - margin &&
           pos.x <= bounds.x + bounds.width + margin &&
           pos.y >= bounds.y - margin &&
           pos.y <= bounds.y + bounds.height + margin;
  }

  function onPointerDown(e) {
    const pos = getCanvasCoord(e);
    const rect = getPhotoRect();
    const W = canvas.width;
    const H = canvas.height;
    const inTextTab = isTextTabActive();

    // 1. テキストのクリック・タッチ判定 (Hit Testing)
    const textBounds = getTextBounds(rect, W, H);
    if (isPointInText(pos, textBounds, inTextTab)) {
      state.isDragging = true;
      state.dragTarget = 'text';
      state.dragStartX = pos.x;
      state.dragStartY = pos.y;
      state.textStartX = textBounds.textX;
      state.textStartY = textBounds.textY;
      state.text.x = textBounds.textX;
      state.text.y = textBounds.textY;
      state.text.customPos = true;
      document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
      canvasWrapper.style.cursor = 'grabbing';
      render();
      return;
    }

    // 2. テキスト編集タブ選択中は、写真の移動・ドラッグを完全ロック（テキスト項目時は写真を一切動かさない）
    if (inTextTab) {
      return;
    }

    // 3. テキストタブ以外なら写真のドラッグ
    if (state.image) {
      state.isDragging = true;
      state.dragTarget = 'image';
      state.dragStartX = pos.x;
      state.dragStartY = pos.y;
      state.imgStartX = state.imgX;
      state.imgStartY = state.imgY;
      canvasWrapper.style.cursor = 'grabbing';
    }
  }

  function onPointerMove(e) {
    const pos = getCanvasCoord(e);

    // ドラッグ中の動作
    if (state.isDragging) {
      const dx = pos.x - state.dragStartX;
      const dy = pos.y - state.dragStartY;

      if (state.dragTarget === 'text') {
        state.text.x = state.textStartX + dx;
        state.text.y = state.textStartY + dy;
        render();
      } else if (state.dragTarget === 'image' && state.image) {
        state.imgX = state.imgStartX + dx;
        state.imgY = state.imgStartY + dy;
        render();
      }
      return;
    }

    // ホバー時のカーソル判定
    const rect = getPhotoRect();
    const textBounds = getTextBounds(rect, canvas.width, canvas.height);
    const inTextTab = isTextTabActive();
    const isOverText = isPointInText(pos, textBounds, inTextTab);

    if (isOverText) {
      canvasWrapper.style.cursor = 'move';
      if (!state.isHoveringText) {
        state.isHoveringText = true;
        render();
      }
    } else {
      canvasWrapper.style.cursor = inTextTab ? 'default' : 'grab';
      if (state.isHoveringText) {
        state.isHoveringText = false;
        render();
      }
    }
  }

  function onPointerUp() {
    state.isDragging = false;
    state.dragTarget = null;
    canvasWrapper.style.cursor = isTextTabActive() ? 'default' : 'grab';
    render();
  }

  // --- Touch Gestures (Pinch to Zoom & Smooth Touch Drag) ---
  let touchStartDist = 0;
  let touchStartScale = 100;
  let isPinching = false;

  function onTouchStart(e) {
    if (e.touches.length === 2) {
      // テキスト編集タブ時は写真のピンチズームも防止
      if (isTextTabActive()) {
        isPinching = false;
        e.preventDefault();
        return;
      }
      isPinching = true;
      state.isDragging = false;
      state.dragTarget = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDist = Math.sqrt(dx * dx + dy * dy);
      touchStartScale = parseInt(scaleSlider.value, 10);
      e.preventDefault();
      return;
    }

    if (e.touches.length === 1) {
      isPinching = false;
      onPointerDown(e);
    }
  }

  function onTouchMove(e) {
    if (isTextTabActive() && isPinching) {
      e.preventDefault();
      return;
    }
    if (isPinching && e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (touchStartDist > 0) {
        const factor = dist / touchStartDist;
        let newPercent = Math.round(touchStartScale * factor);
        newPercent = Math.max(20, Math.min(300, newPercent));
        scaleSlider.value = newPercent;
        scaleVal.textContent = `${newPercent}%`;
        render();
      }
      return;
    }

    if (state.isDragging && e.touches.length === 1) {
      e.preventDefault();
      onPointerMove(e);
    }
  }

  function onTouchEnd(e) {
    if (e.touches.length < 2) {
      isPinching = false;
    }
    if (e.touches.length === 0) {
      onPointerUp();
    }
  }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onTouchStart, { passive: false });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd);
  window.addEventListener('touchcancel', onTouchEnd);

  // Wheel zoom
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isTextTabActive()) return; // テキスト編集タブ時は写真ズームを防止
    if (!state.image) return;
    const zoomDelta = e.deltaY * -0.001;
    let newPercent = parseInt(scaleSlider.value, 10) + zoomDelta * 50;
    newPercent = Math.max(20, Math.min(300, newPercent));
    scaleSlider.value = newPercent;
    scaleVal.textContent = `${Math.round(newPercent)}%`;
    render();
  }, { passive: false });

  // --- Geometry Calculation ---
  function getPhotoRect() {
    const W = canvas.width;
    const H = canvas.height;
    const m = state.margin;

    if (state.preset === 'polaroid') {
      // Polaroid Card Layout: outer card centered with margins
      const cardX = m;
      const cardY = m * 1.4;
      const cardW = W - m * 2;
      const cardH = H - m * 2.8;

      const innerPad = 48;
      const bottomPad = 220; // Extra white room for handwritten note
      const photoX = cardX + innerPad;
      const photoY = cardY + innerPad;
      const photoW = cardW - innerPad * 2;
      const photoH = cardH - innerPad - bottomPad;

      return {
        card: { x: cardX, y: cardY, width: cardW, height: cardH },
        x: photoX,
        y: photoY,
        width: photoW,
        height: photoH,
        textAreaY: cardY + cardH - (bottomPad / 2)
      };
    } else if (state.preset === 'film') {
      const topBannerH = 140;
      const bottomBannerH = 140;
      const photoX = m;
      const photoY = m + topBannerH;
      const photoW = W - m * 2;
      const photoH = H - (m * 2) - topBannerH - bottomBannerH;
      return {
        card: { x: m, y: m, width: W - m * 2, height: H - m * 2 },
        x: photoX,
        y: photoY,
        width: photoW,
        height: photoH,
        topBannerH,
        bottomBannerH
      };
    } else if (state.preset === 'clean') {
      return {
        card: { x: 0, y: 0, width: W, height: H },
        x: 0,
        y: 0,
        width: W,
        height: H
      };
    } else if (state.preset === 'fs_2_3') {
      const padX = 43;
      const padY = 47;
      return {
        card: { x: 0, y: 0, width: W, height: H },
        x: padX,
        y: padY,
        width: W - padX * 2,
        height: H - padY * 2
      };
    } else {
      // Minimal
      const photoX = m;
      const photoY = m * 1.3;
      const photoW = W - m * 2;
      const photoH = H - m * 2.6;
      return {
        card: { x: photoX, y: photoY, width: photoW, height: photoH },
        x: photoX,
        y: photoY,
        width: photoW,
        height: photoH
      };
    }
  }

  // --- Canvas Rendering Core ---
  function render() {
    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, W, H);

    // 1. Draw Background
    drawBackground(W, H);

    if (!state.image) {
      ctx.restore();
      return;
    }

    const rect = getPhotoRect();

    // 2. Draw Frame Base / Card Body (if polaroid, film, etc.)
    drawFrameBase(rect, W, H);

    // 3. Draw Masked User Image & Photo Effects (STRICTLY CONFINED TO PHOTO PIXELS)
    ctx.save();
    clipPhotoArea(rect);

    const scaleFactor = parseInt(scaleSlider.value, 10) / 100;
    const actualScale = state.imgScale * scaleFactor;

    // オフスクリーンCanvasで写真＋写真専用フィルターを合成
    const photoCanvas = document.createElement('canvas');
    photoCanvas.width = rect.width;
    photoCanvas.height = rect.height;
    const pctx = photoCanvas.getContext('2d');

    // 3-a. 写真の描画（Lightroom/Instagram級のピクセル単位Filmicトーンマッピング＋写真ぼかし）
    pctx.save();
    pctx.translate(state.imgX - rect.x, state.imgY - rect.y);
    pctx.rotate((state.imgRotation * Math.PI) / 180);
    pctx.scale(actualScale, actualScale);

    const gradedSource = getGradedPhotoCanvas(state.image);
    const photoSource = state.photoBlur > 0
      ? getBlurredCanvas(gradedSource, state.photoBlur * 1.5, 360, photoBlurCache, gradedPhotoCache.gradeKey)
      : gradedSource;

    pctx.drawImage(
      photoSource,
      -state.image.width / 2,
      -state.image.height / 2,
      state.image.width,
      state.image.height
    );
    pctx.restore();

    // 3-b. ポストエフェクト（リソグラフ、粒子グレイン、周辺減光ビネット）を適用
    applyEffectsToContext(pctx, 0, 0, rect.width, rect.height);

    // 3-c. ★超重要: destination-in で写真のアルファ形状（ピクセル領域）だけに完全マスク！
    // これにより、写真のない余白・枠内は100%完全な透明に戻り、ベタ塗りが絶対に起きません！
    pctx.save();
    pctx.globalCompositeOperation = 'destination-in';
    pctx.translate(state.imgX - rect.x, state.imgY - rect.y);
    pctx.rotate((state.imgRotation * Math.PI) / 180);
    pctx.scale(actualScale, actualScale);
    pctx.drawImage(
      state.image,
      -state.image.width / 2,
      -state.image.height / 2
    );
    pctx.restore();

    // 3-d. 写真レイヤーをメインキャンバスに合成
    ctx.drawImage(photoCanvas, rect.x, rect.y);
    ctx.restore();

    // 4. Draw Inner Frame Borders & Preset-specific Accents
    drawFrameAccents(rect, W, H);

    // 5. Draw Custom Overlay PNG if present
    if (state.customOverlay) {
      ctx.drawImage(state.customOverlay, 0, 0, W, H);
    }

    // 6. Draw Text Caption
    drawText(rect, W, H);

    ctx.restore();
  }

  // --- Film & Spatial Post-Effects (Risograph, Organic Film Grain, Vignette) ---
  function applyEffectsToContext(tctx, rx, ry, rw, rh) {
    // A. Risograph Special Effect (2-Color Inks)
    if (state.isRisograph) {
      tctx.save();
      // 蛍光ピンクのハイライト・中間色
      tctx.fillStyle = '#ff1493';
      tctx.globalAlpha = 0.26;
      tctx.globalCompositeOperation = 'screen';
      tctx.fillRect(rx, ry, rw, rh);

      // ディープティール／ネイビーのシャドウインク
      tctx.fillStyle = '#004777';
      tctx.globalAlpha = 0.32;
      tctx.globalCompositeOperation = 'multiply';
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // B. Film Grain (Organic Silver Halide Grain)
    if (state.grain > 0) {
      tctx.save();
      const pattern = getNoisePattern(state.grainSize || 2);
      if (pattern) {
        tctx.fillStyle = pattern;

        // 自然で写真に馴染む soft-light 合成（破綻やデジタル感を排除）
        tctx.globalCompositeOperation = 'soft-light';
        tctx.globalAlpha = Math.min(0.95, (state.grain / 100) * 0.95);
        tctx.fillRect(rx, ry, rw, rh);

        // スライダーが40%以上のとき、かすかにオーバーレイを乗せてリアルなざらつき質感を付与
        if (state.grain > 40) {
          tctx.globalCompositeOperation = 'overlay';
          tctx.globalAlpha = ((state.grain - 40) / 60) * 0.35;
          tctx.fillRect(rx, ry, rw, rh);
        }
      }
      tctx.restore();
    }

    // C. Vignette (Peripheral Darkening)
    if (state.vignette > 0) {
      tctx.save();
      const cx = rx + rw / 2;
      const cy = ry + rh / 2;
      const radius = Math.sqrt(rw * rw + rh * rh) / 2;
      const vigGrad = tctx.createRadialGradient(cx, cy, radius * 0.28, cx, cy, radius);
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.3)');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

      tctx.fillStyle = vigGrad;
      tctx.globalCompositeOperation = 'multiply';
      tctx.globalAlpha = (state.vignette / 100) * 0.92;
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }
  }

  // --- Background Drawing ---
  function drawBackground(W, H) {
    // Fill base color (純粋な背景カラー)
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, W, H);

    // Blurred image background (Filmicトーン＆カラー調整済みの写真をそのまま背景ぼかしに反映)
    if (state.blurBg && state.image) {
      ctx.save();

      const gradedSource = getGradedPhotoCanvas(state.image);
      const bgSource = state.blurAmount > 0
        ? getBlurredCanvas(gradedSource, state.blurAmount * 1.5, 260, bgBlurCache, gradedPhotoCache.gradeKey)
        : gradedSource;

      // Cover the entire 1080x1920 canvas
      const imgAspect = state.image.width / state.image.height;
      const canvasAspect = W / H;
      let drawW, drawH;
      if (imgAspect > canvasAspect) {
        drawH = H + 200;
        drawW = drawH * imgAspect;
      } else {
        drawW = W + 200;
        drawH = drawW / imgAspect;
      }
      ctx.drawImage(bgSource, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
      ctx.restore();

      // 背景用の控えめなトーンダウン (0.72x 相当)
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // リソグラフ時は背景にもインク感を連動
      if (state.isRisograph) {
        ctx.save();
        ctx.fillStyle = '#ff1493';
        ctx.globalAlpha = 0.20;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#004777';
        ctx.globalAlpha = 0.26;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // 背景用ダークビネット
      const vignette = ctx.createLinearGradient(0, 0, 0, H);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
      vignette.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // --- Frame Base (Card) ---
  function drawFrameBase(rect, W, H) {
    if (state.preset === 'clean' || state.preset === 'fs_2_3') return;

    ctx.save();
    if (state.hasShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.38)';
      ctx.shadowBlur = 48;
      ctx.shadowOffsetY = 24;
    }

    if (state.preset === 'polaroid') {
      ctx.fillStyle = state.frameColor;
      roundRect(ctx, rect.card.x, rect.card.y, rect.card.width, rect.card.height, 20);
      ctx.fill();
    } else if (state.preset === 'film') {
      ctx.fillStyle = '#0f0f10';
      roundRect(ctx, rect.card.x, rect.card.y, rect.card.width, rect.card.height, 12);
      ctx.fill();
    }
    ctx.restore();
  }

  // --- Photo Clipping Path ---
  function clipPhotoArea(rect) {
    ctx.beginPath();
    let r = state.borderRadius;

    if (state.preset === 'polaroid') {
      r = Math.min(r, 12); // Polaroid inner photos usually have small radius
    } else if (state.preset === 'clean') {
      r = 0;
    } else if (state.preset === 'fs_2_3') {
      r = 14;
    }

    roundRect(ctx, rect.x, rect.y, rect.width, rect.height, r);
    ctx.clip();
  }

  // --- Helper: Append Rounded Rectangle Path (without beginPath) ---
  function roundRectPath(tctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    radius = Math.max(0, radius);
    tctx.moveTo(x + radius, y);
    tctx.arcTo(x + width, y, x + width, y + height, radius);
    tctx.arcTo(x + width, y + height, x, y + height, radius);
    tctx.arcTo(x, y + height, x, y, radius);
    tctx.arcTo(x, y, x + width, y, radius);
    tctx.closePath();
  }

  // --- FS_2&3 Procedural Vector Graphic Frame (サンプルのサイズ・文字間を完全再現) ---
  function drawFS23VectorFrame(rect, W, H) {
    const padX = 43;
    const padY = 47;
    const innerW = W - padX * 2; // 994
    const innerH = H - padY * 2; // 1826
    const radius = 14;

    ctx.save();

    // 1. ソリッドカラー枠（evenodd で内窓をくり抜き、写真レイヤーの上に高精細ベクターで被せる）
    ctx.fillStyle = state.frameColor || '#1bb9ee';
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    roundRectPath(ctx, padX, padY, innerW, innerH, radius);
    ctx.fill('evenodd');

    // 2. タイポグラフィ描画ヘルパー (サンプルのフォントサイズ・文字間・ウェイトを忠実に再現)
    function renderFSTextLine(tctx, startX, baselineY) {
      tctx.save();
      tctx.textBaseline = 'middle';
      tctx.textAlign = 'left';

      // 文字間 (letter-spacing)
      const letterSpacing = (state.fsLetterSpacing || 0) + 'px';
      if ('letterSpacing' in tctx) {
        tctx.letterSpacing = letterSpacing;
      }

      const fontSize = state.fsFontSize || 30; // サンプル基準: 30px
      const subFontSize = Math.round(fontSize * 0.9); // サブテキスト: 27px
      const titleWeight = state.fsTitleWeight || 800;

      let curX = startX;
      let prefix = (state.fsTextPrefix !== undefined ? state.fsTextPrefix : 'FDS/').trim();
      let title = (state.fsTextTitle !== undefined ? state.fsTextTitle : 'FORM AND SPACE DESIGN').trim();
      const grade = (state.fsTextGrade !== undefined ? state.fsTextGrade : '2nd & 3rd grade').trim();

      // スマートフォールバック: prefixが空でtitleにスラッシュがある場合、自動分離してウェイトを適用
      if (!prefix && title.includes('/')) {
        const slashIdx = title.indexOf('/');
        prefix = title.substring(0, slashIdx + 1).trim();
        title = title.substring(slashIdx + 1).trim();
      }

      // 1. 略称 / プレフィックス (SemiBold 600 - サンプル仕様)
      if (prefix) {
        tctx.fillStyle = state.fsTitleColor || '#090405';
        tctx.font = `600 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        const displayPrefix = prefix + ' ';
        tctx.fillText(displayPrefix, curX, baselineY);
        curX += tctx.measureText(displayPrefix).width + 6;
      }

      // 2. メインタイトル (ExtraBold / Black 800-900 ★太字アクセント - サンプル仕様)
      if (title) {
        tctx.fillStyle = state.fsTitleColor || '#090405';
        tctx.font = `${titleWeight} ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        tctx.fillText(title, curX, baselineY);
        curX += tctx.measureText(title).width;
      }

      // 3. サブテキスト / 学年情報 (Regular 400 - 白文字 - サンプル仕様)
      if (grade) {
        curX += 20; // メインタイトルと学年の間の視覚的マージン (実測: 20px)
        tctx.fillStyle = state.fsGradeColor || '#ffffff';
        tctx.font = `400 ${subFontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        tctx.fillText(grade, curX, baselineY);
      }
      tctx.restore();
    }

    const sides = state.fsBorderSides || 'all';

    // A. 上辺 (Top): X=56px, Y=24.5px (実測値)
    renderFSTextLine(ctx, 56, 24.5);

    // B. 下辺 (Bottom): 180度反転, X=43px, Y=24.5px (実測値)
    if (sides === 'all' || sides === 'top-bottom') {
      ctx.save();
      ctx.translate(W, H);
      ctx.rotate(Math.PI);
      renderFSTextLine(ctx, 43, 24.5);
      ctx.restore();
    }

    // C. 右辺 (Right): 時計回り90度回転, start=334px, Y=21.5px (実測値)
    if (sides === 'all') {
      ctx.save();
      ctx.translate(W, 0);
      ctx.rotate(Math.PI / 2);
      renderFSTextLine(ctx, 334, 21.5);
      ctx.restore();
    }

    // D. 左辺 (Left): 反時計回り90度回転 (-90度), start=364px, Y=21.5px (実測値)
    if (sides === 'all') {
      ctx.save();
      ctx.translate(0, H);
      ctx.rotate(-Math.PI / 2);
      renderFSTextLine(ctx, 364, 21.5);
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Frame Accents & Details ---
  function drawFrameAccents(rect, W, H) {
    if (state.preset === 'fs_2_3') {
      // 完全ベクター描画（文字打ち替え＆フレーム色変更に100%リアルタイム対応）
      drawFS23VectorFrame(rect, W, H);
    } else if (state.preset === 'film') {
      // Draw 35mm film perforations (sprocket holes)
      ctx.save();
      ctx.fillStyle = '#222428';
      const holeW = 32;
      const holeH = 46;
      const holeRadius = 6;
      const spacing = 64;

      // Top sprocket row
      const topHolesY = rect.card.y + 40;
      for (let x = rect.card.x + 30; x < rect.card.x + rect.card.width - 30; x += spacing) {
        roundRect(ctx, x, topHolesY, holeW, holeH, holeRadius);
        ctx.fill();
      }

      // Bottom sprocket row
      const bottomHolesY = rect.card.y + rect.card.height - 40 - holeH;
      for (let x = rect.card.x + 30; x < rect.card.x + rect.card.width - 30; x += spacing) {
        roundRect(ctx, x, bottomHolesY, holeW, holeH, holeRadius);
        ctx.fill();
      }

      // FDS film text stamps
      ctx.fillStyle = '#ffb703';
      ctx.font = '700 24px "Share Tech Mono", monospace';
      ctx.fillText('FDS 400', rect.card.x + 34, rect.card.y + 115);
      ctx.fillText('12A ▷▷', rect.card.x + rect.card.width - 140, rect.card.y + 115);

      ctx.restore();
    }

    // Border Width if manually set > 0 (FS_2&3 はデザイン枠のため太さ変更無効)
    if (state.borderWidth > 0 && state.preset !== 'fs_2_3') {
      ctx.save();
      ctx.strokeStyle = state.frameColor;
      ctx.lineWidth = state.borderWidth;
      roundRect(ctx, rect.x, rect.y, rect.width, rect.height, state.borderRadius);
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Text Coordinates & Bounding Box Helpers ---
  function getTextPosition(rect, W, H) {
    if (state.text.customPos && state.text.x !== null && state.text.y !== null) {
      return { x: state.text.x, y: state.text.y };
    }

    let tx = W / 2;
    let ty = H - 100;

    if (state.text.position === 'top') {
      ty = rect.y > 110 ? rect.y / 2 : 100;
    } else if (state.text.position === 'center') {
      ty = H / 2;
    } else if (state.text.position === 'bottom') {
      ty = (state.preset === 'polaroid' && rect.textAreaY) ? rect.textAreaY : rect.y + rect.height + 64;
    } else {
      // footer
      ty = H - 90;
    }

    return { x: tx, y: ty };
  }

  function getTextBounds(rect, W, H) {
    if (!state.text.enabled || !state.text.content || !state.text.content.trim()) return null;
    const pos = getTextPosition(rect, W, H);

    ctx.save();
    ctx.font = `${state.text.weight || 600} ${state.text.size}px ${state.text.font}`;
    const metrics = ctx.measureText(state.text.content);
    ctx.restore();

    const w = metrics.width;
    // タイトな標準文字高（textBaseline='middle'と対称に配置）
    const h = state.text.size * 1.08;
    const padX = state.text.bgEnabled ? (state.text.padX ?? 8) : 24;
    const padY = state.text.bgEnabled ? (state.text.padY ?? 4) : 16;

    return {
      x: pos.x - w / 2 - padX,
      y: pos.y - h / 2 - padY,
      width: w + padX * 2,
      height: h + padY * 2,
      textX: pos.x,
      textY: pos.y,
      textW: w,
      textH: h,
      padX: padX,
      padY: padY
    };
  }

  // --- Text Drawing ---
  function drawText(rect, W, H) {
    if (!state.text.enabled || !state.text.content || !state.text.content.trim()) return;

    const pos = getTextPosition(rect, W, H);
    const bounds = getTextBounds(rect, W, H);
    if (!bounds) return;

    ctx.save();

    // 1. 文字背景の色ベタ四角（座布団・帯）
    if (state.text.bgEnabled) {
      ctx.save();
      ctx.fillStyle = state.text.bgColor || '#111111';
      roundRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, state.text.bgRadius || 0);
      ctx.fill();
      ctx.restore();
    }

    // 2. 文字を描画
    ctx.font = `${state.text.weight || 600} ${state.text.size}px ${state.text.font}`;
    ctx.fillStyle = state.text.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 背景ベタが無効のときのみ、写真上での可読性用ドロップシャドウを適用
    if (!state.text.bgEnabled && (state.text.position !== 'bottom' || state.preset !== 'polaroid')) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 10;
    }

    ctx.fillText(state.text.content, pos.x, pos.y);

    // 3. ドラッグ中またはホバー時に編集枠を表示
    if (state.dragTarget === 'text' || state.isHoveringText) {
      ctx.strokeStyle = 'rgba(29, 78, 216, 0.9)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      roundRect(ctx, bounds.x, bounds.y, bounds.width, bounds.height, state.text.bgRadius || 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Helper: Rounded Rectangle ---
  function roundRect(ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    radius = Math.max(0, radius);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  // --- Filter Presets & Tone Adjustments ---
  function applyFilterPreset(filterName) {
    state.filterPreset = filterName;

    // Built-in XMP Presets (Kodak Gold 100, Original XMP)
    if (BUILTIN_XMP_DATA && BUILTIN_XMP_DATA[filterName]) {
      const presetData = BUILTIN_XMP_DATA[filterName];
      parseAndApplyXMP(presetData.xml, presetData.name);
      state.filterPreset = filterName;

      document.querySelectorAll('.filter-card').forEach(c => {
        c.classList.toggle('active', c.dataset.filter === filterName);
      });

      render();
      return;
    }

    const p = FILTER_PRESETS[filterName];
    if (!p) return;

    state.exposure = p.exposure;
    state.contrast = p.contrast;
    state.saturation = p.saturation;
    state.photoBlur = p.photoBlur || 0;
    state.highlights = p.highlights;
    state.shadows = p.shadows;
    state.whites = p.whites || 0;
    state.blacks = p.blacks || 0;
    state.warmth = p.warmth;
    state.grain = p.grain;
    state.grainSize = p.grainSize || 2;
    state.vignette = p.vignette;
    state.isRisograph = !!p.isRisograph;
    state.xmpProfile = null;
    state.cubeLUT = null;
    state.profileId = (state.profileId || 0) + 1;
    if (lutStatus) lutStatus.textContent = '';
    if (lutUpload) lutUpload.value = '';

    syncFilterSliders();

    document.querySelectorAll('.filter-card').forEach(c => {
      c.classList.toggle('active', c.dataset.filter === filterName);
    });

    render();
  }

  const GRAIN_SIZE_LABELS = {
    1: '細 (Fine)',
    2: '中 (標準)',
    3: '粗 (Coarse)',
    4: '極粗 (Riso)'
  };

  function syncFilterSliders() {
    exposureSlider.value = state.exposure;
    exposureVal.textContent = state.exposure > 0 ? `+${state.exposure}` : `${state.exposure}`;

    contrastSlider.value = state.contrast;
    contrastVal.textContent = state.contrast > 0 ? `+${state.contrast}` : `${state.contrast}`;

    saturationSlider.value = state.saturation;
    saturationVal.textContent = state.saturation > 0 ? `+${state.saturation}` : `${state.saturation}`;

    if (photoBlurSlider && photoBlurVal) {
      photoBlurSlider.value = state.photoBlur || 0;
      photoBlurVal.textContent = `${state.photoBlur || 0}px`;
    }

    highlightsSlider.value = state.highlights;
    highlightsVal.textContent = state.highlights > 0 ? `+${state.highlights}` : `${state.highlights}`;

    shadowsSlider.value = state.shadows;
    shadowsVal.textContent = state.shadows > 0 ? `+${state.shadows}` : `${state.shadows}`;

    whitesSlider.value = state.whites;
    whitesVal.textContent = state.whites > 0 ? `+${state.whites}` : `${state.whites}`;

    blacksSlider.value = state.blacks;
    blacksVal.textContent = state.blacks > 0 ? `+${state.blacks}` : `${state.blacks}`;

    warmthSlider.value = state.warmth;
    warmthVal.textContent = state.warmth > 0 ? `+${state.warmth}` : `${state.warmth}`;

    grainSlider.value = state.grain;
    grainVal.textContent = `${state.grain}%`;

    grainSizeSlider.value = state.grainSize || 2;
    grainSizeVal.textContent = GRAIN_SIZE_LABELS[state.grainSize || 2] || '標準';

    vignetteSlider.value = state.vignette;
    vignetteVal.textContent = `${state.vignette}%`;

    updateAdjustDots();
  }

  function updateAdjustDots() {
    const dotMap = {
      exposure: state.exposure !== 0,
      contrast: state.contrast !== 0,
      saturation: state.saturation !== 0,
      photoBlur: (state.photoBlur || 0) > 0,
      highlights: state.highlights !== 0,
      shadows: state.shadows !== 0,
      warmth: state.warmth !== 0,
      whites: state.whites !== 0,
      blacks: state.blacks !== 0,
      grain: state.grain > 0,
      grainSize: (state.grainSize || 2) !== 2,
      vignette: state.vignette > 0,
      lut: !!(state.xmpProfile || state.cubeLUT)
    };
    Object.keys(dotMap).forEach((key) => {
      const dot = document.getElementById(`dot-${key}`);
      if (dot) {
        dot.classList.toggle('modified', !!dotMap[key]);
      }
    });
  }

  function onFilterSliderManualChange() {
    // プリセットのハイライト枠は外すが、リソグラフ状態は維持して微調整できるようにする
    document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('active'));
    updateAdjustDots();
    render();
  }

  document.querySelectorAll('.filter-card').forEach(card => {
    card.addEventListener('click', () => {
      applyFilterPreset(card.dataset.filter);
    });
  });

  resetFiltersBtn.addEventListener('click', () => {
    applyFilterPreset('normal');
  });

  exposureSlider.addEventListener('input', (e) => {
    state.exposure = parseInt(e.target.value, 10);
    exposureVal.textContent = state.exposure > 0 ? `+${state.exposure}` : `${state.exposure}`;
    onFilterSliderManualChange();
  });

  contrastSlider.addEventListener('input', (e) => {
    state.contrast = parseInt(e.target.value, 10);
    contrastVal.textContent = state.contrast > 0 ? `+${state.contrast}` : `${state.contrast}`;
    onFilterSliderManualChange();
  });

  saturationSlider.addEventListener('input', (e) => {
    state.saturation = parseInt(e.target.value, 10);
    saturationVal.textContent = state.saturation > 0 ? `+${state.saturation}` : `${state.saturation}`;
    onFilterSliderManualChange();
  });

  if (photoBlurSlider) {
    photoBlurSlider.addEventListener('input', (e) => {
      state.photoBlur = parseInt(e.target.value, 10);
      if (photoBlurVal) photoBlurVal.textContent = `${state.photoBlur}px`;
      onFilterSliderManualChange();
    });
  }

  // --- Instagram-Style Horizontal Tool Strips (Mobile Single-Slider Switcher) ---
  document.querySelectorAll('#instaAdjustStrip .insta-adjust-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.adjustTarget;
      document.querySelectorAll('#instaAdjustStrip .insta-adjust-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      document.querySelectorAll('#pane-filters .control-group[data-adjust-group]').forEach((grp) => {
        grp.classList.toggle('mobile-adjust-active', grp.dataset.adjustGroup === target);
      });
    });
  });

  document.querySelectorAll('#instaImageStrip .insta-adjust-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.imgTarget;
      document.querySelectorAll('#instaImageStrip .insta-adjust-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      document.querySelectorAll('#pane-image .control-group[data-img-group]').forEach((grp) => {
        grp.classList.toggle('mobile-img-active', grp.dataset.imgGroup === target);
      });
    });
  });

  highlightsSlider.addEventListener('input', (e) => {
    state.highlights = parseInt(e.target.value, 10);
    highlightsVal.textContent = state.highlights > 0 ? `+${state.highlights}` : `${state.highlights}`;
    onFilterSliderManualChange();
  });

  shadowsSlider.addEventListener('input', (e) => {
    state.shadows = parseInt(e.target.value, 10);
    shadowsVal.textContent = state.shadows > 0 ? `+${state.shadows}` : `${state.shadows}`;
    onFilterSliderManualChange();
  });

  whitesSlider.addEventListener('input', (e) => {
    state.whites = parseInt(e.target.value, 10);
    whitesVal.textContent = state.whites > 0 ? `+${state.whites}` : `${state.whites}`;
    onFilterSliderManualChange();
  });

  blacksSlider.addEventListener('input', (e) => {
    state.blacks = parseInt(e.target.value, 10);
    blacksVal.textContent = state.blacks > 0 ? `+${state.blacks}` : `${state.blacks}`;
    onFilterSliderManualChange();
  });

  warmthSlider.addEventListener('input', (e) => {
    state.warmth = parseInt(e.target.value, 10);
    warmthVal.textContent = state.warmth > 0 ? `+${state.warmth}` : `${state.warmth}`;
    onFilterSliderManualChange();
  });

  grainSlider.addEventListener('input', (e) => {
    state.grain = parseInt(e.target.value, 10);
    grainVal.textContent = `${state.grain}%`;
    onFilterSliderManualChange();
  });

  grainSizeSlider.addEventListener('input', (e) => {
    state.grainSize = parseInt(e.target.value, 10);
    grainSizeVal.textContent = GRAIN_SIZE_LABELS[state.grainSize] || '標準';
    onFilterSliderManualChange();
  });

  vignetteSlider.addEventListener('input', (e) => {
    state.vignette = parseInt(e.target.value, 10);
    vignetteVal.textContent = `${state.vignette}%`;
    onFilterSliderManualChange();
  });

  // --- Lightroom (.xmp) & LUT (.cube) Import Handler ---
  if (lutUpload) {
    lutUpload.addEventListener('change', (e) => {
      if (!e.target.files || !e.target.files[0]) return;
      const file = e.target.files[0];
      const fileName = file.name;
      const ext = fileName.split('.').pop().toLowerCase();

      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        if (ext === 'xmp') {
          parseAndApplyXMP(text, fileName);
        } else if (ext === 'cube') {
          parseAndApplyCube(text, fileName);
        } else {
          lutStatus.textContent = '対応していないファイル形式です (.xmp, .cube)';
          lutStatus.style.color = '#ef4444';
        }
      };
      reader.readAsText(file);
    });
  }

  function parseAndApplyXMP(xmlText, fileName) {
    // 1. Reset base tone state first so previous sliders don't pollute the XMP preset
    state.exposure = 0;
    state.contrast = 0;
    state.saturation = 0;
    state.highlights = 0;
    state.shadows = 0;
    state.whites = 0;
    state.blacks = 0;
    state.warmth = 0;
    state.grain = 0;
    state.vignette = 0;
    state.isRisograph = false;
    state.cubeLUT = null;

    let matched = 0;
    const loadedFeatures = [];

    // Supports both crs:Key="val" attribute syntax and <crs:Key>val</crs:Key> element syntax
    function getRawVal(attrName) {
      const attrRegex = new RegExp(`(?:crs:)?${attrName}\\s*=\\s*"([^"]+)"`, 'i');
      const m1 = xmlText.match(attrRegex);
      if (m1) return m1[1].trim();
      const tagRegex = new RegExp(`<(?:crs:)?${attrName}>\\s*([^<]+?)\\s*<\\/(?:crs:)?${attrName}>`, 'i');
      const m2 = xmlText.match(tagRegex);
      return m2 ? m2[1].trim() : null;
    }

    function getNum(attrName) {
      const raw = getRawVal(attrName);
      if (raw === null) return null;
      const v = parseFloat(raw);
      return Number.isNaN(v) ? null : v;
    }

    function getCurvePoints(curveName) {
      const blockRegex = new RegExp(`<(?:crs:)?${curveName}[\\s>][\\s\\S]*?<\\/(?:crs:)?${curveName}>`, 'i');
      const blockMatch = xmlText.match(blockRegex);
      if (!blockMatch) return null;
      const liRegex = /<rdf:li>\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*<\/rdf:li>/gi;
      const pts = [];
      let m;
      while ((m = liRegex.exec(blockMatch[0])) !== null) {
        pts.push([parseFloat(m[1]), parseFloat(m[2])]);
      }
      if (pts.length === 0) return null;
      // Check if curve is non-identity (not just [0,0], [255,255])
      const isIdentity = pts.length === 2 && pts[0][0] === 0 && pts[0][1] === 0 && pts[1][0] === 255 && pts[1][1] === 255;
      return isIdentity ? null : pts;
    }

    // --- A. Basic Tone Sliders ---
    const exp = getNum('Exposure2012') ?? getNum('Exposure');
    if (exp !== null) {
      state.exposure = Math.round(Math.max(-100, Math.min(100, exp * 48)));
      matched++;
    }

    const cont = getNum('Contrast2012') ?? getNum('Contrast');
    if (cont !== null) {
      state.contrast = Math.round(Math.max(-100, Math.min(100, cont)));
      matched++;
    }

    const hl = getNum('Highlights2012') ?? getNum('Highlights');
    if (hl !== null) {
      state.highlights = Math.round(Math.max(-100, Math.min(100, hl)));
      matched++;
    }

    const sh = getNum('Shadows2012') ?? getNum('Shadows');
    if (sh !== null) {
      state.shadows = Math.round(Math.max(-100, Math.min(100, sh)));
      matched++;
    }

    const wh = getNum('Whites2012') ?? getNum('Whites');
    if (wh !== null) {
      state.whites = Math.round(Math.max(-100, Math.min(100, wh)));
      matched++;
    }

    const bl = getNum('Blacks2012') ?? getNum('Blacks');
    if (bl !== null) {
      state.blacks = Math.round(Math.max(-100, Math.min(100, bl)));
      matched++;
    }

    const sat = getNum('Saturation');
    if (sat !== null) {
      state.saturation = Math.round(Math.max(-100, Math.min(100, sat)));
      matched++;
    }

    // White Balance: Temperature (Kelvin or Incremental) & Tint
    const incTemp = getNum('IncrementalTemperature');
    const temp = getNum('Temperature');
    if (incTemp !== null && incTemp !== 0) {
      state.warmth = Math.round(Math.max(-100, Math.min(100, incTemp)));
      matched++;
    } else if (temp !== null) {
      if (temp > 1000) {
        state.warmth = Math.round(Math.max(-100, Math.min(100, (temp - 5200) / 42)));
      } else {
        state.warmth = Math.round(Math.max(-100, Math.min(100, temp)));
      }
      matched++;
    }

    const incTint = getNum('IncrementalTint');
    const rawTint = getNum('Tint');
    const tint = (incTint !== null && incTint !== 0) ? incTint : (rawTint !== null ? rawTint : 0);
    if (tint !== 0) matched++;

    const vibrance = getNum('Vibrance') || 0;
    if (vibrance !== 0) matched++;

    const clarity = getNum('Clarity2012') ?? getNum('Clarity') ?? 0;
    if (clarity !== 0) matched++;

    const dehaze = getNum('Dehaze') || 0;
    if (dehaze !== 0) matched++;

    const isGrayscale = /^true$/i.test(getRawVal('ConvertToGrayscale') || '');
    if (isGrayscale) matched++;

    // --- B. Parametric & Point Tone Curves (Master + R/G/B) ---
    const pShadows = getNum('ParametricShadows') || 0;
    const pDarks = getNum('ParametricDarks') || 0;
    const pLights = getNum('ParametricLights') || 0;
    const pHighlights = getNum('ParametricHighlights') || 0;
    const hasParametric = (pShadows !== 0 || pDarks !== 0 || pLights !== 0 || pHighlights !== 0);
    if (hasParametric) {
      matched += 4;
      loadedFeatures.push('パラメトリックカーブ');
    }

    const masterPts = getCurvePoints('ToneCurvePV2012') || getCurvePoints('ToneCurve');
    const redPts = getCurvePoints('ToneCurvePV2012Red') || getCurvePoints('ToneCurveRed');
    const greenPts = getCurvePoints('ToneCurvePV2012Green') || getCurvePoints('ToneCurveGreen');
    const bluePts = getCurvePoints('ToneCurvePV2012Blue') || getCurvePoints('ToneCurveBlue');

    const curves = {
      master: buildMonotoneCubicLUT(masterPts),
      red: buildMonotoneCubicLUT(redPts),
      green: buildMonotoneCubicLUT(greenPts),
      blue: buildMonotoneCubicLUT(bluePts)
    };
    if (curves.master || curves.red || curves.green || curves.blue) {
      matched += (curves.master ? 1 : 0) + (curves.red ? 1 : 0) + (curves.green ? 1 : 0) + (curves.blue ? 1 : 0);
      loadedFeatures.push(curves.red || curves.green || curves.blue ? 'RGBトーンカーブ' : 'トーンカーブ');
    }

    // --- C. 8-Band HSL / Color Mixer ---
    const hslColors = ['Red', 'Orange', 'Yellow', 'Green', 'Aqua', 'Blue', 'Purple', 'Magenta'];
    const hslData = { hue: {}, sat: {}, lum: {} };
    let hslCount = 0;
    hslColors.forEach((col) => {
      const h = getNum(`HueAdjustment${col}`);
      const s = getNum(`SaturationAdjustment${col}`);
      const l = getNum(`LuminanceAdjustment${col}`);
      if (h !== null && h !== 0) { hslData.hue[col] = h; hslCount++; }
      if (s !== null && s !== 0) { hslData.sat[col] = s; hslCount++; }
      if (l !== null && l !== 0) { hslData.lum[col] = l; hslCount++; }
    });
    let hslTables = null;
    if (hslCount > 0) {
      hslTables = buildHSLTables(hslData);
      matched += hslCount;
      loadedFeatures.push(`HSL(${hslCount}箇所)`);
    }

    // --- D. 3-Way Color Grading Wheels & Split Toning ---
    const cgData = {
      shadowHue: getNum('ColorGradeShadowHue') ?? getNum('SplitToningShadowHue') ?? 0,
      shadowSat: getNum('ColorGradeShadowSat') ?? getNum('SplitToningShadowSaturation') ?? 0,
      shadowLum: getNum('ColorGradeShadowLum') ?? 0,
      midtoneHue: getNum('ColorGradeMidtoneHue') ?? 0,
      midtoneSat: getNum('ColorGradeMidtoneSat') ?? 0,
      midtoneLum: getNum('ColorGradeMidtoneLum') ?? 0,
      highlightHue: getNum('ColorGradeHighlightHue') ?? getNum('SplitToningHighlightHue') ?? 0,
      highlightSat: getNum('ColorGradeHighlightSat') ?? getNum('SplitToningHighlightSaturation') ?? 0,
      highlightLum: getNum('ColorGradeHighlightLum') ?? 0,
      globalHue: getNum('ColorGradeGlobalHue') ?? 0,
      globalSat: getNum('ColorGradeGlobalSat') ?? 0,
      globalLum: getNum('ColorGradeGlobalLum') ?? 0,
      balance: getNum('SplitToningBalance') ?? 0,
      blending: getNum('ColorGradeBlending') ?? 50
    };
    const hasCG = (
      cgData.shadowSat > 0 || cgData.midtoneSat > 0 || cgData.highlightSat > 0 || cgData.globalSat > 0 ||
      cgData.shadowLum !== 0 || cgData.midtoneLum !== 0 || cgData.highlightLum !== 0 || cgData.globalLum !== 0
    );
    let cgTables = null;
    if (hasCG) {
      cgTables = buildColorGradingTables(cgData);
      matched += 3;
      loadedFeatures.push('カラーグレーディング');
    }

    // --- E. Camera Calibration (3 Primary Shifts + ShadowTint) ---
    const calData = {
      shadowTint: getNum('ShadowTint') || 0,
      redHue: getNum('RedHue') || 0,
      redSat: getNum('RedSaturation') || 0,
      greenHue: getNum('GreenHue') || 0,
      greenSat: getNum('GreenSaturation') || 0,
      blueHue: getNum('BlueHue') || 0,
      blueSat: getNum('BlueSaturation') || 0
    };
    const hasCal = (
      calData.shadowTint !== 0 ||
      calData.redHue !== 0 || calData.redSat !== 0 ||
      calData.greenHue !== 0 || calData.greenSat !== 0 ||
      calData.blueHue !== 0 || calData.blueSat !== 0
    );
    let calMatrix = null;
    if (hasCal) {
      calMatrix = buildCalibrationMatrix(calData);
      matched += 3;
      loadedFeatures.push('キャリブレーション');
    }

    // --- F. Grain & Vignette ---
    const grain = getNum('GrainAmount');
    if (grain !== null) {
      state.grain = Math.round(Math.max(0, Math.min(100, grain)));
      matched++;
    }
    const gSize = getNum('GrainSize');
    if (gSize !== null && gSize > 0) {
      state.grainSize = gSize < 20 ? 1 : (gSize < 45 ? 2 : (gSize < 75 ? 3 : 4));
    }
    const vig = getNum('PostCropVignetteAmount');
    if (vig !== null && vig < 0) {
      state.vignette = Math.round(Math.min(100, Math.abs(vig)));
      matched++;
    }

    state.xmpProfile = {
      tint,
      vibrance,
      clarity,
      dehaze,
      isGrayscale,
      parametric: hasParametric ? { shadows: pShadows, darks: pDarks, lights: pLights, highlights: pHighlights } : null,
      curves: (curves.master || curves.red || curves.green || curves.blue) ? curves : null,
      hslTables,
      cgTables,
      calMatrix
    };
    state.profileId = (state.profileId || 0) + 1;

    syncFilterSliders();
    onFilterSliderManualChange();

    const detailStr = loadedFeatures.length > 0 ? ` [${loadedFeatures.join(' / ')}]` : '';
    lutStatus.textContent = `✅ ${fileName} を適用しました (${matched}項目${detailStr})`;
    lutStatus.style.color = '#10b981';
  }

  function parseAndApplyCube(cubeText, fileName) {
    const lines = cubeText.split(/\r?\n/);
    let size = 0;
    const values = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      if (line.toUpperCase().startsWith('LUT_3D_SIZE')) {
        const parts = line.split(/\s+/);
        size = parseInt(parts[1], 10) || 0;
        continue;
      }
      if (/^[A-Za-z_]/.test(line)) continue;
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const r = parseFloat(parts[0]);
        const g = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);
        if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
          values.push(r, g, b);
        }
      }
    }

    if (size > 1 && values.length >= size * size * size * 3) {
      state.cubeLUT = {
        size,
        data: new Float32Array(values)
      };
      state.xmpProfile = null;
      state.profileId = (state.profileId || 0) + 1;
      syncFilterSliders();
      onFilterSliderManualChange();
      lutStatus.textContent = `✅ 3D LUT (${fileName}, ${size}³グリッド) を適用しました`;
      lutStatus.style.color = '#10b981';
    } else {
      lutStatus.textContent = `⚠️ .cube ファイルの解析に失敗しました (${fileName})`;
      lutStatus.style.color = '#ef4444';
    }
  }

  // --- Event Listeners: Image Adjustments ---
  scaleSlider.addEventListener('input', (e) => {
    scaleVal.textContent = `${e.target.value}%`;
    render();
  });

  rotateSlider.addEventListener('input', (e) => {
    state.imgRotation = parseInt(e.target.value, 10);
    rotateVal.textContent = `${state.imgRotation}°`;
    render();
  });

  fitImageBtn.addEventListener('click', () => resetImageTransform('fit'));
  fillImageBtn.addEventListener('click', () => resetImageTransform('fill'));

  blurBgCheck.addEventListener('change', (e) => {
    state.blurBg = e.target.checked;
    blurAmountGroup.style.display = state.blurBg ? 'block' : 'none';
    render();
  });

  blurSlider.addEventListener('input', (e) => {
    state.blurAmount = parseInt(e.target.value, 10);
    blurVal.textContent = `${state.blurAmount}px`;
    render();
  });

  bgColorPicker.addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    state.blurBg = false;
    blurBgCheck.checked = false;
    blurAmountGroup.style.display = 'none';
    render();
  });

  document.querySelectorAll('[data-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.bgColor = dot.dataset.color;
      bgColorPicker.value = state.bgColor;
      state.blurBg = false;
      blurBgCheck.checked = false;
      blurAmountGroup.style.display = 'none';
      render();
    });
  });

  // --- Frame Style Adjustments ---
  frameMarginSlider.addEventListener('input', (e) => {
    if (state.preset === 'fs_2_3') {
      marginVal.textContent = '固定';
      return;
    }
    const oldBox = state.image ? getPhotoRect() : null;
    state.margin = parseInt(e.target.value, 10);
    marginVal.textContent = `${state.margin}px`;
    if (state.image && oldBox) {
      const newBox = getPhotoRect();
      adjustImageForNewFrame(oldBox, newBox);
    }
    render();
  });

  borderWidthSlider.addEventListener('input', (e) => {
    if (state.preset === 'fs_2_3') {
      state.borderWidth = 0;
      borderWidthSlider.value = 0;
      borderWidthVal.textContent = '固定';
      return;
    }
    state.borderWidth = parseInt(e.target.value, 10);
    borderWidthVal.textContent = `${state.borderWidth}px`;
    render();
  });

  borderRadiusSlider.addEventListener('input', (e) => {
    state.borderRadius = parseInt(e.target.value, 10);
    radiusVal.textContent = `${state.borderRadius}px`;
    render();
  });

  frameColorPicker.addEventListener('input', (e) => {
    state.frameColor = e.target.value;
    render();
  });

  document.querySelectorAll('[data-frame-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.frameColor = dot.dataset.frameColor;
      frameColorPicker.value = state.frameColor;
      render();
    });
  });

  shadowCheck.addEventListener('change', (e) => {
    state.hasShadow = e.target.checked;
    render();
  });

  // --- FS_2&3 Frame Typography Controls ---
  if (fsPrefixInput) {
    fsPrefixInput.addEventListener('input', (e) => {
      state.fsTextPrefix = e.target.value;
      render();
    });
  }

  // チップのアクティブ状態を同期
  function syncFsChips() {
    document.querySelectorAll('.chip-btn[data-fs-title]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.fsTitle === state.fsTextTitle);
    });
    document.querySelectorAll('.chip-btn[data-fs-grade]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.fsGrade === state.fsTextGrade);
    });
  }

  // メインタイトル（専攻名）プリセットチップ (FORM AND SPACE DESIGN / VISUAL DESIGN / 1st Year Class)
  document.querySelectorAll('.chip-btn[data-fs-title]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.fsTextTitle = chip.dataset.fsTitle;
      if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;

      // 専攻・クラスに対応するフレームカラーと文字色を自動適用
      const styleCfg = FS_TITLE_STYLES[state.fsTextTitle];
      if (styleCfg) {
        if (styleCfg.frameColor) {
          state.frameColor = styleCfg.frameColor;
          if (frameColorPicker) frameColorPicker.value = state.frameColor;
        }
        if (styleCfg.gradeColor) {
          state.fsGradeColor = styleCfg.gradeColor;
          if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
        }
      }

      // 1st Year Classが選ばれた場合、学年欄が2nd & 3rd gradeのままなら空欄にして重複を防ぐ
      if (state.fsTextTitle === '1st Year Class' && state.fsTextGrade === '2nd & 3rd grade') {
        state.fsTextGrade = '';
        if (fsGradeInput) fsGradeInput.value = '';
      } else if (state.fsTextTitle !== '1st Year Class' && !state.fsTextGrade) {
        state.fsTextGrade = '2nd & 3rd grade';
        if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
      }
      syncFsChips();
      render();
    });
  });

  // 学年 / サブ情報プリセットチップ (2nd & 3rd grade / 1st Year Class / 1st grade / 空白)
  document.querySelectorAll('.chip-btn[data-fs-grade]').forEach(chip => {
    chip.addEventListener('click', () => {
      state.fsTextGrade = chip.dataset.fsGrade;
      if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
      syncFsChips();
      render();
    });
  });

  if (fsTitleInput) {
    fsTitleInput.addEventListener('input', (e) => {
      state.fsTextTitle = e.target.value;
      const styleCfg = FS_TITLE_STYLES[state.fsTextTitle];
      if (styleCfg) {
        if (styleCfg.frameColor) {
          state.frameColor = styleCfg.frameColor;
          if (frameColorPicker) frameColorPicker.value = state.frameColor;
        }
        if (styleCfg.gradeColor) {
          state.fsGradeColor = styleCfg.gradeColor;
          if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
        }
      }
      syncFsChips();
      render();
    });
  }

  if (fsGradeInput) {
    fsGradeInput.addEventListener('input', (e) => {
      state.fsTextGrade = e.target.value;
      syncFsChips();
      render();
    });
  }

  // メインタイトルの太さ切り替え (500, 700, 800, 900)
  document.querySelectorAll('.fs-weight-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.fs-weight-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const w = parseInt(btn.dataset.fsWeight, 10);
      state.fsTitleWeight = w;
      if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS[`${w}`] || `${w}`;
      if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = `${FS_WEIGHT_LABELS[`${w}`] || w} (太字)`;
      render();
    });
  });

  // クイックテンプレート（学年・展示チップ）
  document.querySelectorAll('.chip-btn[data-fs-template]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip-btn[data-fs-template]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const tpl = FS_TEMPLATES[chip.dataset.fsTemplate];
      if (tpl) {
        state.fsTextPrefix = tpl.prefix;
        state.fsTextTitle = tpl.title;
        state.fsTextGrade = tpl.grade;
        state.fsTitleWeight = tpl.weight;
        if (tpl.frameColor) {
          state.frameColor = tpl.frameColor;
          if (frameColorPicker) frameColorPicker.value = state.frameColor;
        }
        if (tpl.gradeColor) {
          state.fsGradeColor = tpl.gradeColor;
          if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
        }

        if (fsPrefixInput) fsPrefixInput.value = state.fsTextPrefix;
        if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;
        if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
        if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || `${state.fsTitleWeight}`;
        if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = `${FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || state.fsTitleWeight} (太字)`;

        document.querySelectorAll('.fs-weight-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.fsWeight, 10) === state.fsTitleWeight);
        });

        syncFsChips();
        render();
      }
    });
  });

  if (fsTitleColorPicker) {
    fsTitleColorPicker.addEventListener('input', (e) => {
      state.fsTitleColor = e.target.value;
      render();
    });
  }

  document.querySelectorAll('[data-fs-title-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.fsTitleColor = dot.dataset.fsTitleColor;
      if (fsTitleColorPicker) fsTitleColorPicker.value = state.fsTitleColor;
      render();
    });
  });

  if (fsGradeColorPicker) {
    fsGradeColorPicker.addEventListener('input', (e) => {
      state.fsGradeColor = e.target.value;
      render();
    });
  }

  document.querySelectorAll('[data-fs-grade-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.fsGradeColor = dot.dataset.fsGradeColor;
      if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
      render();
    });
  });

  if (fsFontSizeSlider) {
    fsFontSizeSlider.addEventListener('input', (e) => {
      state.fsFontSize = parseInt(e.target.value, 10);
      if (fsFontSizeVal) fsFontSizeVal.textContent = state.fsFontSize === 30 ? '30px (サンプル標準)' : `${state.fsFontSize}px`;
      render();
    });
  }

  if (fsSpacingSlider) {
    fsSpacingSlider.addEventListener('input', (e) => {
      state.fsLetterSpacing = parseFloat(e.target.value);
      if (fsSpacingVal) fsSpacingVal.textContent = state.fsLetterSpacing === 0 ? '0px (サンプル標準)' : `${state.fsLetterSpacing}px`;
      render();
    });
  }

  document.querySelectorAll('.fs-sides-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.fs-sides-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.fsBorderSides = btn.dataset.sides;
      render();
    });
  });

  if (resetFs23TextBtn) {
    resetFs23TextBtn.addEventListener('click', () => {
      state.fsTextPrefix = 'FDS/';
      state.fsTextTitle = 'FORM AND SPACE DESIGN';
      state.fsTextGrade = '2nd & 3rd grade';
      state.fsTitleWeight = 800;
      state.fsFontSize = 30;
      state.fsLetterSpacing = 0;
      state.frameColor = '#1bb9ee';
      state.fsTitleColor = '#090405';
      state.fsGradeColor = '#ffffff';
      state.fsBorderSides = 'all';

      if (fsPrefixInput) fsPrefixInput.value = state.fsTextPrefix;
      if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;
      if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
      if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS['800'];
      if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = 'ExtraBold (800) (太字)';
      if (fsFontSizeSlider) fsFontSizeSlider.value = 30;
      if (fsFontSizeVal) fsFontSizeVal.textContent = '30px (サンプル標準)';
      if (fsSpacingSlider) fsSpacingSlider.value = 0;
      if (fsSpacingVal) fsSpacingVal.textContent = '0px (サンプル標準)';
      if (frameColorPicker) frameColorPicker.value = state.frameColor;
      if (fsTitleColorPicker) fsTitleColorPicker.value = state.fsTitleColor;
      if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;

      document.querySelectorAll('.fs-weight-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.fsWeight, 10) === 800);
      });
      document.querySelectorAll('.chip-btn[data-fs-template]').forEach(c => {
        c.classList.toggle('active', c.dataset.fsTemplate === 'default');
      });
      document.querySelectorAll('.fs-sides-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.sides === 'all');
      });
      syncFsChips();
      render();
    });
  }

  // --- Text Controls ---
  enableTextCheck.addEventListener('change', (e) => {
    state.text.enabled = e.target.checked;
    textControlsSection.style.display = state.text.enabled ? 'block' : 'none';
    render();
  });

  textInput.addEventListener('input', (e) => {
    state.text.content = e.target.value;
    render();
  });

  fontSelect.addEventListener('change', (e) => {
    state.text.font = e.target.value;
    render();
  });

  fontSizeSlider.addEventListener('input', (e) => {
    state.text.size = parseInt(e.target.value, 10);
    fontSizeVal.textContent = `${state.text.size}px`;
    render();
  });

  textColorPicker.addEventListener('input', (e) => {
    state.text.color = e.target.value;
    render();
  });

  document.querySelectorAll('[data-text-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.text.color = dot.dataset.textColor;
      textColorPicker.value = state.text.color;
      render();
    });
  });

  // --- Text Background Box Controls ---
  textBgCheck.addEventListener('change', (e) => {
    state.text.bgEnabled = e.target.checked;
    textBgControlsGroup.style.display = state.text.bgEnabled ? 'block' : 'none';
    if (state.text.bgEnabled) {
      // 文字色と背景色が同じで見えなくなるのを防ぐ
      if (state.text.color.toLowerCase() === state.text.bgColor.toLowerCase()) {
        state.text.color = state.text.bgColor.toLowerCase() === '#ffffff' ? '#111111' : '#ffffff';
        textColorPicker.value = state.text.color;
      }
    }
    render();
  });

  textBgColorPicker.addEventListener('input', (e) => {
    state.text.bgColor = e.target.value;
    render();
  });

  document.querySelectorAll('[data-text-bg-color]').forEach(dot => {
    dot.addEventListener('click', () => {
      state.text.bgColor = dot.dataset.textBgColor;
      textBgColorPicker.value = state.text.bgColor;
      render();
    });
  });

  textPadXSlider.addEventListener('input', (e) => {
    state.text.padX = parseInt(e.target.value, 10);
    textPadXVal.textContent = state.text.padX <= 8 ? `${state.text.padX}px (ギリギリ)` : `${state.text.padX}px`;
    render();
  });

  textPadYSlider.addEventListener('input', (e) => {
    state.text.padY = parseInt(e.target.value, 10);
    textPadYVal.textContent = state.text.padY <= 4 ? `${state.text.padY}px (ギリギリ)` : `${state.text.padY}px`;
    render();
  });

  textBgRadiusSlider.addEventListener('input', (e) => {
    state.text.bgRadius = parseInt(e.target.value, 10);
    textBgRadiusVal.textContent = state.text.bgRadius === 0 ? '0px (完全な四角)' : `${state.text.bgRadius}px`;
    render();
  });

  // --- Date Formatting Helper ---
  function formatDate(d, fmt = 'eng') {
    if (!(d instanceof Date) || isNaN(d.getTime())) d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const m2 = String(month + 1).padStart(2, '0');
    const d2 = String(date).padStart(2, '0');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    switch (fmt) {
      case 'eng':
        return `${months[month]} ${date}, ${year}`;
      case 'dot':
        return `${year}.${m2}.${d2}`;
      case 'slash':
        return `${year}/${m2}/${d2}`;
      case 'film':
        return `'${String(year).slice(-2)} ${m2} ${d2}`;
      case 'jp':
        return `${year}年${month + 1}月${date}日`;
      default:
        return `${months[month]} ${date}, ${year}`;
    }
  }

  // --- Date Actions (Caption) ---
  if (todayDateBtn) {
    todayDateBtn.addEventListener('click', () => {
      state.selectedDate = new Date();
      const formatted = formatDate(state.selectedDate, state.dateFormat);
      textInput.value = formatted;
      state.text.content = formatted;
      render();
    });
  }

  if (calendarBtn && datePickerInput) {
    calendarBtn.addEventListener('click', () => {
      const d = state.selectedDate || new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      datePickerInput.value = `${y}-${m}-${day}`;
      if (typeof datePickerInput.showPicker === 'function') {
        datePickerInput.showPicker();
      } else {
        datePickerInput.click();
      }
    });

    datePickerInput.addEventListener('change', (e) => {
      if (!e.target.value) return;
      const parts = e.target.value.split('-');
      if (parts.length === 3) {
        state.selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const formatted = formatDate(state.selectedDate, state.dateFormat);
        textInput.value = formatted;
        state.text.content = formatted;
        render();
      }
    });
  }

  // Date Format Chips
  document.querySelectorAll('#dateFormatChips .chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#dateFormatChips .chip-btn').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.dateFormat = chip.dataset.dateFmt;
      const formatted = formatDate(state.selectedDate, state.dateFormat);
      textInput.value = formatted;
      state.text.content = formatted;
      render();
    });
  });

  // --- Date Actions for FS_2&3 Subtext ---
  if (fsTodayDateBtn) {
    fsTodayDateBtn.addEventListener('click', () => {
      const d = new Date();
      const formatted = formatDate(d, state.dateFormat);
      if (fsGradeInput) fsGradeInput.value = formatted;
      state.fsTextGrade = formatted;
      syncFsChips();
      render();
    });
  }

  if (fsCalendarBtn && fsDatePickerInput) {
    fsCalendarBtn.addEventListener('click', () => {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      fsDatePickerInput.value = `${y}-${m}-${day}`;
      if (typeof fsDatePickerInput.showPicker === 'function') {
        fsDatePickerInput.showPicker();
      } else {
        fsDatePickerInput.click();
      }
    });

    fsDatePickerInput.addEventListener('change', (e) => {
      if (!e.target.value) return;
      const parts = e.target.value.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const formatted = formatDate(d, state.dateFormat);
        if (fsGradeInput) fsGradeInput.value = formatted;
        state.fsTextGrade = formatted;
        syncFsChips();
        render();
      }
    });
  }

  // --- Reset All ---
  resetBtn.addEventListener('click', () => {
    if (confirm('すべての設定を初期状態にリセットしますか？')) {
      applyPreset('fs_2_3');
      applyFilterPreset('normal');
      resetImageTransform();
      render();
    }
  });

  // --- Mobile Drawer (Slide-Up Menu) Controls ---
  const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileMenuOpenBtn = document.getElementById('mobileMenuOpenBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const controlSidebar = document.getElementById('controlSidebar');
  const drawerResetBtn = document.getElementById('drawerResetBtn');
  const drawerHeader = document.getElementById('drawerHeader');

  const previewContainer = document.querySelector('.preview-container');

  // Ensure .canvas-wrapper always maintains exact 9:16 dimensions on iOS Safari & Mobile
  function updateCanvasWrapperSize() {
    if (!previewContainer || !canvasWrapper) return;
    const availW = previewContainer.clientWidth;
    const availH = previewContainer.clientHeight;
    if (availW <= 0 || availH <= 0) return;

    const targetRatio = 9 / 16;
    let h = Math.floor(availH);
    let w = Math.round(h * targetRatio);
    if (w > availW) {
      w = Math.floor(availW);
      h = Math.round(w / targetRatio);
    }
    canvasWrapper.style.width = `${w}px`;
    canvasWrapper.style.height = `${h}px`;
  }

  if (window.ResizeObserver && previewContainer) {
    const ro = new ResizeObserver(() => {
      updateCanvasWrapperSize();
    });
    ro.observe(previewContainer);
  }
  window.addEventListener('resize', updateCanvasWrapperSize);
  window.addEventListener('orientationchange', () => {
    setTimeout(updateCanvasWrapperSize, 100);
  });

  function openMobileMenu() {
    if (!controlSidebar) return;
    controlSidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    if (mobileMenuToggleBtn) mobileMenuToggleBtn.classList.add('active');
    if (mobileMenuOpenBtn) mobileMenuOpenBtn.style.opacity = '0';
    requestAnimationFrame(updateCanvasWrapperSize);
  }

  function closeMobileMenu() {
    if (!controlSidebar) return;
    controlSidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    if (mobileMenuToggleBtn) mobileMenuToggleBtn.classList.remove('active');
    if (mobileMenuOpenBtn) mobileMenuOpenBtn.style.opacity = '1';
    requestAnimationFrame(updateCanvasWrapperSize);
  }

  function toggleMobileMenu() {
    if (!controlSidebar) return;
    if (controlSidebar.classList.contains('mobile-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileMenuOpenBtn) {
    mobileMenuOpenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
  }

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  if (drawerResetBtn) {
    drawerResetBtn.addEventListener('click', () => {
      if (resetBtn) resetBtn.click();
    });
  }

  // Swipe-down to close on drawerHeader
  if (drawerHeader) {
    let startY = 0;
    drawerHeader.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    drawerHeader.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const diffY = currentY - startY;
      if (diffY > 60) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // --- Save to Camera Roll (iOS/Android) & Download Final 1080x1920 Story ---
  const saveCameraRollModal = document.getElementById('saveCameraRollModal');
  const saveModalImg = document.getElementById('saveModalImg');
  const closeSaveModalBtn = document.getElementById('closeSaveModalBtn');
  const shareSaveModalBtn = document.getElementById('shareSaveModalBtn');
  const fileDownloadModalBtn = document.getElementById('fileDownloadModalBtn');

  let lastGeneratedFile = null;
  let lastGeneratedDataUrl = '';
  let lastGeneratedFilename = '';

  function isMobileOrTouchDevice() {
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    return isIOS || isAndroid || window.matchMedia('(max-width: 860px)').matches;
  }

  function dataURLToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  function triggerFileDownload(dataUrl, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = dataUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function closeSaveModal() {
    if (saveCameraRollModal) {
      saveCameraRollModal.classList.add('hidden');
    }
  }

  if (closeSaveModalBtn) {
    closeSaveModalBtn.addEventListener('click', closeSaveModal);
  }

  if (saveCameraRollModal) {
    saveCameraRollModal.addEventListener('click', (e) => {
      if (e.target === saveCameraRollModal) {
        closeSaveModal();
      }
    });
  }

  if (shareSaveModalBtn) {
    shareSaveModalBtn.addEventListener('click', async () => {
      if (lastGeneratedFile && navigator.canShare && navigator.canShare({ files: [lastGeneratedFile] })) {
        try {
          await navigator.share({
            files: [lastGeneratedFile],
            title: 'StoryFrame Studio'
          });
          closeSaveModal();
        } catch (err) {
          // User canceled share sheet; keep modal open for long-press save
        }
      }
    });
  }

  if (fileDownloadModalBtn) {
    fileDownloadModalBtn.addEventListener('click', () => {
      if (lastGeneratedDataUrl && lastGeneratedFilename) {
        triggerFileDownload(lastGeneratedDataUrl, lastGeneratedFilename);
      }
    });
  }

  downloadBtn.addEventListener('click', async () => {
    // Re-render once to ensure fresh state
    render();

    const timestamp = new Date().toISOString().slice(0, 10);
    lastGeneratedFilename = `story-frame-${timestamp}.png`;
    lastGeneratedDataUrl = canvas.toDataURL('image/png');
    lastGeneratedFile = dataURLToFile(lastGeneratedDataUrl, lastGeneratedFilename);

    // On Smartphone / Tablet: Save to Camera Roll via Web Share API + Long-Press Image Modal
    if (isMobileOrTouchDevice()) {
      if (saveModalImg) {
        saveModalImg.src = lastGeneratedDataUrl;
      }
      const canWebShareFiles = !!(navigator.canShare && navigator.canShare({ files: [lastGeneratedFile] }));
      if (shareSaveModalBtn) {
        shareSaveModalBtn.style.display = canWebShareFiles ? 'inline-flex' : 'none';
      }
      if (saveCameraRollModal) {
        saveCameraRollModal.classList.remove('hidden');
      }

      if (canWebShareFiles) {
        try {
          await navigator.share({
            files: [lastGeneratedFile],
            title: 'StoryFrame Studio'
          });
          closeSaveModal();
        } catch (err) {
          // Keep modal open so user can long-press image -> "写真に保存"
        }
      }
      return;
    }

    // On Desktop (Mac / PC): Standard PNG download
    triggerFileDownload(lastGeneratedDataUrl, lastGeneratedFilename);
  });

  // --- Boot: Initialize immediately, then re-render when fonts load ---
  updateCanvasWrapperSize();
  applyPreset('fs_2_3');
  applyFilterPreset('normal');
  createDefaultSampleImage();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      render();
    }).catch(() => {
      // ignore font load errors
    });
  }
});
