import { LocalIframe } from "./LocalIframe";

export class CodeDemo extends LocalIframe {
    _render(templateHtml) {
        return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${this.description}</title><style>body { background-color: red }</style></head><body>${templateHtml}<p>Brought to you by CodeDemo</p></body></html>`;
    }
}

window.customElements.define("code-demo", CodeDemo);