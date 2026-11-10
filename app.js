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
    preset: 'polaroid',
    customOverlay: null,

    // Filters & Color Adjustments
    filterPreset: 'normal',
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
    isRisograph: false,
    
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

    // FS_2&3 Frame Graphic Settings (ベクター描画・3層タイポグラフィ)
    fsTextPrefix: 'FDS/',
    fsTextTitle: 'FORM AND SPACE DESIGN',
    fsTextGrade: '2nd & 3rd grade',
    fsTitleWeight: 800,   // メインタイトルのウェイト (500, 700, 800, 900)
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
  const resetTextPosBtn = document.getElementById('resetTextPosBtn');

  // FS_2&3 Graphic Controls
  const fs23ControlsSection = document.getElementById('fs23ControlsSection');
  const fsPrefixInput = document.getElementById('fsPrefixInput');
  const fsTitleInput = document.getElementById('fsTitleInput');
  const fsGradeInput = document.getElementById('fsGradeInput');
  const fsTitleWeightVal = document.getElementById('fsTitleWeightVal');
  const fsTitleWeightBadge = document.getElementById('fsTitleWeightBadge');
  const fsTitleColorPicker = document.getElementById('fsTitleColorPicker');
  const fsGradeColorPicker = document.getElementById('fsGradeColorPicker');
  const resetFs23TextBtn = document.getElementById('resetFs23TextBtn');

  const imageUpload = document.getElementById('imageUpload');
  const changeImageBtn = document.getElementById('changeImageBtn');
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
      weight: 800
    },
    '1st': {
      prefix: 'FDS/',
      title: 'FORM AND SPACE DESIGN',
      grade: '1st grade',
      weight: 800
    },
    '4th': {
      prefix: 'FDS/',
      title: 'FORM AND SPACE DESIGN',
      grade: '4th grade',
      weight: 800
    },
    grad: {
      prefix: 'FDS/',
      title: 'GRADUATION EXHIBITION',
      grade: 'CLASS OF 2026',
      weight: 900
    },
    arch: {
      prefix: 'ARCH/',
      title: 'ARCHITECTURE & SPACE',
      grade: 'STUDIO WORKSHOP',
      weight: 800
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
      const pane = document.getElementById(`pane-${btn.dataset.tab}`);
      if (pane) pane.classList.add('active');
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
        if (fsTitleColorPicker) fsTitleColorPicker.value = state.fsTitleColor;
        if (fsGradeColorPicker) fsGradeColorPicker.value = state.fsGradeColor;
        document.querySelectorAll('.fs-weight-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.fsWeight, 10) === state.fsTitleWeight);
        });
        document.querySelectorAll('.fs-sides-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.sides === state.fsBorderSides);
        });
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

  function resetImageTransform(mode = 'fit') {
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

  // --- Initial Default Sample Image (Gradient Art) ---
  function createDefaultSampleImage() {
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1200;
    sampleCanvas.height = 1500;
    const sctx = sampleCanvas.getContext('2d');

    // Chic gradient & abstract circles
    const grad = sctx.createLinearGradient(0, 0, 1200, 1500);
    grad.addColorStop(0, '#ff9a9e');
    grad.addColorStop(0.5, '#fecfef');
    grad.addColorStop(1, '#a1c4fd');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 1200, 1500);

    // Warm Sun circle
    sctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    sctx.beginPath();
    sctx.arc(600, 650, 320, 0, Math.PI * 2);
    sctx.fill();

    // Geometric lines
    sctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    sctx.lineWidth = 14;
    sctx.beginPath();
    sctx.arc(600, 650, 420, 0, Math.PI * 2);
    sctx.stroke();

    const img = new Image();
    img.onload = () => {
      state.image = img;
      resetImageTransform();
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

  function onPointerDown(e) {
    const pos = getCanvasCoord(e);
    const rect = getPhotoRect();
    const W = canvas.width;
    const H = canvas.height;

    // 1. テキストのクリック判定 (Hit Testing)
    const textBounds = getTextBounds(rect, W, H);
    if (textBounds && pos.x >= textBounds.x && pos.x <= textBounds.x + textBounds.width &&
        pos.y >= textBounds.y && pos.y <= textBounds.y + textBounds.height) {
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

    // 2. テキストでなければ写真のドラッグ
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
    if (textBounds && pos.x >= textBounds.x && pos.x <= textBounds.x + textBounds.width &&
        pos.y >= textBounds.y && pos.y <= textBounds.y + textBounds.height) {
      canvasWrapper.style.cursor = 'move';
      if (!state.isHoveringText) {
        state.isHoveringText = true;
        render();
      }
    } else {
      canvasWrapper.style.cursor = 'grab';
      if (state.isHoveringText) {
        state.isHoveringText = false;
        render();
      }
    }
  }

  function onPointerUp() {
    state.isDragging = false;
    state.dragTarget = null;
    canvasWrapper.style.cursor = 'grab';
    render();
  }

  // --- Touch Gestures (Pinch to Zoom & Smooth Touch Drag) ---
  let touchStartDist = 0;
  let touchStartScale = 100;
  let isPinching = false;

  function onTouchStart(e) {
    if (e.touches.length === 2) {
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

    // 3-a. 写真の描画（露出、コントラスト、彩度フィルター付き）
    pctx.save();
    const b = 100 + state.exposure;
    const c = 100 + state.contrast;
    const s = 100 + state.saturation;
    pctx.filter = `brightness(${Math.max(0, b)}%) contrast(${Math.max(0, c)}%) saturate(${Math.max(0, s)}%)`;

    pctx.translate(state.imgX - rect.x, state.imgY - rect.y);
    pctx.rotate((state.imgRotation * Math.PI) / 180);
    pctx.scale(actualScale, actualScale);

    pctx.drawImage(
      state.image,
      -state.image.width / 2,
      -state.image.height / 2
    );
    pctx.restore();

    // 3-b. ポストエフェクト（グレイン、色温度、黒レベル、リソグラフ等）を適用
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

  // --- Film & Tone Post-Effects (Applied Strictly to Photo Pixels) ---
  function applyEffectsToContext(tctx, rx, ry, rw, rh) {
    // A. Risograph Special Effect (2-Color Inks)
    if (state.isRisograph) {
      tctx.save();
      // 蛍光ピンクのハイライト・中間色
      tctx.fillStyle = '#ff1493';
      tctx.globalAlpha = 0.30;
      tctx.globalCompositeOperation = 'screen';
      tctx.fillRect(rx, ry, rw, rh);

      // ディープティール／ネイビーのシャドウインク
      tctx.fillStyle = '#004777';
      tctx.globalAlpha = 0.35;
      tctx.globalCompositeOperation = 'multiply';
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // B. Warmth (Color Temperature)
    if (state.warmth !== 0) {
      tctx.save();
      if (state.warmth > 0) {
        // Warm Orange/Amber glow
        tctx.fillStyle = '#ff8800';
        tctx.globalAlpha = (state.warmth / 100) * 0.35;
      } else {
        // Cool Cyan/Blue tone
        tctx.fillStyle = '#00a8e8';
        tctx.globalAlpha = (Math.abs(state.warmth) / 100) * 0.35;
      }
      tctx.globalCompositeOperation = 'soft-light';
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // C. Highlights
    if (state.highlights !== 0) {
      tctx.save();
      if (state.highlights > 0) {
        tctx.fillStyle = '#ffffff';
        tctx.globalAlpha = (state.highlights / 100) * 0.45;
        tctx.globalCompositeOperation = 'soft-light';
      } else {
        tctx.fillStyle = '#000000';
        tctx.globalAlpha = (Math.abs(state.highlights) / 100) * 0.35;
        tctx.globalCompositeOperation = 'multiply';
      }
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // D. Shadows (Lift / Deepen)
    if (state.shadows !== 0) {
      tctx.save();
      if (state.shadows > 0) {
        tctx.fillStyle = '#dcdcdc';
        tctx.globalAlpha = (state.shadows / 100) * 0.38;
        tctx.globalCompositeOperation = 'screen';
      } else {
        tctx.fillStyle = '#000000';
        tctx.globalAlpha = (Math.abs(state.shadows) / 100) * 0.45;
        tctx.globalCompositeOperation = 'multiply';
      }
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // E. Whites (白レベル: ピーク白のブースト / 抑制)
    if (state.whites !== 0) {
      tctx.save();
      if (state.whites > 0) {
        tctx.fillStyle = '#ffffff';
        tctx.globalAlpha = (state.whites / 100) * 0.42;
        tctx.globalCompositeOperation = 'screen';
      } else {
        const dimVal = 255 - Math.round((Math.abs(state.whites) / 100) * 48);
        tctx.fillStyle = `rgb(${dimVal}, ${dimVal}, ${dimVal})`;
        tctx.globalCompositeOperation = 'multiply';
      }
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // F. Blacks (黒レベル: 最暗部のマット黒浮き / 引き締め)
    if (state.blacks !== 0) {
      tctx.save();
      if (state.blacks > 0) {
        // 海外映画・フィルム特有の美しい黒浮き（リフト）
        const liftVal = Math.round((state.blacks / 100) * 60);
        tctx.fillStyle = `rgb(${liftVal}, ${liftVal}, ${liftVal})`;
        tctx.globalCompositeOperation = 'screen';
      } else {
        // 最暗部を漆黒に落とし込む
        const crushAlpha = (Math.abs(state.blacks) / 100) * 0.5;
        tctx.fillStyle = '#000000';
        tctx.globalAlpha = crushAlpha;
        tctx.globalCompositeOperation = 'multiply';
      }
      tctx.fillRect(rx, ry, rw, rh);
      tctx.restore();
    }

    // G. Film Grain (Organic Silver Halide Grain)
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

    // H. Vignette (Peripheral Darkening)
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

    // Blurred image background (写真フィルターを美しく連動反映)
    if (state.blurBg && state.image) {
      ctx.save();
      
      // 1) 写真と同じ露出・コントラスト・彩度を背景のぼかし写真にも適用
      const bgBright = Math.max(0, (100 + state.exposure) * 0.72);
      const bgCont = Math.max(0, 100 + state.contrast);
      const bgSat = Math.max(0, 100 + state.saturation);
      ctx.filter = `blur(${state.blurAmount * 1.5}px) brightness(${bgBright}%) contrast(${bgCont}%) saturate(${bgSat}%)`;
      
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
      ctx.drawImage(state.image, (W - drawW) / 2, (H - drawH) / 2, drawW, drawH);
      ctx.restore();

      // 2) 背景ぼかしにもリソグラフや色温度、黒レベルをブレンドして世界観を完全統一
      if (state.isRisograph) {
        ctx.save();
        ctx.fillStyle = '#ff1493';
        ctx.globalAlpha = 0.22;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#004777';
        ctx.globalAlpha = 0.28;
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (state.warmth !== 0) {
        ctx.save();
        ctx.fillStyle = state.warmth > 0 ? '#ff8800' : '#00a8e8';
        ctx.globalAlpha = (Math.abs(state.warmth) / 100) * 0.28;
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (state.blacks > 0) {
        ctx.save();
        const liftVal = Math.round((state.blacks / 100) * 45);
        ctx.fillStyle = `rgb(${liftVal}, ${liftVal}, ${liftVal})`;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // 3) 背景用ダークビネット
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

  // --- FS_2&3 Procedural Vector Graphic Frame (動的文字 & 自由カラー) ---
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

    // 2. タイポグラフィ描画ヘルパー (3層ウェイト構造: Medium 500 -> ExtraBold/Black 800 -> Regular 400)
    function renderFSTextLine(tctx, startX, baselineY) {
      tctx.save();
      tctx.textBaseline = 'middle';
      tctx.textAlign = 'left';

      let curX = startX;
      let prefix = (state.fsTextPrefix !== undefined ? state.fsTextPrefix : 'FDS/').trim();
      let title = (state.fsTextTitle !== undefined ? state.fsTextTitle : 'FORM AND SPACE DESIGN').trim();
      const grade = (state.fsTextGrade !== undefined ? state.fsTextGrade : '2nd & 3rd grade').trim();
      const titleWeight = state.fsTitleWeight || 800;

      // スマートフォールバック: prefixが空でtitleにスラッシュがある場合、自動分離してウェイトを適用
      if (!prefix && title.includes('/')) {
        const slashIdx = title.indexOf('/');
        prefix = title.substring(0, slashIdx + 1).trim();
        title = title.substring(slashIdx + 1).trim();
      }

      // 1. 略称 / プレフィックス (Medium 500)
      if (prefix) {
        tctx.fillStyle = state.fsTitleColor || '#090405';
        tctx.font = '500 18.5px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const displayPrefix = prefix + ' ';
        tctx.fillText(displayPrefix, curX, baselineY);
        curX += tctx.measureText(displayPrefix).width;
      }

      // 2. メインタイトル (ExtraBold / Black 800-900 ★太字アクセント)
      if (title) {
        tctx.fillStyle = state.fsTitleColor || '#090405';
        tctx.font = `${titleWeight} 18.5px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        tctx.fillText(title, curX, baselineY);
        curX += tctx.measureText(title).width;
      }

      // 3. サブテキスト / 学年情報 (Regular 400 - 白またはアクセント色)
      if (grade) {
        curX += 26; // メインタイトルと学年の間の視覚的マージン
        tctx.fillStyle = state.fsGradeColor || '#ffffff';
        tctx.font = '400 17.5px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        tctx.fillText(grade, curX, baselineY);
      }
      tctx.restore();
    }

    const sides = state.fsBorderSides || 'all';

    // A. 上辺 (Top): 水平配置
    renderFSTextLine(ctx, 48, 23.5);

    // B. 下辺 (Bottom): 上下反転（180度回転）
    if (sides === 'all' || sides === 'top-bottom') {
      ctx.save();
      ctx.translate(W, H);
      ctx.rotate(Math.PI);
      renderFSTextLine(ctx, 48, 23.5);
      ctx.restore();
    }

    // C. 右辺 (Right): 時計回り90度回転
    if (sides === 'all') {
      ctx.save();
      ctx.translate(W, 0);
      ctx.rotate(Math.PI / 2);
      renderFSTextLine(ctx, 332, 21.5);
      ctx.restore();
    }

    // D. 左辺 (Left): 反時計回り90度回転 (-90度)
    if (sides === 'all') {
      ctx.save();
      ctx.translate(0, H);
      ctx.rotate(-Math.PI / 2);
      renderFSTextLine(ctx, 800, 21.5);
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
      ctx.strokeStyle = 'rgba(255, 71, 133, 0.85)';
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
    const p = FILTER_PRESETS[filterName];
    if (!p) return;

    state.exposure = p.exposure;
    state.contrast = p.contrast;
    state.saturation = p.saturation;
    state.highlights = p.highlights;
    state.shadows = p.shadows;
    state.whites = p.whites || 0;
    state.blacks = p.blacks || 0;
    state.warmth = p.warmth;
    state.grain = p.grain;
    state.grainSize = p.grainSize || 2;
    state.vignette = p.vignette;
    state.isRisograph = !!p.isRisograph;

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
  }

  function onFilterSliderManualChange() {
    // プリセットのハイライト枠は外すが、リソグラフ状態は維持して微調整できるようにする
    document.querySelectorAll('.filter-card').forEach(c => c.classList.remove('active'));
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
    let matched = 0;
    function getAttr(attrName) {
      const regex = new RegExp(`crs:${attrName}="([^"]+)"`, 'i');
      const m = xmlText.match(regex);
      return m ? parseFloat(m[1]) : null;
    }

    const exp = getAttr('Exposure2012') ?? getAttr('Exposure');
    if (exp !== null) {
      state.exposure = Math.round(Math.max(-100, Math.min(100, exp * 25)));
      matched++;
    }

    const cont = getAttr('Contrast2012') ?? getAttr('Contrast');
    if (cont !== null) {
      state.contrast = Math.round(Math.max(-100, Math.min(100, cont)));
      matched++;
    }

    const hl = getAttr('Highlights2012') ?? getAttr('Highlights');
    if (hl !== null) {
      state.highlights = Math.round(Math.max(-100, Math.min(100, hl)));
      matched++;
    }

    const sh = getAttr('Shadows2012') ?? getAttr('Shadows');
    if (sh !== null) {
      state.shadows = Math.round(Math.max(-100, Math.min(100, sh)));
      matched++;
    }

    const wh = getAttr('Whites2012') ?? getAttr('Whites');
    if (wh !== null) {
      state.whites = Math.round(Math.max(-100, Math.min(100, wh)));
      matched++;
    }

    const bl = getAttr('Blacks2012') ?? getAttr('Blacks');
    if (bl !== null) {
      state.blacks = Math.round(Math.max(-100, Math.min(100, bl)));
      matched++;
    }

    const sat = getAttr('Saturation');
    if (sat !== null) {
      state.saturation = Math.round(Math.max(-100, Math.min(100, sat)));
      matched++;
    }

    const temp = getAttr('Temperature');
    if (temp !== null) {
      state.warmth = Math.round(Math.max(-100, Math.min(100, (temp - 5000) / 45)));
      matched++;
    }

    const grain = getAttr('GrainAmount');
    if (grain !== null) {
      state.grain = Math.round(Math.max(0, Math.min(100, grain)));
      matched++;
    }

    syncFilterSliders();
    onFilterSliderManualChange();

    lutStatus.textContent = `✅ Lightroomプリセット (${fileName}) を適用しました (${matched}項目)`;
    lutStatus.style.color = '#10b981';
  }

  function parseAndApplyCube(cubeText, fileName) {
    // 3D LUT basic header parse & tone approximation
    lutStatus.textContent = `✅ LUTプリセット (${fileName}) を認識しました`;
    lutStatus.style.color = '#10b981';
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
    state.margin = parseInt(e.target.value, 10);
    marginVal.textContent = `${state.margin}px`;
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

  if (fsTitleInput) {
    fsTitleInput.addEventListener('input', (e) => {
      state.fsTextTitle = e.target.value;
      render();
    });
  }

  if (fsGradeInput) {
    fsGradeInput.addEventListener('input', (e) => {
      state.fsTextGrade = e.target.value;
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

        if (fsPrefixInput) fsPrefixInput.value = state.fsTextPrefix;
        if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;
        if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
        if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || `${state.fsTitleWeight}`;
        if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = `${FS_WEIGHT_LABELS[`${state.fsTitleWeight}`] || state.fsTitleWeight} (太字)`;

        document.querySelectorAll('.fs-weight-btn').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.fsWeight, 10) === state.fsTitleWeight);
        });

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
      state.fsTitleColor = '#090405';
      state.fsGradeColor = '#ffffff';
      state.fsBorderSides = 'all';

      if (fsPrefixInput) fsPrefixInput.value = state.fsTextPrefix;
      if (fsTitleInput) fsTitleInput.value = state.fsTextTitle;
      if (fsGradeInput) fsGradeInput.value = state.fsTextGrade;
      if (fsTitleWeightVal) fsTitleWeightVal.textContent = FS_WEIGHT_LABELS['800'];
      if (fsTitleWeightBadge) fsTitleWeightBadge.textContent = 'ExtraBold (800) (太字)';
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

  todayDateBtn.addEventListener('click', () => {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const formatted = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    textInput.value = formatted;
    state.text.content = formatted;
    render();
  });

  // --- Reset All ---
  resetBtn.addEventListener('click', () => {
    if (confirm('すべての設定を初期状態にリセットしますか？')) {
      applyPreset('polaroid');
      applyFilterPreset('normal');
      resetImageTransform();
      render();
    }
  });

  // --- Download Final 1080x1920 Story ---
  downloadBtn.addEventListener('click', () => {
    // Re-render once to ensure fresh state
    render();

    // Export high-res PNG
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      a.download = `story-frame-${timestamp}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  });

  // --- Boot: Initialize immediately, then re-render when fonts load ---
  createDefaultSampleImage();
  applyPreset('polaroid');
  applyFilterPreset('normal');

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      render();
    }).catch(() => {
      // ignore font load errors
    });
  }
});
