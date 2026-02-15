class LocalIframe extends HTMLElement {
  static observedAttributes = ['template'];

  /** @type {HTMLIFrameElement} */
  #iframe;

  constructor() {
    super();
    this.#iframe = document.createElement('iframe');
    this.#iframe.style.height = '100%';
    this.#iframe.style.width = '100%';
    this.#iframe.style.maxWidth = '100%';
    this.appendChild(this.#iframe);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // NOTE: Prevent render running twice on initial mount when the template attribute is set for the first time.
    if (name === 'template' && oldValue !== null && oldValue !== newValue && this.isConnected) {
      this.#render();
    }
  }

  #render() {
    const templateId = this.getAttribute('template');
    const template = templateId ? document.getElementById(templateId) : this.querySelector('template');

    if (!template) {
      throw new Error('No <template> found for local-iframe element.');
    }

    const html = Array.from(template.content.children).filter(
      (child) => child.tagName.toLowerCase() !== 'style' && child.tagName.toLowerCase() !== 'script'
    ).map((html) => html.outerHTML).join('');
    const css = Array.from(template.content.querySelectorAll('style')).map((css) => css.outerHTML).join('');
    const js = Array.from(template.content.querySelectorAll('script')).map((js) => js.outerHTML).join('');

    this.#iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8">${css}</head><body>${html}${js}</body></html>`;
  }

  connectedCallback() {
    this.#render();
  }
}

window.customElements.define('local-iframe', LocalIframe);
