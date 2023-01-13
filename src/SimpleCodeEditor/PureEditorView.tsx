import React from 'react'

type Padding<T> = T | { top?: T; right?: T; bottom?: T; left?: T };

type Props = {
  // onValueChange: (value: string) => void;
  //highlight: (value: string) => string | React.ReactNode;
  // tabSize: number;
  // insertSpaces?: boolean;
  // ignoreTabKey?: boolean;
  padding?: Padding<number | string>;
  //container的属性
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  //textarea的属性
  textareaRef?: React.Ref<HTMLTextAreaElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  //pre的属性
  preClassName?: string;
  preRef?: React.Ref<HTMLPreElement>
};

const className = 'npm__react-simple-code-editor__textarea';

const cssText = /* CSS */ `
/**
 * Reset the text fill color so that placeholder is visible
 */
.${className}:empty {
  -webkit-text-fill-color: inherit !important;
}

/**
 * Hack to apply on some CSS on IE10 and IE11
 */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /**
    * IE doesn't support '-webkit-text-fill-color'
    * So we use 'color: transparent' to make the text transparent on IE
    * Unlike other browsers, it doesn't affect caret color in IE
    */
  .${className} {
    color: transparent !important;
  }

  .${className}::selection {
    background-color: #accef7 !important;
    color: transparent !important;
  }
}
`;
const PureEditorView = React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>) => {
  const {
    padding = 0,
    textareaProps = {},
    textareaRef,
    preClassName,
    preRef,
    containerProps = {},
  } = props;

  const contentStyle = typeof (padding) == 'object' ? {
    paddingTop: padding.top,
    paddingRight: padding.right,
    paddingLeft: padding.left,
    paddingBottom: padding.bottom
  } : {
    paddingTop: padding,
    paddingRight: padding,
    paddingBottom: padding,
    paddingLeft: padding,
  };
  return (
    <div ref={ref} {...containerProps} style={{ ...styles.container, ...containerProps.style }}>
      <textarea
        ref={textareaRef}
        style={{
          ...styles.editor,
          ...styles.textarea,
          ...contentStyle,
        }}
        {...textareaProps}
        className={
          className + (textareaProps.className || '')
        }
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        data-gramm={false}
      />
      <pre
        ref={preRef}
        className={preClassName}
        aria-hidden="true"
        style={{ ...styles.editor, ...styles.highlight, ...contentStyle }}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
    </div>
  );
})
export default PureEditorView


const styles = {
  container: {
    position: 'relative',
    textAlign: 'left',
    boxSizing: 'border-box',
    padding: 0,
    overflow: 'hidden',
  },
  textarea: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    resize: 'none',
    color: 'inherit',
    overflow: 'hidden',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    WebkitTextFillColor: 'transparent',
  },
  highlight: {
    position: 'relative',
    pointerEvents: 'none',
  },
  editor: {
    margin: 0,
    border: 0,
    background: 'none',
    boxSizing: 'inherit',
    display: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariantLigatures: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    tabSize: 'inherit',
    textIndent: 'inherit',
    textRendering: 'inherit',
    textTransform: 'inherit',
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  },
} as const;