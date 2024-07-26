import "./text-poll-option.css";

import { LiveLikeOption } from "@livelike/engagementsdk";
const html = (window as any).html;

class LLtntTextPollOption extends LiveLikeOption {
  @((window as any).property({ type: Function }))
  setOptionSelected: (arg: {}) => void = () => {};

  createRenderRoot(): this {
    return this;
  }
  optionSelected = () => {
    if (this.disabled) return;
    this.parentElement
      .querySelectorAll("ll-tnt-text-poll-option")
      .forEach((el: any) => {
        el !== this && (el.selected = false);
      });

    this.selected = true;
    this.setOptionSelected(this.item);
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this.optionSelected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this.optionSelected);
  }

  render() {
    return html`
      <div class="livelike-voting-text-container">
        <livelike-description></livelike-description>
      </div>
      <livelike-percentage></livelike-percentage>
    `;
  }
}
customElements.define("ll-tnt-text-poll-option", LLtntTextPollOption as any);
