import React, { useEffect, useRef } from 'react'
import PureEditorView from './PureEditorView'
import useHistory from './useHistory'

export default function HookEditor({
  highlight,
  insertSpaces,
  tabSize = 2,
  ignoreTabKey,
  onValueChange,
  textareaProps = {},
  ...args
}: {
  insertSpaces?: boolean
  tabSize?: number
  ignoreTabKey?: boolean
  onValueChange(v: string): void
  highlight: (value: string) => string
  //container的属性
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>  //pre的属性
  preClassName?: string;
}) {
  //const highlighted = highlight(value);
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  useEffect(() => {
    preRef.current!.innerHTML = highlight(textareaProps.value + '')
  }, [textareaProps.value])
  const { _handleKeyDown, _recordChange } = useHistory({
    _input: inputRef,
    onKeyDown: textareaProps.onKeyDown,
    insertSpaces,
    ignoreTabKey,
    tabSize,
    onValueChange
  })
  textareaProps.onKeyDown = _handleKeyDown
  textareaProps.onChange = e => {
    const { value, selectionStart, selectionEnd } = e.currentTarget;

    _recordChange(
      {
        value,
        selectionStart,
        selectionEnd,
      },
      true
    );
    onValueChange(value);
  }
  return (
    <PureEditorView
      {...args}
      textareaProps={textareaProps}
      padding={10}
      textareaRef={inputRef}
      preRef={preRef}
    />
  )
}
