class LocalIframe extends HTMLElement {
  static observedAttributes = ['template'];

  #iframe;
  #hasMounted = false;

  constructor() {
    super();
    this.#iframe = document.createElement('iframe');
    this.#iframe.style.height = '100%';
    this.#iframe.style.width = '100%';
    this.#iframe.style.maxWidth = '100%';
    this.appendChild(this.#iframe);
  }

  attributeChangedCallback(name, oldValue, ) {
    if (name === 'template') {
      this.connectedCallback();
    }
  }

  connectedCallback() {
    if (this.#hasMounted) return;
    this.#hasMounted = true;

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
}

window.customElements.define('local-iframe', LocalIframe);
