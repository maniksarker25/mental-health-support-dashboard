import React, { useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es2021/jodit.min.css';
import { useTheme } from '../../contexts/ThemeContext';

interface JoditRichTextProps {
  value: string;
  onChange: (html: string) => void;
  height?: number;
  placeholder?: string;
}

/**
 * Jodit WYSIWYG wrapper. Emits clean semantic HTML that the mobile app renders
 * through react-native-render-html, so pasted styling is always stripped.
 */
export function JoditRichText({
  value,
  onChange,
  height = 440,
  placeholder = 'Start writing…'
}: JoditRichTextProps) {
  const { theme } = useTheme();
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height,
      placeholder,
      theme: theme === 'dark' ? 'dark' : 'default',
      toolbarAdaptive: false,
      toolbarSticky: false,
      statusbar: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html',
      cleanHTML: {
        fillEmptyParagraph: false,
        removeEmptyElements: true
      },
      uploader: { insertImageAsBase64URI: true },
      buttons: [
      'paragraph',
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'link',
      'brush',
      '|',
      'align',
      'hr',
      '|',
      'undo',
      'redo',
      'eraser',
      '|',
      'source',
      'preview']

    }),
    [height, placeholder, theme]
  );

  return (
    <div className="jodit-shell">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onChange={(html: string) => onChange(html)}
        onBlur={(html: string) => onChange(html)} />
      
    </div>);

}