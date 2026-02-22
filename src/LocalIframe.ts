export class LocalIframe extends HTMLElement {
  static observedAttributes = ["description", "template"] as const;

  /**
   * The inner `<iframe>` element into which the template content will be rendered.
   */
  #iframe: HTMLIFrameElement;

  /** Fix for double render on initial load when certain attributes are initialized that should also influence the rendering */
  #shouldRenderOnAttributeChange = false;

  /**
   * A description to set as the `title` attribute of the underlying `<iframe>`,
   * as well as in the `<title>` tag in the iframe's document `<head>`.
   */
  set description(description: string) {
    if (description) {
      this.#iframe.setAttribute("title", description);
    } else {
      this.#iframe.removeAttribute("title");
    }
  }

  /**
   * A description to set as the `title` attribute of the underlying `<iframe>`,
   * as well as in the `<title>` tag in the iframe's document `<head>`.
   */
  get description(): string {
    return this.#iframe.getAttribute("title") ?? "";
  }

  /**
   * (Optional) The ID of an external template to use as the source content of the underlying `<iframe>`.
   * If not specified, the component will default to querying for a `<template>` element in its subtree.
   */
  set template(id: string) {
    this.setAttribute("template", id);
  }

  /**
   * (Optional) The ID of an external template to use as the source content of the underlying `<iframe>`.
   * If not specified, the component will default to querying for a `<template>` element in its subtree.
   */
  get template(): string | null {
    return this.getAttribute("template");
  }

  constructor() {
    super();
    // NOTE: Normally, it's not safe to query light DOM children in the constructor of a web component
    // because of a rare race condition: If you register your custom element via window.customElements.define
    // BEFORE the DOM is parsed (e.g., in an inline script in the <head>), the constructors will run as soon
    // as the browser encounters a <local-iframe>, but before the <local-iframe>'s light DOM has been parsed.
    // But since this is an npm package and you must use type="module" scripts/`defer` to import it, the custom
    // element won't be registered until AFTER the DOM is fully parsed, so it's safe to query the light DOM.
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

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(
    name: (typeof LocalIframe.observedAttributes)[number],
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === "template" && this.#shouldRenderOnAttributeChange) {
      this.#render();
    }

    if (name === "description") {
      this.description = newValue ?? "";
    }
  }

  /**
   * Returns an HTML string that will eventually get set on the underlying `iframe.srcdoc` attribute.
   * You can extend `LocalIframe` and override this method to customize the rendering. This is useful if
   * you want all of your `<iframe>` elements to have some shared markup or common structure that you don't
   * want to duplicate across all of your `<template>`s.
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
  protected _render(templateHtml: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${this.description}</title></head><body>${templateHtml}</body></html>`;
  }

  /**
   * Private render method that takes the template content and dumps it into the inner `<iframe>`.
   */
  #render() {
    const templateId = this.template;

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
}
