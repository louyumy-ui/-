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
    
    // 排除复制按钮自身
    if (element.hasAttribute('data-svg-copy-ignore')) return '';

    const styles = getElementStyles(element);
    // 必须确保表头（thead）不因为默认的 visibility 判定被跳过
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';

    const rect = element.getBoundingClientRect();
    // 关键：计算相对于父容器的绝对位移
    const x = rect.left - offsetX;
    const y = rect.top - offsetY;

    let svgParts: string[] = [];

    // 处理图标等原生 SVG
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const innerContent = Array.from(element.childNodes)
        .map(node => node instanceof Element ? node.outerHTML : '')
        .join('');
      
      const viewBox = element.getAttribute('viewBox') || `0 0 ${styles.width} ${styles.height}`;
      return `<g transform="translate(${x}, ${y})" data-figma-type="icon">
        <svg width="${styles.width}" height="${styles.height}" viewBox="${viewBox}" fill="none" stroke="${styles.stroke}" stroke-width="${styles.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          ${innerContent}
        </svg>
      </g>`;
    }

    // 处理背景/边框 (确保 capture 到 thead/th 的背景色)
    if (element instanceof HTMLElement) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;
      const isTableElement = ['THEAD', 'TH', 'TR', 'TD', 'TABLE'].includes(element.tagName);

      if (hasBackground || hasBorder || isTableElement) {
        const rx = parseFloat(styles.borderRadius) || 0;
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? styles.borderWidth : '0';
        
        if (fill !== 'none' || stroke !== 'none' || isTableElement) {
          svgParts.push(`<rect width="${rect.width}" height="${rect.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
        }
      }
    }

    // 关键优化：处理文字内容（针对表头文本对齐）
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim();
        const fontSize = parseFloat(styles.fontSize);
        
        // 表格单元格（th/td）通常有内边距，需要在此校准
        let tx = styles.paddingLeft;
        let ty = styles.paddingTop + fontSize * 0.8; 
        
        const textAnchor = styles.textAlign === 'center' ? 'middle' : (styles.textAlign === 'right' ? 'end' : 'start');
        if (textAnchor === 'middle') tx = rect.width / 2;
        if (textAnchor === 'end') tx = rect.width - styles.paddingRight;

        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="${textAnchor}" dominant-baseline="hanging">${text}</text>`);
      }
    }

    // 处理 Input/Textarea 的值
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const text = element.value;
      if (text) {
        const fontSize = parseFloat(styles.fontSize);
        const tx = styles.paddingLeft;
        const ty = styles.paddingTop + fontSize * 0.8;
        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" dominant-baseline="hanging">${text}</text>`);
      }
    }

    // 递归子节点：确保从 thead 穿透到 tr 和 th
    Array.from(element.children).forEach(child => {
      svgParts.push(domToSvg(child, rect.left, rect.top));
    });

    const idAttr = element.id ? ` id="${element.id}"` : '';
    const classAttr = element.className && typeof element.className === 'string' ? ` class="${element.className.split(' ').slice(0, 3).join(' ')}"` : '';

    return `<g transform="translate(${x}, ${y})"${idAttr}${classAttr} data-tag="${element.tagName.toLowerCase()}">${svgParts.join('')}</g>`;
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