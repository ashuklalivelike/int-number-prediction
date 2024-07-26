import "./image-number-prediction-option.css";

import { LiveLikeOption } from "@livelike/engagementsdk";
const html = (window as any).html;

class LLtntImageNumberPredictionOption extends LiveLikeOption {
  @((window as any).property({ type: Boolean }))
  isFollowUp = false;

  @((window as any).property({ type: Boolean }))
  isDisabled = false;

  @((window as any).property({ type: Function }))
  inputHandler: (arg1: any, arg2: any) => void = () => {};

  @((window as any).property({ type: Function }))
  keypressHandler: (arg1: any) => void = () => {};

  createRenderRoot(): this {
    return this;
  }

  // optionSelected = () => {
  //   if (this.disabled) return;
  //   this.parentElement
  //     .querySelectorAll("ll-tnt-image-number-prediction-option")
  //     .forEach((el: any) => {
  //       el !== this && (el.selected = false);
  //     });
  //   this.selected = true;
  // };

  connectedCallback() {
    super.connectedCallback();
    // this.addEventListener("click", this.optionSelected);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // this.removeEventListener("click", this.optionSelected);
  }

  firstUpdated() {
    super.firstUpdated();

    const inputElm = this.querySelector("input[type=number]");

    if (this.option && inputElm.disabled) {
      this.correct = this.option.correct_number === this.option.number;
      this.incorrect = this.option.correct_number !== this.option.number;
    }

    inputElm.addEventListener("change", (el: any) => {
      if (el.target.value) {
        el.target.parentElement.parentElement.selected = true;
      } else {
        el.target.parentElement.parentElement.selected = false;
      }
    });
  }

  updated() {
    super.update();
    const inputElm = this.querySelector("input[type=number]");

    if (!inputElm.disabled) {
      const isAnyInputValueNotPresent =
        Array.from(
          inputElm.parentElement.parentElement.parentElement.querySelectorAll(
            "input[type=number]"
          )
        ).filter((el: any) => !el.value).length !== 0;

      const button =
        inputElm.parentElement.parentElement.parentElement.parentElement.querySelector(
          "button.widget-button"
        );

      button.disabled = isAnyInputValueNotPresent;
    }

    if (this.option && inputElm.disabled) {
      this.correct = this.option.correct_number === this.option.number;
      this.incorrect = this.option.correct_number !== this.option.number;
    }

    if (inputElm.value) {
      inputElm.parentElement.parentElement.selected = true;
    } else {
      inputElm.parentElement.parentElement.selected = false;
    }
  }

  render() {
    if (this.isFollowUp) {
      const answered = this.option.number ?? "";
      const correctAnswer = this.option.correct_number;
      const isAnsweredCorrectly = answered === correctAnswer;

      const correctOption = !isAnsweredCorrectly
        ? html` <input
            class="livelike-voting-number-input correct-answer"
            type="number"
            placeholder="-"
            value=${correctAnswer}
            disabled
          />`
        : null;
      return html`
        <livelike-image height="48px" width="48px"></livelike-image>
        <div class="livelike-voting-image-container">
          <livelike-description></livelike-description>
        </div>
        <div class="livelike-voting-input-container">
          ${correctOption}
          <input
            class=${`livelike-voting-number-input ${
              isAnsweredCorrectly
                ? "correct-number-input"
                : "incorrect-number-input"
            }`}
            type="number"
            placeholder="-"
            disabled
            value=${answered}
          />
        </div>
      `;
    } else {
      return html`
        <livelike-image height="48px" width="48px"></livelike-image>
        <div class="livelike-voting-image-container">
          <livelike-description></livelike-description>
        </div>
        <div class="livelike-voting-input-container">
          <input
            class="livelike-voting-number-input user-number-input"
            type="number"
            placeholder="-"
            value=${this.option.number ?? ""}
            @input=${(e: any) => this.inputHandler(this.option, e)}
            @keypress=${(e: any) => this.keypressHandler(e)}
            ?disabled=${this.isDisabled}
          />
        </div>
      `;
    }
  }
}
customElements.define(
  "ll-tnt-image-number-prediction-option",
  LLtntImageNumberPredictionOption as any
);
