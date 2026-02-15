# `local-iframe`

> A web component that renders templates in a local `<iframe>`.

## Table of Contents

- [Getting Started](#getting-started)
- [Use Cases](#use-cases)
- [Example Usage](#example-usage)
  - [1. Child Template](#1-child-template)
  - [2. Template Attribute](#2-template-attribute)
- [Recommended Styling](#recommended-styling)
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

## Example Usage

There are two ways to define the markup for your iframe:

1. Render a `<template>` as a child of `<local-iframe>`
2. Define the `<template>` externally and set `template="id-of-your-template"`

In both cases, the component will duplicate the content of the template and render it in a local iframe.

Any styles and scripts will only affect elements within the iframe itself.

### 1. Child Template

The simplest way to use `local-iframe` is to render a `<template>` as a child:

```html
<local-iframe description="Hello world demo of a local iframe">
  <template>
    <div><h1>Hello, world!</h1></div>
    <p>This is awesome!</p>
    <script>
      console.log("hi");
    </script>
    <script>
      console.log("second console log in same iframe, but a second script tag");
    </script>
    <style>
      body {
        background-color: red;
        font-size: 200%;
      }
    </style>
  </template>
</local-iframe>
```

In this example, we render a template with:

- Some HTML tags for the iframe's markup
- Two scripts to execute within the iframe's context
- Styles to apply within to elements within the iframe

### 2. Template Attribute

Alternatively, you can define an external `<template>` and reference it via the `template` attribute, like so:

```html
<template id="template-1" description="Hello world demo of a local iframe">
  <h1>Template 1</h1>
  <style>
    h1 {
      color: red;
    }
  </style>
</template>
<local-iframe template="template-1"></local-iframe>
```

If the `template` attribute changes, the frame will update its markup with the content of the new template.

### Custom `iframe`

By default, `local-iframe` will append an `iframe` to its subtree.

Optionally, you may render a custom `iframe`, and that will get used instead:

```html
<local-iframe>
  <!-- Render this content in the iframe below -->
  <template>
    <h1>Hello world</h1>
  </template>
  <!-- This iframe will get used instead of the default -->
  <iframe style="border: solid 1px red"></iframe>
</local-iframe>
```

## API

| Attribute     | Type     | Description                                                                      |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| `template`    | `string` | The ID of the `<template>` element to use for the underlying `iframe`'s content. |
| `description` | `string` | A `title` to set on the underlying `iframe`, for improved accessibility.         |

## Recommended Styling

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

## Use Cases

I wanted to be able to declaratively render fully local, isolated code demos in my tutorials, without embedding third-party Codepens/sandboxes and without creating separate pages for each code demo. This web component uses the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute to do just that.

> [!NOTE]
> This originally began as an Eleventy plugin: [eleventy-plugin-code-demo](github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).

## Local Development

1. Clone this repo.
2. Run `pnpm install` to install dev dependencies (Vite).
3. Run `pnpm run dev` to start the local dev server.
4. Open http://localhost:5173 in your browser.
