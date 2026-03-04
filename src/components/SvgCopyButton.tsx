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

  const domToSvg = (element: Element, rootX: number, rootY: number): string => {
    if (!(element instanceof HTMLElement || element instanceof SVGElement)) return '';
    
    // 排除复制按钮自身，避免套娃
    if (element.hasAttribute('data-svg-copy-ignore')) return '';

    const styles = getElementStyles(element);
    if (styles.visibility === 'hidden' || styles.opacity === '0' || styles.display === 'none') return '';

    const rect = element.getBoundingClientRect();
    const x = rect.left - rootX;
    const y = rect.top - rootY;

    let svgParts: string[] = [];

    // 处理图标等原生 SVG
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      const innerContent = Array.from(element.childNodes)
        .map(node => {
          if (node instanceof Element) {
            return node.outerHTML;
          }
          return '';
        })
        .join('');
      
      const viewBox = element.getAttribute('viewBox') || `0 0 ${styles.width} ${styles.height}`;
      return `<g transform="translate(${x}, ${y})" data-figma-type="icon">
        <svg width="${styles.width}" height="${styles.height}" viewBox="${viewBox}" fill="none" stroke="${styles.stroke}" stroke-width="${styles.strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          ${innerContent}
        </svg>
      </g>`;
    }

    // 处理背景和边框 (转换成 rect)
    if (element instanceof HTMLElement) {
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasBorder = parseFloat(styles.borderWidth) > 0;

      if (hasBackground || hasBorder) {
        const rx = parseFloat(styles.borderRadius) || 0;
        const fill = hasBackground ? styles.backgroundColor : 'none';
        const stroke = hasBorder ? styles.borderColor : 'none';
        const strokeWidth = hasBorder ? styles.borderWidth : '0';
        
        svgParts.push(`<rect width="${styles.width}" height="${styles.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" fill-opacity="${styles.opacity}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // 处理文本内容 (使用 Range API 获取精确位置)
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim();
        
        const range = document.createRange();
        range.selectNodeContents(node);
        const textRect = range.getBoundingClientRect();
        
        const tx = textRect.left - rootX;
        const ty = textRect.top - rootY + (textRect.height * 0.8); 

        const textAnchor = styles.textAlign === 'center' ? 'middle' : (styles.textAlign === 'right' ? 'end' : 'start');
        const finalX = styles.textAlign === 'center' ? tx + textRect.width / 2 : (styles.textAlign === 'right' ? tx + textRect.width : tx);
        
        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        
        svgParts.push(`<text x="${finalX}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="${textAnchor}" dominant-baseline="alphabetic">${text}</text>`);
      }
    }

    // 处理 Input/Textarea 的值
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const text = element.value;
      if (text) {
        const fontSize = parseFloat(styles.fontSize);
        const tx = x + styles.paddingLeft;
        const ty = y + styles.paddingTop + fontSize * 0.8;
        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" dominant-baseline="alphabetic">${text}</text>`);
      }
    }

    // 递归子节点 (保持 rootX, rootY 不变，实现扁平化坐标系，对 Figma 更友好)
    Array.from(element.children).forEach(child => {
      svgParts.push(domToSvg(child, rootX, rootY));
    });

    const idAttr = element.id ? ` id="${element.id}"` : '';
    const classAttr = element.className && typeof element.className === 'string' ? ` class="${element.className.split(' ').slice(0, 3).join(' ')}"` : '';

    // 扁平化处理：不再使用嵌套的 transform，直接在子元素中使用绝对坐标
    return `<g${idAttr}${classAttr} data-tag="${element.tagName.toLowerCase()}">\n${svgParts.join('\n')}\n</g>`;
  };

  const copyAsSvg = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      const rect = element.getBoundingClientRect();
      const contentSvg = domToSvg(element, rect.left, rect.top);
      
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white" fill-opacity="0" />
  ${contentSvg}
</svg>`.trim();

      // 【核心修复区】：强制使用 text/html 协议写入剪贴板，这是 Figma 识别图层的命门！
      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([svgContent], { type: 'text/html' });
        const textBlob = new Blob([svgContent], { type: 'text/plain' });
        
        const item = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        });
        
        await navigator.clipboard.write([item]);
      } else {
        // 兼容不支持 ClipboardItem 的老浏览器
        const textArea = document.createElement("textarea");
        textArea.value = svgContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG:', err);
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