# `local-iframe` <!-- omit in toc -->

> Web component that allows you to render local code sandboxes using iframes and HTML templates.

## Table of Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [Example Usage](#example-usage)
  - [Rendering the `iframe` Content](#rendering-the-iframe-content)
    - [Option 1: Child `<template>`](#option-1-child-template)
    - [Option 2: `template` Attribute](#option-2-template-attribute)
  - [Providing a Custom `iframe`](#providing-a-custom-iframe)
  - [Advanced: Overriding `iframe.srcdoc`](#advanced-overriding-iframesrcdoc)
  - [Recommended Styling](#recommended-styling)
- [API](#api)
  - [Attributes and Properties](#attributes-and-properties)
  - [Methods](#methods)
- [Local Development](#local-development)

## Getting Started

You may either install and import the package:

```sh
npm install local-iframe
```

```js
// Option 1: simplest, auto-registers as <local-iframe>
import "local-iframe";

// Option 2: import the class, register it yourself, do whatever you want
import { LocalIframe } from "local-iframe/LocalIframe";
window.customElements.define("code-sandbox", LocalIframe);
```

Or include it via CDN as an ES Module:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/local-iframe@2.0.2/+esm"
></script>
```

Then, render it in your document, and define all of the markup for the `iframe` inside a `<template>`. Here's a simple counter demo:

```html
<local-iframe>
  <template>
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

`local-iframe` will copy that inner template and render a fully local `iframe` with this exact HTML, including CSS and JavaScript, producing the following output:

```html
<local-iframe>
  <template><!-- omitted for brevity --></template>
  <iframe
    style="height: 100%; width: 100%; max-width: 100%;"
    srcdoc='&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;meta charset="utf-8"&gt;&lt;title&gt;&lt;/title&gt;&lt;/head&gt;&lt;body&gt;
    &lt;button&gt;Increment&lt;/button&gt;
    &lt;div&gt;Count: &lt;output&gt;0&lt;/output&gt;&lt;/div&gt;
    &lt;script&gt;
      const button = document.querySelector("button");
      const output = document.querySelector("output");
      button.addEventListener("click", () =&gt; {
        output.innerHTML = parseInt(output.innerHTML, 10) + 1;
      });
    &lt;/script&gt;
    &lt;style&gt;
      button {
        padding: 8px;
        background-color: transparent;
      }
    &lt;/style&gt;
  &lt;/body&gt;&lt;/html&gt;'
  ></iframe
></local-iframe>
```

All styles and scripts will only affect elements within the iframe itself.

See [example usage](#example-usage).

## Use Cases

When writing web development tutorials, I sometimes want to allow my readers to interact with code demos or see some output. It's easy to do this with a service like Codepen, but I don't like the idea of having to maintain my code demos outside my blog on a third-party website and then embedding them in my Markdown, which often loads a lot of extra JavaScript that I don't need.

Instead, `local-iframe` uses the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute to create a fully self-contained `iframe` based on whatever code you give it, right there in your page. What you see is what you get.

> [!NOTE]
> This originally began as an Eleventy plugin: [eleventy-plugin-code-demo](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).

> [!TIP]
> See also: ["Building HTML, CSS, and JS code preview using iframe's srcdoc attribute"](https://mionskowski.pl/posts/iframe-code-preview/) by Maciej Mionskowski, which is what originally inspired me to poke around and see how far I could take this idea.

## Example Usage

### Rendering the `iframe` Content

There are two ways to define the markup for your iframe:

1. Render a `<template>` as a child of `<local-iframe>`.
2. Render a `<template>` elsewhere in the DOM and reference it by ID.

#### Option 1: Child `<template>`

As we've already seen, the simplest way to use `local-iframe` is to render a `<template>` as a child:

```html
<local-iframe description="Counter demo">
  <template>
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

#### Option 2: `template` Attribute

Alternatively, you can define a `<template>` elsewhere in the DOM and reference it by ID with the `template` attribute, like so:

```html
<!-- This is what we want to render in the iframe -->
<template id="my-template">
  <h1>Template</h1>
  <style>
    h1 {
      color: red;
    }
  </style>
</template>
<!-- Reference the ID of the template above with the `template` attribute -->
<local-iframe
  template="my-template"
  description="External template demo"
></local-iframe>
```

If you change the `template` attribute, the underlying iframe will re-render with the new markup.

### Providing a Custom `iframe`

By default, `local-iframe` appends an `iframe` to its subtree if one does not already exist:

```html
<local-iframe>
  <template></template>
  <!-- The component adds this automatically for you -->
  <iframe srcdoc="..."></iframe>
</local-iframe>
```

Optionally, you may provide a custom `iframe` as a child, and that will get used instead:

```html
<local-iframe>
  <template></template>
  <!-- We'll use this iframe instead of inserting a new one -->
  <iframe style="border: solid 1px red"></iframe>
</local-iframe>
```

This allows you to set custom attributes on the `iframe` yourself, without having to forward them via a bloated API.

### Advanced: Overriding `iframe.srcdoc`

By default, `LocalIframe` renders an inner `iframe` whose `srcdoc` is the following barebones HTML document:

```js
_render(templateHtml) {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${this.description}</title>
  </head>
  <body>${templateHtml}</body>
  </html>`;
}
```

However, if you want to render a custom document that will be shared by all iframes, you can:

1. Subclass `LocalIframe`,
2. Override the `_render` method, and
3. Register it as a new custom element.

Like this:

```js
import { LocalIframe } from 'local-iframe/LocalIframe';

class CodeDemo extends LocalIframe {
  _render(templateHtml) {
    return `<!DOCTYPE html>
    <html>
    <head><meta charset="utf-8">
      <title>${this.description}</title>
      <style>body { background-color: red }</style>
    </head>
    <body>
      ${templateHtml}
      <p>Brought to you by CodeDemo</p>
    </body></html>`;
  }
}

window.customElements.define("code-demo", CodeDemo);
```

This way, you don't need to duplicate the shared markup across all of your `<template>`s.

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

### Attributes and Properties

| Attribute     | Type     | Description                                                                      |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| `template`    | `string` | The ID of the `<template>` element to use for the underlying `iframe`'s content. |
| `description` | `string` | A `title` to set on the underlying `iframe`, for improved accessibility.         |

### Methods

| Method    | Type                       | Description                                                                                                                                                                                                      |
| --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_render` | `(html: string) => string` | Method on `LocalIframe` that takes the incoming template HTML and returns an HTML string to set on the underlying `iframe.srcdoc` attribute. You can override this method in subclasses to define your own HTML. |

## Local Development

1. Clone this repo.
2. Run `pnpm install` to install dev dependencies (Vite).
3. Run `pnpm run dev` to start the local dev server.
4. Open http://localhost:5173 in your browser.
