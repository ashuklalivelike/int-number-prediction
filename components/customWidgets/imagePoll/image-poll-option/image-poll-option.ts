import "./image-poll-option.css";

import { LiveLikeOption } from "@livelike/engagementsdk";
const html = (window as any).html;

class LLtntImagePollOption extends LiveLikeOption {
  @((window as any).property({ type: Function }))
  setOptionSelected: (arg: {}) => void = () => {};

  createRenderRoot(): this {
    return this;
  }
  optionSelected = () => {
    if (this.disabled) return;
    this.parentElement
      .querySelectorAll("ll-tnt-image-poll-option")
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
      <livelike-image height="48px" width="48px"></livelike-image>
      <div class="livelike-voting-image-container">
        <div class="image-description-wrapper">
          <livelike-description></livelike-description>
        </div>
      </div>
      <livelike-percentage></livelike-percentage>
    `;
  }
}
customElements.define("ll-tnt-image-poll-option", LLtntImagePollOption as any);
