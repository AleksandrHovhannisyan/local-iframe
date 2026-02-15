# `local-iframe`

> A web component that renders templates in a local `<iframe>`.

## Getting Started

Install the package:

```sh
npm install local-iframe
```

Or include it via CDN:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/local-iframe@version/index.js"
></script>
```

## Use Cases

I wanted to be able to declaratively render fully local, isolated code demos in my tutorials, without embedding third-party Codepens/sandboxes and without creating separate pages for each code demo. This web component uses the [`HTMLIFrameElement.srcdoc`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc) attribute to do just that.

> [!NOTE]
> This originally began as an Eleventy plugin: [eleventy-plugin-code-demo](github.com/AleksandrHovhannisyan/eleventy-plugin-code-demo).

## Example Usage

There are two ways to define the markup for your iframe:

- Render a `<template>` as a child of `<local-iframe>`
- Define the `<template>` externally and set `template="id-of-your-template"`

In both cases, the component will duplicate the content of the template and render it in a local iframe.

Any styles and scripts will only affect elements within the iframe itself.

### Child Template

The simplest way to use `local-iframe` is to render a `<template>` as a child:

```html
<local-iframe style="width: 800px; height: 400px;">
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

> [!TIP]
> To prevent layout shifts when the page loads, set inline styles on the host element and assign it a width and height. The inner `iframe` will fill that space responsively, shrinking or growing as needed.

### Template Attribute

Alternatively, you can define an external `<template>` and reference it via the `template` attribute, like so:

```html
<template id="template-1">
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
