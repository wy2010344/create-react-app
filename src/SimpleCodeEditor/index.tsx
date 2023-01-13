/* global require */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Editor from './ClassEditor';
import dedent from 'dedent';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import styled from 'styled-components';
import HookEditor from './HookEditor';

// import doesn't seem to work properly with parcel for jsx
// eslint-disable-next-line import/no-commonjs
require('prismjs/components/prism-jsx');

export default function App() {
  const [code, setCode] = useState(dedent`
    import React from "react";
    import ReactDOM from "react-dom";
    function App() {
      return (
        <h1>Hello world</h1>
      );
    }
    ReactDOM.render(<App />, document.getElementById("root"));
    `)
  return (
    <Container>
      <div className="container__content">
        <h1>参考来源 react-simple-code-editor</h1>
        <p>A simple no-frills code editor with syntax highlighting.</p>
        <a
          className="button"
          href="https://github.com/react-simple-code-editor/react-simple-code-editor"
        >
          GitHub
        </a>
        <div className="container_editor_area">
          <Editor
            placeholder="Type some code…"
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.jsx!, 'jsx')}
            padding={10}
            className="container__editor"
            tabSize={2} />
          <HookEditor
            containerProps={{
              className: "container__editor"
            }}
            tabSize={2}
            onValueChange={e => {
              setCode(e)
            }}
            textareaProps={{
              value: code
            }}
            insertSpaces
            highlight={(code) => highlight(code, languages.jsx!, 'jsx')}
          />
        </div>
        <div>原理:背部一个textarea,与前面的pre格式一致</div>
      </div>
    </Container>
  );
}


const Container = styled.main`
font-family: 'Fira code', 'Fira Mono', Consolas, Menlo, Courier, monospace;
font-size: 14px;
line-height: 1.5;
margin: 0;
padding: 0;
/* App */
display: flex;
align-items: center;
justify-content: center;
height: 100%;
width: 100%;

.container__content {
  width: 440px;
  max-width: 100%;
  padding: 10px;
  text-align: center;
}

.container_editor_area {
  tab-size: 4ch;
  max-height: 400px;
  overflow: auto;
  margin: 1.67em 0;
}

.container__editor {
  font-size: 12px;
  font-variant-ligatures: common-ligatures;
  background-color: #fafafa;
  border-radius: 3px;
}

.container__editor textarea {
  outline: 0;
}

.button {
  display: inline-block;
  padding: 0 6px;
  text-decoration: none;
  background: #000;
  color: #fff;
}

.button:hover {
  background: linear-gradient(45deg, #E42B66, #E2433F);
}

/* Syntax highlighting */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #90a4ae;
}
.token.punctuation {
  color: #9e9e9e;
}
.namespace {
  opacity: 0.7;
}
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #e91e63;
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #4caf50;
}
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #795548;
}
.token.atrule,
.token.attr-value,
.token.keyword {
  color: #3f51b5;
}
.token.function {
  color: #f44336;
}
.token.regex,
.token.important,
.token.variable {
  color: #ff9800;
}
.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}
.token.entity {
  cursor: help;
}
`