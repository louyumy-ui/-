import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface SvgCopyButtonProps {
  targetId: string;
  className?: string;
  label?: string;
}

export const SvgCopyButton: React.FC<SvgCopyButtonProps> = ({ targetId, className, label = "复制 SVG 到 Figma" }) => {
  const [copied, setCopied] = React.useState(false);

  const getElementStyles = (el: HTMLElement | SVGElement) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    
    return {
      width: rect.width,
      height: rect.height,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fill: style.fill,
      stroke: style.stroke,
      strokeWidth: style.strokeWidth,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      borderColor: style.borderColor,
      opacity: style.opacity,
      display: style.display,
      visibility: style.visibility,
      paddingTop: parseFloat(style.paddingTop) || 0,
      paddingLeft: parseFloat(style.paddingLeft) || 0,
      paddingRight: parseFloat(style.paddingRight) || 0,
      paddingBottom: parseFloat(style.paddingBottom) || 0,
      textAlign: style.textAlign,
    };
  };

  const domToSvg = (element: Element, offsetX = 0, offsetY = 0): string => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
    
    const styles = getElementStyles(element);
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';

    const rect = element.getBoundingClientRect();
    const x = rect.left - offsetX;
    const y = rect.top - offsetY;

    let svgParts: string[] = [];

    // 1. 处理图标等原生 SVG
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const innerContent = Array.from(element.childNodes)
        .map(node => node instanceof Element ? node.outerHTML : '').join('');
      
      // 🌟 核心修正：从 <svg> 元素复制关键样式属性到 <g>，防止黑块 🌟
      const stroke = styles.stroke !== 'none' ? ` stroke="${styles.stroke}"` : '';
      const fill = styles.fill !== 'none' ? ` fill="${styles.fill}"` : '';
      const strokeWidth = styles.strokeWidth !== '0px' ? ` stroke-width="${styles.strokeWidth}"` : '';
      
      return `<g transform="translate(${x}, ${y})" data-figma-type="icon"${stroke}${fill}${strokeWidth}>${innerContent}</g>`;
    }

    // 2. 处理背景和边框 (捕获 HTMLElement 样式)
    if (element instanceof HTMLElement) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;

      if (hasBackground || hasBorder) {
        const rx = parseFloat(styles.borderRadius) || 0;
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? styles.borderWidth : '0';
        // 🌟 核心修正：背景矩形必须是该组的第一个元素，确保在底层 🌟
        svgParts.unshift(`<rect width="${styles.width}" height="${styles.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // 🌟 3. 新增：专门处理表单元素 (Input / Checkbox) 🌟
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // 3.1 处理 Checkbox / Radio
      if (element.type === 'checkbox' || element.type === 'radio') {
        const isChecked = (element as HTMLInputElement).checked;
        const boxSize = Math.min(rect.width, rect.height) || 16;
        // 画复选框的底色
        svgParts.push(`<rect x="0" y="${(rect.height - boxSize)/2}" width="${boxSize}" height="${boxSize}" fill="${isChecked ? '#2563eb' : '#ffffff'}" stroke="#cbd5e1" stroke-width="1.5" rx="${element.type === 'radio' ? '50%' : '4'}" />`);
        // 画打勾符号
        if (isChecked && element.type === 'checkbox') {
          svgParts.push(`<path d="M4 8l2.5 2.5 5.5-5.5" transform="translate(0, ${(rect.height - boxSize)/2})" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`);
        }
      } 
      // 3.2 处理文本输入框
      else {
        const text = element.value || element.placeholder;
        if (text) {
          const fontSize = parseFloat(styles.fontSize);
          const tx = styles.paddingLeft || 12;
          const ty = (styles.paddingTop || 8) + fontSize * 0.85; 
          const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
          // 输入框里的文字颜色，如果是 placeholder 往往较浅
          const textColor = element.value ? styles.color : '#94a3b8';
          svgParts.push(`<text x="${tx}" y="${ty}" fill="${textColor}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" dominant-baseline="alphabetic">${text}</text>`);
        }
      }
    }

    // 4. 处理普通文本内容
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim();
        const fontSize = parseFloat(styles.fontSize);
        let tx = styles.paddingLeft;
        let ty = styles.paddingTop + fontSize * 0.85; 
        
        if (styles.textAlign === 'center') tx = styles.width / 2;
        else if (styles.textAlign === 'right') tx = styles.width - styles.paddingRight;
        const textAnchor = styles.textAlign === 'center' ? 'middle' : (styles.textAlign === 'right' ? 'end' : 'start');
        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="${textAnchor}" dominant-baseline="alphabetic">${text}</text>`);
      }
    }

    // 5. 递归子节点
    Array.from(element.children).forEach(child => {
      svgParts.push(domToSvg(child, rect.left, rect.top));
    });

    const idAttr = element.id ? ` id="${element.id}"` : '';
    const classAttr = element.className && typeof element.className === 'string' ? ` class="${element.className.split(' ').slice(0, 3).join(' ')}"` : '';

    return `<g transform="translate(${x}, ${y})"${idAttr}${classAttr} data-tag="${element.tagName.toLowerCase()}">\n${svgParts.join('\n')}\n</g>`;
  };

  const copyAsSvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      const rect = element.getBoundingClientRect();
      const contentSvg = domToSvg(element, rect.left, rect.top);
      
      // 将 SVG 包裹在标准 XML 声明中
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white" fill-opacity="0" />
  ${contentSvg}
</svg>`.trim();

      // 修复：强制使用 text/html 写入，Figma 会进行深度解析
      if (navigator.clipboard && window.ClipboardItem) {
        const blobHtml = new Blob([svgContent], { type: 'text/html' });
        const blobText = new Blob([svgContent], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(svgContent);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <button
      onClick={copyAsSvg}
      data-svg-copy-ignore="true"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all rounded-lg border cursor-pointer z-50",
        copied 
          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
          : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "已复制矢量图层" : label}
    </button>
  );
};