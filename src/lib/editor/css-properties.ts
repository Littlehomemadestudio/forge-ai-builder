import type { CSSPropertyGroup } from './types'

export const CSS_PROPERTY_GROUPS: CSSPropertyGroup[] = [
  {
    name: 'Layout',
    icon: 'Layout',
    properties: [
      { name: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'inline-block', 'inline-flex', 'inline-grid', 'none'], default: 'block' },
      { name: 'position', label: 'Position', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], default: 'static' },
      { name: 'top', label: 'Top', type: 'number', unit: 'px', min: -500, max: 2000, step: 1 },
      { name: 'right', label: 'Right', type: 'number', unit: 'px', min: -500, max: 2000, step: 1 },
      { name: 'bottom', label: 'Bottom', type: 'number', unit: 'px', min: -500, max: 2000, step: 1 },
      { name: 'left', label: 'Left', type: 'number', unit: 'px', min: -500, max: 2000, step: 1 },
      { name: 'z-index', label: 'Z-Index', type: 'number', min: -10, max: 9999, step: 1 },
      { name: 'width', label: 'Width', type: 'text', default: 'auto' },
      { name: 'height', label: 'Height', type: 'text', default: 'auto' },
      { name: 'min-width', label: 'Min Width', type: 'text', default: '0' },
      { name: 'min-height', label: 'Min Height', type: 'text', default: '0' },
      { name: 'max-width', label: 'Max Width', type: 'text', default: 'none' },
      { name: 'max-height', label: 'Max Height', type: 'text', default: 'none' },
      { name: 'overflow', label: 'Overflow', type: 'select', options: ['visible', 'hidden', 'scroll', 'auto'], default: 'visible' },
      { name: 'overflow-x', label: 'Overflow X', type: 'select', options: ['visible', 'hidden', 'scroll', 'auto'], default: 'visible' },
      { name: 'overflow-y', label: 'Overflow Y', type: 'select', options: ['visible', 'hidden', 'scroll', 'auto'], default: 'visible' },
      { name: 'float', label: 'Float', type: 'select', options: ['none', 'left', 'right', 'inline-start', 'inline-end'], default: 'none' },
      { name: 'clear', label: 'Clear', type: 'select', options: ['none', 'left', 'right', 'both', 'inline-start', 'inline-end'], default: 'none' },
      { name: 'order', label: 'Order', type: 'number', min: -10, max: 100, step: 1, default: '0' },
      { name: 'flex-direction', label: 'Flex Direction', type: 'select', options: ['row', 'row-reverse', 'column', 'column-reverse'], default: 'row' },
      { name: 'flex-wrap', label: 'Flex Wrap', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'], default: 'nowrap' },
      { name: 'justify-content', label: 'Justify Content', type: 'select', options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'], default: 'flex-start' },
      { name: 'align-items', label: 'Align Items', type: 'select', options: ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'], default: 'stretch' },
      { name: 'align-self', label: 'Align Self', type: 'select', options: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'], default: 'auto' },
      { name: 'flex-grow', label: 'Flex Grow', type: 'number', min: 0, max: 10, step: 1, default: '0' },
      { name: 'flex-shrink', label: 'Flex Shrink', type: 'number', min: 0, max: 10, step: 1, default: '1' },
      { name: 'flex-basis', label: 'Flex Basis', type: 'text', default: 'auto' },
      { name: 'gap', label: 'Gap', type: 'text', default: '0px' },
      { name: 'row-gap', label: 'Row Gap', type: 'text', default: '0px' },
      { name: 'column-gap', label: 'Column Gap', type: 'text', default: '0px' },
      { name: 'grid-template-columns', label: 'Grid Columns', type: 'text', default: 'none' },
      { name: 'grid-template-rows', label: 'Grid Rows', type: 'text', default: 'none' },
      { name: 'grid-column', label: 'Grid Column', type: 'text', default: 'auto' },
      { name: 'grid-row', label: 'Grid Row', type: 'text', default: 'auto' },
      { name: 'object-fit', label: 'Object Fit', type: 'select', options: ['fill', 'contain', 'cover', 'none', 'scale-down'], default: 'fill' },
      { name: 'object-position', label: 'Object Position', type: 'text', default: 'center' },
    ]
  },
  {
    name: 'Spacing',
    icon: 'Maximize2',
    properties: [
      { name: 'margin', label: 'Margin', type: 'composite', subProperties: [
        { name: 'margin-top', label: 'Top', type: 'number', unit: 'px', min: -100, max: 500, step: 1, default: '0' },
        { name: 'margin-right', label: 'Right', type: 'number', unit: 'px', min: -100, max: 500, step: 1, default: '0' },
        { name: 'margin-bottom', label: 'Bottom', type: 'number', unit: 'px', min: -100, max: 500, step: 1, default: '0' },
        { name: 'margin-left', label: 'Left', type: 'number', unit: 'px', min: -100, max: 500, step: 1, default: '0' },
      ] },
      { name: 'padding', label: 'Padding', type: 'composite', subProperties: [
        { name: 'padding-top', label: 'Top', type: 'number', unit: 'px', min: 0, max: 500, step: 1, default: '0' },
        { name: 'padding-right', label: 'Right', type: 'number', unit: 'px', min: 0, max: 500, step: 1, default: '0' },
        { name: 'padding-bottom', label: 'Bottom', type: 'number', unit: 'px', min: 0, max: 500, step: 1, default: '0' },
        { name: 'padding-left', label: 'Left', type: 'number', unit: 'px', min: 0, max: 500, step: 1, default: '0' },
      ] },
    ]
  },
  {
    name: 'Typography',
    icon: 'Type',
    properties: [
      { name: 'font-family', label: 'Font Family', type: 'select', options: ['Inter', 'Geist', 'system-ui', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'monospace', 'serif', 'sans-serif'], default: 'system-ui' },
      { name: 'font-size', label: 'Font Size', type: 'slider', unit: 'px', min: 8, max: 120, step: 1, default: '16' },
      { name: 'font-weight', label: 'Font Weight', type: 'select', options: ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'bolder', 'lighter'], default: '400' },
      { name: 'font-style', label: 'Font Style', type: 'select', options: ['normal', 'italic', 'oblique'], default: 'normal' },
      { name: 'line-height', label: 'Line Height', type: 'text', default: '1.5' },
      { name: 'letter-spacing', label: 'Letter Spacing', type: 'slider', unit: 'px', min: -5, max: 20, step: 0.5, default: '0' },
      { name: 'word-spacing', label: 'Word Spacing', type: 'slider', unit: 'px', min: -5, max: 20, step: 0.5, default: '0' },
      { name: 'text-align', label: 'Text Align', type: 'select', options: ['left', 'center', 'right', 'justify', 'start', 'end'], default: 'left' },
      { name: 'text-decoration', label: 'Text Decoration', type: 'select', options: ['none', 'underline', 'overline', 'line-through'], default: 'none' },
      { name: 'text-transform', label: 'Text Transform', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'], default: 'none' },
      { name: 'text-indent', label: 'Text Indent', type: 'number', unit: 'px', min: 0, max: 200, step: 1, default: '0' },
      { name: 'text-shadow', label: 'Text Shadow', type: 'text', default: 'none' },
      { name: 'white-space', label: 'White Space', type: 'select', options: ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'], default: 'normal' },
      { name: 'word-break', label: 'Word Break', type: 'select', options: ['normal', 'break-all', 'keep-all', 'break-word'], default: 'normal' },
      { name: 'direction', label: 'Direction', type: 'select', options: ['ltr', 'rtl'], default: 'ltr' },
      { name: 'writing-mode', label: 'Writing Mode', type: 'select', options: ['horizontal-tb', 'vertical-rl', 'vertical-lr'], default: 'horizontal-tb' },
    ]
  },
  {
    name: 'Colors',
    icon: 'Palette',
    properties: [
      { name: 'color', label: 'Text Color', type: 'color', default: '#000000' },
      { name: 'background-color', label: 'Background Color', type: 'color', default: 'transparent' },
    ]
  },
  {
    name: 'Background',
    icon: 'Image',
    properties: [
      { name: 'background-image', label: 'Background Image', type: 'text', default: 'none' },
      { name: 'background-size', label: 'Background Size', type: 'select', options: ['auto', 'cover', 'contain', '100% 100%', '50% 50%'], default: 'auto' },
      { name: 'background-position', label: 'Background Position', type: 'select', options: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'], default: 'center' },
      { name: 'background-repeat', label: 'Background Repeat', type: 'select', options: ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'], default: 'repeat' },
      { name: 'background-attachment', label: 'Background Attachment', type: 'select', options: ['scroll', 'fixed', 'local'], default: 'scroll' },
      { name: 'background-clip', label: 'Background Clip', type: 'select', options: ['border-box', 'padding-box', 'content-box', 'text'], default: 'border-box' },
      { name: 'background-origin', label: 'Background Origin', type: 'select', options: ['border-box', 'padding-box', 'content-box'], default: 'padding-box' },
      { name: 'background-blend-mode', label: 'Blend Mode', type: 'select', options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'], default: 'normal' },
    ]
  },
  {
    name: 'Border',
    icon: 'Square',
    properties: [
      { name: 'border', label: 'Border', type: 'composite', subProperties: [
        { name: 'border-top-width', label: 'Top Width', type: 'number', unit: 'px', min: 0, max: 50, step: 1, default: '0' },
        { name: 'border-right-width', label: 'Right Width', type: 'number', unit: 'px', min: 0, max: 50, step: 1, default: '0' },
        { name: 'border-bottom-width', label: 'Bottom Width', type: 'number', unit: 'px', min: 0, max: 50, step: 1, default: '0' },
        { name: 'border-left-width', label: 'Left Width', type: 'number', unit: 'px', min: 0, max: 50, step: 1, default: '0' },
        { name: 'border-top-style', label: 'Top Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'], default: 'none' },
        { name: 'border-right-style', label: 'Right Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'], default: 'none' },
        { name: 'border-bottom-style', label: 'Bottom Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'], default: 'none' },
        { name: 'border-left-style', label: 'Left Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'], default: 'none' },
        { name: 'border-top-color', label: 'Top Color', type: 'color', default: '#000000' },
        { name: 'border-right-color', label: 'Right Color', type: 'color', default: '#000000' },
        { name: 'border-bottom-color', label: 'Bottom Color', type: 'color', default: '#000000' },
        { name: 'border-left-color', label: 'Left Color', type: 'color', default: '#000000' },
      ] },
      { name: 'border-radius', label: 'Border Radius', type: 'composite', subProperties: [
        { name: 'border-top-left-radius', label: 'Top-Left', type: 'number', unit: 'px', min: 0, max: 200, step: 1, default: '0' },
        { name: 'border-top-right-radius', label: 'Top-Right', type: 'number', unit: 'px', min: 0, max: 200, step: 1, default: '0' },
        { name: 'border-bottom-right-radius', label: 'Bottom-Right', type: 'number', unit: 'px', min: 0, max: 200, step: 1, default: '0' },
        { name: 'border-bottom-left-radius', label: 'Bottom-Left', type: 'number', unit: 'px', min: 0, max: 200, step: 1, default: '0' },
      ] },
      { name: 'outline', label: 'Outline', type: 'composite', subProperties: [
        { name: 'outline-width', label: 'Width', type: 'number', unit: 'px', min: 0, max: 20, step: 1, default: '0' },
        { name: 'outline-style', label: 'Style', type: 'select', options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge'], default: 'none' },
        { name: 'outline-color', label: 'Color', type: 'color', default: '#000000' },
        { name: 'outline-offset', label: 'Offset', type: 'number', unit: 'px', min: -10, max: 20, step: 1, default: '0' },
      ] },
    ]
  },
  {
    name: 'Effects',
    icon: 'Sparkles',
    properties: [
      { name: 'box-shadow', label: 'Box Shadow', type: 'text', default: 'none' },
      { name: 'text-shadow', label: 'Text Shadow', type: 'text', default: 'none' },
      { name: 'opacity', label: 'Opacity', type: 'slider', min: 0, max: 100, step: 1, default: '100' },
      { name: 'cursor', label: 'Cursor', type: 'select', options: ['auto', 'default', 'pointer', 'move', 'text', 'wait', 'help', 'crosshair', 'not-allowed', 'grab', 'grabbing', 'none'], default: 'auto' },
      { name: 'visibility', label: 'Visibility', type: 'select', options: ['visible', 'hidden', 'collapse'], default: 'visible' },
      { name: 'pointer-events', label: 'Pointer Events', type: 'select', options: ['auto', 'none', 'visiblePainted', 'visibleFill', 'visibleStroke', 'all'], default: 'auto' },
      { name: 'user-select', label: 'User Select', type: 'select', options: ['auto', 'none', 'text', 'all'], default: 'auto' },
      { name: 'mix-blend-mode', label: 'Mix Blend Mode', type: 'select', options: ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'], default: 'normal' },
    ]
  },
  {
    name: 'Transforms',
    icon: 'Move',
    properties: [
      { name: 'transform', label: 'Transform', type: 'text', default: 'none' },
      { name: 'transform-origin', label: 'Transform Origin', type: 'text', default: 'center' },
      { name: 'scale', label: 'Scale', type: 'slider', min: 0, max: 300, step: 5, default: '100' },
      { name: 'rotate', label: 'Rotate', type: 'slider', unit: 'deg', min: -360, max: 360, step: 1, default: '0' },
      { name: 'translateX', label: 'Translate X', type: 'slider', unit: 'px', min: -500, max: 500, step: 1, default: '0' },
      { name: 'translateY', label: 'Translate Y', type: 'slider', unit: 'px', min: -500, max: 500, step: 1, default: '0' },
      { name: 'skewX', label: 'Skew X', type: 'slider', unit: 'deg', min: -90, max: 90, step: 1, default: '0' },
      { name: 'skewY', label: 'Skew Y', type: 'slider', unit: 'deg', min: -90, max: 90, step: 1, default: '0' },
    ]
  },
  {
    name: 'Filters',
    icon: 'Wand2',
    properties: [
      { name: 'filter', label: 'Filter', type: 'text', default: 'none' },
      { name: 'backdrop-filter', label: 'Backdrop Filter', type: 'text', default: 'none' },
      { name: 'blur', label: 'Blur', type: 'slider', unit: 'px', min: 0, max: 50, step: 1, default: '0' },
      { name: 'brightness', label: 'Brightness', type: 'slider', unit: '%', min: 0, max: 200, step: 5, default: '100' },
      { name: 'contrast', label: 'Contrast', type: 'slider', unit: '%', min: 0, max: 200, step: 5, default: '100' },
      { name: 'grayscale', label: 'Grayscale', type: 'slider', unit: '%', min: 0, max: 100, step: 5, default: '0' },
      { name: 'hue-rotate', label: 'Hue Rotate', type: 'slider', unit: 'deg', min: 0, max: 360, step: 5, default: '0' },
      { name: 'invert', label: 'Invert', type: 'slider', unit: '%', min: 0, max: 100, step: 5, default: '0' },
      { name: 'saturate', label: 'Saturate', type: 'slider', unit: '%', min: 0, max: 200, step: 5, default: '100' },
      { name: 'sepia', label: 'Sepia', type: 'slider', unit: '%', min: 0, max: 100, step: 5, default: '0' },
      { name: 'drop-shadow', label: 'Drop Shadow', type: 'text', default: 'none' },
    ]
  },
  {
    name: 'Transition',
    icon: 'Zap',
    properties: [
      { name: 'transition', label: 'Transition', type: 'text', default: 'none' },
      { name: 'transition-property', label: 'Property', type: 'text', default: 'all' },
      { name: 'transition-duration', label: 'Duration', type: 'select', options: ['0s', '0.1s', '0.2s', '0.3s', '0.5s', '1s', '2s', '3s'], default: '0s' },
      { name: 'transition-timing-function', label: 'Timing', type: 'select', options: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier'], default: 'ease' },
      { name: 'transition-delay', label: 'Delay', type: 'select', options: ['0s', '0.1s', '0.2s', '0.5s', '1s', '2s'], default: '0s' },
    ]
  },
  {
    name: 'Animation',
    icon: 'Wand2',
    properties: [
      { name: 'animation', label: 'Animation', type: 'text', default: 'none' },
      { name: 'animation-name', label: 'Name', type: 'text', default: 'none' },
      { name: 'animation-duration', label: 'Duration', type: 'select', options: ['0.5s', '1s', '2s', '3s', '5s', '10s'], default: '1s' },
      { name: 'animation-timing-function', label: 'Timing', type: 'select', options: ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'], default: 'ease' },
      { name: 'animation-delay', label: 'Delay', type: 'select', options: ['0s', '0.5s', '1s', '2s', '3s'], default: '0s' },
      { name: 'animation-iteration-count', label: 'Iterations', type: 'text', default: '1' },
      { name: 'animation-direction', label: 'Direction', type: 'select', options: ['normal', 'reverse', 'alternate', 'alternate-reverse'], default: 'normal' },
      { name: 'animation-fill-mode', label: 'Fill Mode', type: 'select', options: ['none', 'forwards', 'backwards', 'both'], default: 'none' },
      { name: 'animation-play-state', label: 'Play State', type: 'select', options: ['running', 'paused'], default: 'running' },
    ]
  },
  {
    name: 'Table',
    icon: 'Grid3X3',
    properties: [
      { name: 'table-layout', label: 'Table Layout', type: 'select', options: ['auto', 'fixed'], default: 'auto' },
      { name: 'border-collapse', label: 'Border Collapse', type: 'select', options: ['separate', 'collapse'], default: 'separate' },
      { name: 'border-spacing', label: 'Border Spacing', type: 'text', default: '0' },
      { name: 'empty-cells', label: 'Empty Cells', type: 'select', options: ['show', 'hide'], default: 'show' },
    ]
  },
  {
    name: 'List',
    icon: 'List',
    properties: [
      { name: 'list-style-type', label: 'List Style Type', type: 'select', options: ['disc', 'circle', 'square', 'decimal', 'decimal-leading-zero', 'lower-roman', 'upper-roman', 'lower-alpha', 'upper-alpha', 'none'], default: 'disc' },
      { name: 'list-style-position', label: 'List Position', type: 'select', options: ['inside', 'outside'], default: 'outside' },
      { name: 'list-style-image', label: 'List Image', type: 'text', default: 'none' },
    ]
  },
  {
    name: 'SVG',
    icon: 'Circle',
    properties: [
      { name: 'fill', label: 'Fill', type: 'color', default: '#000000' },
      { name: 'stroke', label: 'Stroke', type: 'color', default: 'none' },
      { name: 'stroke-width', label: 'Stroke Width', type: 'number', unit: 'px', min: 0, max: 50, step: 1, default: '1' },
      { name: 'stroke-dasharray', label: 'Stroke Dasharray', type: 'text', default: 'none' },
    ]
  },
]
