# `local-iframe` <!-- omit in toc -->

> Web component that allows you to render local code sandboxes using iframes and HTML templates.

## Table of Contents <!-- omit in toc -->

- [Getting Started](#getting-started)
- [Use Cases and Motivation](#use-cases-and-motivation)
- [Examples and Usage Patterns](#examples-and-usage-patterns)
  - [Rendering the `iframe` Content](#rendering-the-iframe-content)
    - [Option 1: Child `<template>`](#option-1-child-template)
    - [Option 2: `template` Attribute](#option-2-template-attribute)
  - [Providing a Custom `iframe`](#providing-a-custom-iframe)
  - [Advanced: Overriding `iframe.srcdoc`](#advanced-overriding-iframesrcdoc)
  - [Minimize Layout Shifts on Load](#minimize-layout-shifts-on-load)
  - [Fit to Content](#fit-to-content)
- [API](#api)
  - [Attributes and Properties](#attributes-and-properties)
  - [Methods](#methods)
- [Local Development](#local-development)
- [FAQs](#faqs)

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
  src="https://cdn.jsdelivr.net/npm/local-iframe@2.1.0/+esm"
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

See [examples and usage patterns](#examples-and-usage-patterns).

## Use Cases and Motivation

When writing web development tutorials, I sometimes want to allow my readers to interact with code demos or see live output, rather than just sharing screenshots and code samples. Some of the best examples of this are in my article on [JavaScript events](https://www.aleksandrhovhannisyan.com/blog/interactive-guide-to-javascript-events/), where readers can click buttons to see events get logged to the console. All of the demos are fully isolated from each other, which greatly simplifies the content authoring experience for me.

It's easy to do this with a service like Codepen, but I don't like the idea of having to maintain my code demos outside my blog on a third-party website and then embedding them in my Markdown, which often loads a lot of extra JavaScript that I don't need.

Instead, `local-iframe` uses the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute to create a fully self-contained `iframe` based on whatever code you give it, right there in your page. What you see is what you get.

> [!NOTE]
> This originally began as an Eleventy plugin: [eleventy-plugin-code-demo](https://github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).

> [!TIP]
> See also: ["Building HTML, CSS, and JS code preview using iframe's srcdoc attribute"](https://mionskowski.pl/posts/iframe-code-preview/) by Maciej Mionskowski, which is what originally inspired me to poke around and see how far I could take this idea.

## Examples and Usage Patterns

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

As expected, your custom class will inherit all public/protected properties, attributes, and methods from `LocalIframe`.

This way, you don't need to duplicate the shared markup across all of your `<template>`s.

You can also create as many custom variants as you want using this pattern.

### Minimize Layout Shifts on Load

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

### Fit to Content

To force the outer `local-iframe` element's height to match the height of the inner iframe content, set the `fit-content` attribute:

```html
<local-iframe fit-content>
  <template>
    <p>Really</p>
    <p>long</p>
    <p>content</p>
    <p>that</p>
    <p>forces</p>
    <p>the inner iframe</p>
    <p>to scroll.</p>
    <p>But since fit-content is set,</p>
    <p>this local-iframe will resize itself</p>
    <p>to match the inner iframe's height.</p>
  </template>
</local-iframe>
```

> [!NOTE]
> If you also set an inline height on `local-iframe` like `style="height: 200px"`, the `fit-content` attribute will always have the final say. If you later remove the `fit-content` attribute, the element will return to the previous height that you set, or `auto` if one was not previously set.

## API

### Attributes and Properties

> [!TIP]
> You may either set attributes via HTML or programmatically in JavaScript. `LocalIframe` provides typed getter/setter properties for each attribute listed in the table below. For example:
> 
> ```js
> // these are equivalent
> localIframe.fitContent = true;
> localIframe.setAttribute("fit-content", "");
>
> // and so are these
> localIframe.fitContent = false;
> localIframe.removeAttribute("fit-content");
>```
>
> Any attributes of type `boolean` are treated as `false` by default, and the presence of the value is all that matters in your HTML.


| Attribute     | Type      | Description                                                                                                          |
| ------------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| `template`    | `string`  | The ID of the `<template>` element to use for the underlying `iframe`'s content.                                     |
| `description` | `string`  | A `title` to set on the underlying `iframe`, for improved accessibility.                                             |
| `fit-content` | `boolean` | If this attribute is set, the element will size its height to match the height of the inner iframe document content. |

### Methods

| Method    | Type                       | Description                                                                                                                                                                                                      |
| --------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_render` | `(html: string) => string` | Method on `LocalIframe` that takes the incoming template HTML and returns an HTML string to set on the underlying `iframe.srcdoc` attribute. You can override this method in subclasses to define your own HTML. |

## Local Development

1. Clone this repo.
2. Run `pnpm install` to install dev dependencies (Vite).
3. Run `pnpm run dev` to start the local dev server.
4. Open http://localhost:5173 in your browser.

## FAQs

<details open>
<summary>Why not just render a regular <code>iframe</code> yourself and set its <code>srcdoc</code>? Why is this needed?</summary>

Sure, nothing is stopping you from doing this:

```html
<iframe srcdoc="<!DOCTYPE html>..."></iframe>
```

But this is inconvenient for several reasons:

- You have to escape special characters like `<`, `>`, `"`, and `'` yourself.
- You lose syntax highlighting and intellisense/autocomplete and it's harder to read.
- You have to repeat the common document structure every time.

`local-iframe` allows you to write the `srcdoc` as regular HTML, but inside a `<template>` so that it never runs in the page context. It's basically a helper/decorator web component.
</details>