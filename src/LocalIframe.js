export class LocalIframe extends HTMLElement {
  static observedAttributes = ["description", "template"];

  /** @type {HTMLIFrameElement} */
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
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error("The element with the specified template ID is not a <template>.");
    }

    this.#iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${this.description}</title></head><body>${template.innerHTML}</body></html>`;

    this.#shouldRenderOnAttributeChange = true;
  }

  connectedCallback() {
    this.#render();
  }
}