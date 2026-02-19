export class LocalIframe extends HTMLElement {
  static observedAttributes = ["description", "template"];

  /**
   * The inner `iframe` element into which the template content will be rendered.
   * @type {HTMLIFrameElement}
   */
  #iframe;

  /** Fix for double render on initial load when certain attributes are initialized that should also influence the rendering */
  #shouldRenderOnAttributeChange = false;

  constructor() {
    super();
    const existingIframe = this.querySelector("iframe");
    this.#iframe = existingIframe ?? document.createElement("iframe");
    // Ensure the iframe fills the host element
    this.#iframe.style.height = "100%";
    this.#iframe.style.width = "100%";
    this.#iframe.style.maxWidth = "100%";
    if (!existingIframe) {
      this.appendChild(this.#iframe);
    }
  }

  /** @param {string} description */
  set description(description) {
    if (description) {
      this.#iframe.setAttribute("title", description);
    } else {
      this.#iframe.removeAttribute("title");
    }
  }

  /**
   * A description to set as the `title` attribute of the underlying `iframe`.
   * @returns {string}
   */
  get description() {
    return this.#iframe.getAttribute("title") ?? "";
  }

  /** @param {string} id */
  set template(id) {
    this.setAttribute("template", id);
  }

  /**
   * The ID of the template to use as the source content of the underlying `iframe`.
   * @returns {string|null}
   */
  get template() {
    return this.getAttribute("template");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "template" && this.#shouldRenderOnAttributeChange) {
      this.#render();
    }

    if (name === "description") {
      this.description = newValue;
    }
  }

  /**
   * Returns an HTML string that will eventually get set on the underlying `iframe.srcdoc` attribute.
   * You can extend `LocalIframe` and override this method to customize the rendering. This is useful if
   * you want all of your `iframe` elements to have some shared markup or common structure that you don't
   * want to duplicate across all of your `<template>`s.
   * @param {string} templateHtml The parsed inner HTML of the `<template>`, which you should render into the `iframe` in some way.
   * @returns {string}
   * @example
   * ```js
   * // customize the rendering behavior
   * class CodeDemo extends LocalIframe {
   *  _render(templateHtml) {
   *     return `<!DOCTYPE html>
   *     <html>
   *      <head><meta charset="utf-8"></head>
   *      <body>
   *      ${templateHtml}
   *      <p>Created with the CodeDemo component</p>
   *      </body>
   *     </html>`;
   *   }
   * }
   * 
   * // register our new component
   * window.customElements.define("code-demo", CodeDemo);
   * ```
   */
  _render(templateHtml) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${this.description}</title></head><body>${templateHtml}</body></html>`;
  }

  #render() {
    const templateId = this.getAttribute("template");

    const template = templateId
      ? document.getElementById(templateId)
      : this.querySelector("template");

    if (!template) {
      throw new Error("No <template> found for local-iframe element.");
    }
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error(
        "The element with the specified template ID is not a <template>.",
      );
    }

    this.#iframe.srcdoc = this._render(template.innerHTML);
    this.#shouldRenderOnAttributeChange = true;
  }

  connectedCallback() {
    this.#render();
  }
}
