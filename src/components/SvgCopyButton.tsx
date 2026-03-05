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

    // 🌟 修复 1：完美处理 SVG 图标（防止黑块，保留 viewBox）
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      // 深度克隆节点，防止修改原网页
      const clone = element.cloneNode(true) as SVGElement;
      
      // 强制将父级的真实颜色赋给图标的 stroke/fill，Figma 才能识别
      const actualColor = styles.color || '#000000';
      const currentStroke = clone.getAttribute('stroke');
      const currentFill = clone.getAttribute('fill');
      
      if (!currentStroke || currentStroke === 'currentColor') clone.setAttribute('stroke', actualColor);
      if (currentFill === 'currentColor') clone.setAttribute('fill', actualColor);
      
      // 清除 class，防止 Figma 混淆
      clone.removeAttribute('class');
      clone.setAttribute('width', rect.width.toString());
      clone.setAttribute('height', rect.height.toString());

      // 嵌套 <svg> 在 Figma 中是完美支持的，能保留原图标的 viewBox 比例
      return `<g transform="translate(${x}, ${y})" data-figma-type="icon">${clone.outerHTML}</g>`;
    }

    // 处理背景和边框 (背景矩形必须在最底层)
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

    // 专门处理表单元素 (Input / Checkbox)
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element.type === 'checkbox' || element.type === 'radio') {
        const isChecked = (element as HTMLInputElement).checked;
        const boxSize = Math.min(rect.width, rect.height) || 16;
        svgParts.push(`<rect x="0" y="${(rect.height - boxSize)/2}" width="${boxSize}" height="${boxSize}" fill="${isChecked ? '#2563eb' : '#ffffff'}" stroke="#cbd5e1" stroke-width="1.5" rx="${element.type === 'radio' ? '50%' : '4'}" />`);
        if (isChecked && element.type === 'checkbox') {
          svgParts.push(`<path d="M4 8l2.5 2.5 5.5-5.5" transform="translate(0, ${(rect.height - boxSize)/2})" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`);
        }
      } else {
        const text = element.value || element.placeholder;
        if (text) {
          const fontSize = parseFloat(styles.fontSize);
          const tx = 12; // 默认左侧内边距
          const ty = (rect.height / 2) + (fontSize * 0.35); // 绝对垂直居中算法
          const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
          const textColor = element.value ? styles.color : '#94a3b8';
          
          // 处理 HTML 特殊字符
          const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          svgParts.push(`<text x="${tx}" y="${ty}" fill="${textColor}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="start">${safeText}</text>`);
        }
      }
    }

    // 🌟 修复 2：使用 Range API 获取文字的绝对物理坐标（无视 Flexbox/Grid 干扰）
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim().replace(/\s+/g, ' '); // 将多个空格合并
        if (!text) continue;

        // 转义特殊字符，防止破坏 SVG 结构
        const safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const fontSize = parseFloat(styles.fontSize);
        
        // 【核心魔法】通过创建选取范围，获取文字节点的真实尺寸和位置
        const range = document.createRange();
        range.selectNodeContents(node);
        const textRect = range.getBoundingClientRect();

        let tx = 0;
        let ty = 0;

        if (textRect.width > 0) {
          // 直接计算文字相对于当前元素的绝对偏移
          tx = textRect.left - rect.left;
          ty = textRect.top - rect.top + fontSize * 0.8; // 0.8 是通用字体的基线修正值
        }

        const safeFontFamily = styles.fontFamily.includes('"') ? styles.fontFamily : `"${styles.fontFamily}"`;
        
        // 既然我们获取了真实的左边缘位置，text-anchor 必须为 start，完美还原所有居中/右对齐
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family='${safeFontFamily}' font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" text-anchor="start">${safeText}</text>`);
      }
    }

    // 递归子节点
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
      
      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white" fill-opacity="0" />
  ${contentSvg}
</svg>`.trim();

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
