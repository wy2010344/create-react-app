import React, { useRef, useState } from 'react'

type Record = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

type History = {
  stack: (Record & { timestamp: number })[];
  offset: number;
};

const isWindows =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /Win/i.test(navigator.platform);
const isMacLike =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

const KEYCODE_Y = 89;
const KEYCODE_Z = 90;
const KEYCODE_M = 77;
const KEYCODE_PARENS = 57;
const KEYCODE_BRACKETS = 219;
const KEYCODE_QUOTE = 222;
const KEYCODE_BACK_QUOTE = 192;

const HISTORY_LIMIT = 100;
const HISTORY_TIME_GAP = 3000;

const _getLines = (text: string, position: number) =>
  text.substring(0, position).split('\n');

export default function useHistory({
  _input,
  onKeyDown,
  insertSpaces,
  ignoreTabKey,
  tabSize,
  onValueChange
}: {
  _input: React.RefObject<HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  tabSize: number;
  insertSpaces?: boolean;
  ignoreTabKey?: boolean;
  onValueChange: (value: string) => void;
}) {

  const [capture, setCapture] = useState(true)
  const _history = useRef<History>({
    stack: [],
    offset: -1,
  }).current
  const _recordChange = (record: Record, overwrite: boolean = false) => {
    const { stack, offset } = _history;

    if (stack.length && offset > -1) {
      // When something updates, drop the redo operations
      _history.stack = stack.slice(0, offset + 1);

      // Limit the number of operations to 100
      const count = _history.stack.length;

      if (count > HISTORY_LIMIT) {
        const extras = count - HISTORY_LIMIT;

        _history.stack = stack.slice(extras, count);
        _history.offset = Math.max(_history.offset - extras, 0);
      }
    }

    const timestamp = Date.now();

    if (overwrite) {
      const last = _history.stack[_history.offset];

      if (last && timestamp - last.timestamp < HISTORY_TIME_GAP) {
        // A previous entry exists and was in short interval

        // Match the last word in the line
        const re = /[^a-z0-9]([a-z0-9]+)$/i;

        // Get the previous line
        const previous = _getLines(last.value, last.selectionStart)
          .pop()
          ?.match(re);

        // Get the current line
        const current = _getLines(record.value, record.selectionStart)
          .pop()
          ?.match(re);

        if (previous?.[1] && current?.[1]?.startsWith(previous[1])) {
          // The last word of the previous line and current line match
          // Overwrite previous entry so that undo will remove whole word
          _history.stack[_history.offset] = { ...record, timestamp };

          return;
        }
      }
    }

    // Add the new operation to the stack
    _history.stack.push({ ...record, timestamp });
    _history.offset++;
  };

  const _handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // const { tabSize, insertSpaces, ignoreTabKey, onKeyDown } = this.props;

    if (onKeyDown) {
      onKeyDown(e);

      if (e.defaultPrevented) {
        return;
      }
    }

    if (e.key === 'Escape') {
      e.currentTarget.blur();
    }

    const { value, selectionStart, selectionEnd } = e.currentTarget;
    const tabCharacter = (insertSpaces ? ' ' : '\t').repeat(tabSize);

    if (e.key === 'Tab' && !ignoreTabKey && capture) {
      // Prevent focus change
      e.preventDefault();

      if (e.shiftKey) {
        // Unindent selected lines
        const linesBeforeCaret = _getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = _getLines(value, selectionEnd).length - 1;
        const nextValue = value
          .split('\n')
          .map((line, i) => {
            if (
              i >= startLine &&
              i <= endLine &&
              line.startsWith(tabCharacter)
            ) {
              return line.substring(tabCharacter.length);
            }

            return line;
          })
          .join('\n');

        if (value !== nextValue) {
          const startLineText = linesBeforeCaret[startLine];

          _applyEdits({
            value: nextValue,
            // Move the start cursor if first line in selection was modified
            // It was modified only if it started with a tab
            selectionStart: startLineText?.startsWith(tabCharacter)
              ? selectionStart - tabCharacter.length
              : selectionStart,
            // Move the end cursor by total number of characters removed
            selectionEnd: selectionEnd - (value.length - nextValue.length),
          });
        }
      } else if (selectionStart !== selectionEnd) {
        // Indent selected lines
        const linesBeforeCaret = _getLines(value, selectionStart);
        const startLine = linesBeforeCaret.length - 1;
        const endLine = _getLines(value, selectionEnd).length - 1;
        const startLineText = linesBeforeCaret[startLine];

        _applyEdits({
          value: value
            .split('\n')
            .map((line, i) => {
              if (i >= startLine && i <= endLine) {
                return tabCharacter + line;
              }

              return line;
            })
            .join('\n'),
          // Move the start cursor by number of characters added in first line of selection
          // Don't move it if it there was no text before cursor
          selectionStart:
            startLineText && /\S/.test(startLineText)
              ? selectionStart + tabCharacter.length
              : selectionStart,
          // Move the end cursor by total number of characters added
          selectionEnd:
            selectionEnd + tabCharacter.length * (endLine - startLine + 1),
        });
      } else {
        const updatedSelection = selectionStart + tabCharacter.length;

        _applyEdits({
          // Insert tab character at caret
          value:
            value.substring(0, selectionStart) +
            tabCharacter +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (e.key === 'Backspace') {
      const hasSelection = selectionStart !== selectionEnd;
      const textBeforeCaret = value.substring(0, selectionStart);

      if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
        // Prevent default delete behaviour
        e.preventDefault();

        const updatedSelection = selectionStart - tabCharacter.length;

        _applyEdits({
          // Remove tab character at caret
          value:
            value.substring(0, selectionStart - tabCharacter.length) +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection,
        });
      }
    } else if (e.key === 'Enter') {
      // Ignore selections
      if (selectionStart === selectionEnd) {
        // Get the current line
        const line = _getLines(value, selectionStart).pop();
        const matches = line?.match(/^\s+/);

        if (matches?.[0]) {
          e.preventDefault();

          // Preserve indentation on inserting a new line
          const indent = '\n' + matches[0];
          const updatedSelection = selectionStart + indent.length;

          _applyEdits({
            // Insert indentation character at caret
            value:
              value.substring(0, selectionStart) +
              indent +
              value.substring(selectionEnd),
            // Update caret position
            selectionStart: updatedSelection,
            selectionEnd: updatedSelection,
          });
        }
      }
    } else if (
      e.keyCode === KEYCODE_PARENS ||
      e.keyCode === KEYCODE_BRACKETS ||
      e.keyCode === KEYCODE_QUOTE ||
      e.keyCode === KEYCODE_BACK_QUOTE
    ) {
      let chars;

      if (e.keyCode === KEYCODE_PARENS && e.shiftKey) {
        chars = ['(', ')'];
      } else if (e.keyCode === KEYCODE_BRACKETS) {
        if (e.shiftKey) {
          chars = ['{', '}'];
        } else {
          chars = ['[', ']'];
        }
      } else if (e.keyCode === KEYCODE_QUOTE) {
        if (e.shiftKey) {
          chars = ['"', '"'];
        } else {
          chars = ["'", "'"];
        }
      } else if (e.keyCode === KEYCODE_BACK_QUOTE && !e.shiftKey) {
        chars = ['`', '`'];
      }

      // If text is selected, wrap them in the characters
      if (selectionStart !== selectionEnd && chars) {
        e.preventDefault();

        _applyEdits({
          value:
            value.substring(0, selectionStart) +
            chars[0] +
            value.substring(selectionStart, selectionEnd) +
            chars[1] +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart,
          selectionEnd: selectionEnd + 2,
        });
      }
    } else if (
      (isMacLike
        ? // Trigger undo with ⌘+Z on Mac
        e.metaKey && e.keyCode === KEYCODE_Z
        : // Trigger undo with Ctrl+Z on other platforms
        e.ctrlKey && e.keyCode === KEYCODE_Z) &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();

      _undoEdit();
    } else if (
      (isMacLike
        ? // Trigger redo with ⌘+Shift+Z on Mac
        e.metaKey && e.keyCode === KEYCODE_Z && e.shiftKey
        : isWindows
          ? // Trigger redo with Ctrl+Y on Windows
          e.ctrlKey && e.keyCode === KEYCODE_Y
          : // Trigger redo with Ctrl+Shift+Z on other platforms
          e.ctrlKey && e.keyCode === KEYCODE_Z && e.shiftKey) &&
      !e.altKey
    ) {
      e.preventDefault();

      _redoEdit();
    } else if (
      e.keyCode === KEYCODE_M &&
      e.ctrlKey &&
      (isMacLike ? e.shiftKey : true)
    ) {
      e.preventDefault();
      // Toggle capturing tab key so users can focus away
      setCapture(v => !v)
    }
  };
  const _undoEdit = () => {
    const { stack, offset } = _history;

    // Get the previous edit
    const record = stack[offset - 1];

    if (record) {
      // Apply the changes and update the offset
      _updateInput(record);
      _history.offset = Math.max(offset - 1, 0);
    }
  };

  const _redoEdit = () => {
    const { stack, offset } = _history;

    // Get the next edit
    const record = stack[offset + 1];

    if (record) {
      // Apply the changes and update the offset
      _updateInput(record);
      _history.offset = Math.min(offset + 1, stack.length - 1);
    }
  };
  const _applyEdits = (record: Record) => {
    // Save last selection state
    const input = _input.current;
    const last = _history.stack[_history.offset];

    if (last && input) {
      _history.stack[_history.offset] = {
        ...last,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd,
      };
    }

    // Save the changes
    _recordChange(record);
    _updateInput(record);
  };

  const _updateInput = (record: Record) => {
    const input = _input.current;

    if (!input) return;

    // Update values and selection state
    input.value = record.value;
    input.selectionStart = record.selectionStart;
    input.selectionEnd = record.selectionEnd;

    onValueChange(record.value);
  };

  return {
    _handleKeyDown,
    _recordChange
  }
}
