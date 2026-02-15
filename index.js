class LocalIframe extends HTMLElement {
  static observedAttributes = ["description", "template"];

  /** @type {HTMLIFrameElement} */
  #iframe;

  constructor() {
    super();
    this.#iframe = document.createElement("iframe");
    this.#iframe.style.height = "100%";
    this.#iframe.style.width = "100%";
    this.#iframe.style.maxWidth = "100%";
    this.appendChild(this.#iframe);
  }

  /** @param {string} description */
  set description(description) {
    console.log('setting title to ' + description);
    if (description) {
      this.#iframe.setAttribute("title", description);
    } else {
      this.#iframe.removeAttribute("title");
    }
  }

  /**
   * A description to set as the `title` attribute of the underlying `iframe`. 
   * @returns {string|null}
   */
  get description() {
    return this.#iframe.getAttribute("title");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // NOTE: Prevent render running twice on initial mount when the template attribute is set for the first time.
    if (
      name === "template" &&
      oldValue !== null &&
      this.isConnected
    ) {
      this.#render();
    }

    if (name === 'description') {
      this.description = newValue;
    }
  }

  #render() {
    const templateId = this.getAttribute("template");
    const template = templateId
      ? document.getElementById(templateId)
      : this.querySelector("template");

    if (!template) {
      throw new Error("No <template> found for local-iframe element.");
    }

    const html = Array.from(template.content.children)
      .filter(
        (child) =>
          child.tagName.toLowerCase() !== "style" &&
          child.tagName.toLowerCase() !== "script",
      )
      .map((html) => html.outerHTML)
      .join("");
    const css = Array.from(template.content.querySelectorAll("style"))
      .map((css) => css.outerHTML)
      .join("");
    const js = Array.from(template.content.querySelectorAll("script"))
      .map((js) => js.outerHTML)
      .join("");

    this.#iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8">${css}</head><body>${html}${js}</body></html>`;
  }

  connectedCallback() {
    this.#render();
  }
}

window.customElements.define("local-iframe", LocalIframe);
