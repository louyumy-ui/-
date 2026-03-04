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

    // Special handling for SVG elements (icons)
    if (element instanceof SVGElement && element.tagName.toLowerCase() === 'svg') {
      // Clone the SVG content but adjust its position
      const innerContent = Array.from(element.childNodes)
        .map(node => {
          if (node instanceof Element) {
            return node.outerHTML;
          }
          return '';
        })
        .join('');
      
      return `<g transform="translate(${x}, ${y})" data-figma-type="icon">${innerContent}</g>`;
    }

    // Background Rect for HTMLElements
    if (element instanceof HTMLElement) {
      if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
        const rx = parseFloat(styles.borderRadius) || 0;
        svgParts.push(`<rect width="${styles.width}" height="${styles.height}" fill="${styles.backgroundColor}" rx="${rx}" fill-opacity="${styles.opacity}" />`);
      }

      // Border
      if (parseFloat(styles.borderWidth) > 0) {
        const rx = parseFloat(styles.borderRadius) || 0;
        svgParts.push(`<rect width="${styles.width}" height="${styles.height}" fill="none" stroke="${styles.borderColor}" stroke-width="${styles.borderWidth}" rx="${rx}" stroke-opacity="${styles.opacity}" />`);
      }
    }

    // Text Content
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        const text = node.textContent.trim();
        const fontSize = parseFloat(styles.fontSize);
        const tx = styles.paddingLeft;
        const ty = styles.paddingTop + fontSize * 0.85; // Better baseline approximation for Figma
        
        svgParts.push(`<text x="${tx}" y="${ty}" fill="${styles.color}" font-family="${styles.fontFamily}" font-size="${styles.fontSize}" font-weight="${styles.fontWeight}" dominant-baseline="alphabetic">${text}</text>`);
      }
    }

    // Children
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
      
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${rect.width}" height="${rect.height}" viewBox="0 0 ${rect.width} ${rect.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="white" fill-opacity="0" />
  ${contentSvg}
</svg>`.trim();

      // For Figma, it's often better to wrap in an extra layer or ensure it's a valid standalone SVG string
      const fullBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      
      if (navigator.clipboard && navigator.clipboard.write) {
        // Try writing as both text and blob if possible, but text is usually enough for Figma to recognize as SVG
        await navigator.clipboard.writeText(svgContent);
      } else {
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
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all rounded-lg border",
        copied 
          ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
          : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm",
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "已复制矢量图" : label}
    </button>
  );
};
