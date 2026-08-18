// utils/formatMessage.ts

/**
 * Cleans bot markdown and splits into paragraphs for rendering.
 * - Removes ** bold markers
 * - Removes * bullet/italic markers  
 * - Collapses extra whitespace
 * - Splits on double newlines into clean paragraphs
 */
export function formatMessageContent(content: any): string[] {
  // Normalize content to a plain string regardless of what the API returns
  let text: string;
  if (content === null || content === undefined) {
    return [];
  } else if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    // Some LLM APIs return content as [{type:'text', text:'...'}]
    text = content
      .map((block: any) =>
        typeof block === 'string' ? block : block?.text ?? block?.value ?? JSON.stringify(block)
      )
      .join('\n');
  } else if (typeof content === 'object') {
    text = content.text ?? content.value ?? content.message ?? JSON.stringify(content);
  } else {
    text = String(content);
  }

  if (!text.trim()) return [];

  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // remove **bold**
    .replace(/\*(.*?)\*/g, '$1')        // remove *italic*
    .replace(/^\s*[\*\-]\s+/gm, '• ')  // convert * or - bullets → •
    .replace(/\n{3,}/g, '\n\n')         // max 2 newlines
    .trim();

  // Split into paragraphs on double newline
  return cleaned
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}