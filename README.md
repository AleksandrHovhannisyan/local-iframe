# `local-iframe`

> Web component that allows you to render a fully local `<iframe>` using HTML templates.

## Table of Contents

- [Getting Started](#getting-started)
- [Example Usage](#example-usage)
  - [1. Child Template](#1-child-template)
  - [2. Template Attribute](#2-template-attribute)
  - [Custom iframe](#custom-iframe)
  - [Recommended Styling](#recommended-styling)
- [API](#api)
- [Use Cases](#use-cases)
- [Local Development](#local-development)

## Getting Started

You may either install and import the package:

```sh
npm install local-iframe
```

```js
import "local-iframe";
```

Or include it via CDN:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/local-iframe@1.1.0/index.js"
></script>
```

Then, render it in your document, and define all of the markup for the `iframe` inside a `<template>`:

```html
<local-iframe>
  <template>
    <h1>Hello from the iframe</h1>
    <script>
      console.log("Isolated scripts");
    </script>
    <style>
      /* This only affects the iframe */
      body {
        background-color: red;
      }
    </style>
  </template>
</local-iframe>
```

The component willy copy this template and render a fully local `iframe` with this exact HTML, including CSS and JavaScript, producing the following output:

```html
<local-iframe>
  <template></template>
  <iframe srcdoc="whatever html content you specified in the template"></iframe>
</local-iframe>
```

All styles and scripts will only affect elements within the iframe itself.

See [example usage](#example-usage).

## Example Usage

There are two ways to define the markup for your iframe:

1. Render a `<template>` as a child of `<local-iframe>`.
2. Render a `<template>` externally and reference it by ID.

### 1. Child Template

The simplest way to use `local-iframe` is to render a `<template>` as a child:

```html
<local-iframe description="Hello world demo of a local iframe">
  <template>
    <h1>Counter demo</h1>
    <button>Increment</button>
    <div>Count: <output>0</output></div>
    <script>
      const button = document.querySelector("button");
      const output = document.querySelector("output");
      button.addEventListener("click", () => {
        output.innerHTML = parseInt(output.innerHTML, 10) + 1;
      });
    </script>
    <style>
      button {
        padding: 8px;
        background-color: transparent;
      }
    </style>
  </template>
</local-iframe>
```

In this example, we render a counter inside an iframe and add some event listeners to make it interactive and some basic CSS to style it.

### 2. Template Attribute

Alternatively, you can define an external `<template>` and reference it via the `template` attribute, like so:

```html
<template id="my-template">
  <h1>Template</h1>
  <style>
    h1 {
      color: red;
    }
  </style>
</template>
<local-iframe
  template="my-template"
  description="External template demo"
></local-iframe>
```

If you change the `template` attribute, the underlying iframe will re-render with the new markup.

### Custom `iframe`

By default, `local-iframe` appends an `iframe` to its subtree:

```html
<local-iframe>
  <template></template>
  <!-- The component adds this automatically for you -->
  <iframe srcdoc="..."></iframe>
</local-iframe>
```

Optionally, you may render a custom `iframe`, and that will get used instead:

```html
<local-iframe>
  <template></template>
  <!-- We'll use this iframe instead of inserting a new one -->
  <iframe style="border: solid 1px red"></iframe>
</local-iframe>
```

### Recommended Styling

Frames will be initially empty until their content is hydrated. This can cause unwanted vertical layout shifts as the page loads. To fix this, you can reserve an explicit `height` on each frame with inline styles:

```html
<local-iframe style="height: 400px;"></local-iframe>
```

You will need to treat `local-iframe`s as block elements for this to work, preferably with [inline critical styles](https://web.dev/articles/extract-critical-css) in the head of your document:

```css
local-iframe {
  display: block;
}
```

You may also set an explicit width, although doing so is optional:

```html
<local-iframe style="width: 800px; height: 400px;"></local-iframe>
```

If you do choose to set an explicit width, make sure you also set a `max-width` to prevent horizontal overflow on narrower devices:

```diff
local-iframe {
  display: block;
+ max-width: 100%;
}
```

## API

| Attribute     | Type     | Description                                                                      |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| `template`    | `string` | The ID of the `<template>` element to use for the underlying `iframe`'s content. |
| `description` | `string` | A `title` to set on the underlying `iframe`, for improved accessibility.         |

## Use Cases

I wanted to be able to declaratively render fully local, isolated code demos in my tutorials, without embedding third-party Codepens/sandboxes and without creating separate pages for each code demo. This web component uses the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute to do just that.

> [!NOTE]
> This originally began as an Eleventy plugin: [eleventy-plugin-code-demo](github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).

## Local Development

1. Clone this repo.
2. Run `pnpm install` to install dev dependencies (Vite).
3. Run `pnpm run dev` to start the local dev server.
4. Open http://localhost:5173 in your browser.
