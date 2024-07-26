import "../image-number-prediction-option";
import "./image-number-prediction.css";

import { LiveLikeNumberPrediction } from "@livelike/engagementsdk";
const html = (window as any).html;
export const predictionVotes = {};

class LLtntImageNumberPredictionOption extends LiveLikeNumberPrediction {
  connectedCallback() {
    super.connectedCallback();
    const interactiveUntil: string = this.widgetPayload.interactive_until;
    this.isExpired = interactiveUntil
      ? Date.now() > new Date(interactiveUntil).getTime()
      : false;
  }

  firstUpdated() {
    super.firstUpdated();
    this.updateComplete.then(() => {
      if (this.interaction) {
        this.disabled = true;
      }
    });
    this.addEventListener("prediction", (e: any) => {
      //@ts-ignore
      predictionVotes[e.detail.widget.id] = {
        option_id: e.detail.prediction.option_id,
        claim_token: e.detail.prediction.claim_token,
      };
    });
  }

  lockInVote = (options: any) => {
    if (!this.disabled && !this.voteButtonDisabled) {
      this.voteDisable = true;
      const data = {
        votes:
          options &&
          options instanceof Array &&
          options.map((option) => {
            return {
              option_id: option.id,
              number: option.number,
            };
          }),
      };
      this.createVote(this.vote_url, data).then(() => {
        this.voteDisable = true;
        this.disabled = true;
        this.disableOptions();
      });
    }
  };
  disableOptions = () => {
    const optionsList = this.querySelectorAll(".livelike-voting-number-input");
    optionsList.forEach((element: any) => {
      element.setAttribute("disabled", true);
    });
  };

  render() {
    const renderSubmitBtnText = () => {
      if (this.isExpired) {
        if (this.interaction) return "Expired - Answer submitted";
        else return "Expired - No prediction submitted";
      } else {
        if (this.disabled) return "Submitted";
        else return "Submit";
      }
    };

    return html`
      <template kind="image-number-prediction">
        <livelike-widget-root class="custom-widget">
          <livelike-widget-header class="widget-header" slot="header">
            <div class="quiz">Quiz</div>
            <livelike-title class="custom-title"></livelike-title>
          </livelike-widget-header>
          <livelike-widget-body>
            <livelike-select>
              <template>
                <ll-tnt-image-number-prediction-option
                  .isFollowUp=${false}
                  .isDisabled=${this.disabled ||
                  this.voteDisable ||
                  this.isExpired ||
                  this.interaction}
                  .inputHandler=${this.inputHandler}
                  .keypressHandler=${this.keypressHandler}
                >
                </ll-tnt-image-number-prediction-option>
              </template>
            </livelike-select>
            <livelike-footer>
              <button
                class=${`widget-button ${
                  this.isExpired
                    ? "widget-expired"
                    : !this.voteButtonDisabled
                    ? "option-selected"
                    : ""
                }`}
                @click=${() => this.lockInVote(this.options)}
                ?disabled=${this.disabled}
              >
                ${renderSubmitBtnText()}
              </button>
            </livelike-footer>
          </livelike-widget-body>
        </livelike-widget-root>
      </template>
    `;
  }
}

customElements.define(
  "ll-tnt-image-number-prediction",
  LLtntImageNumberPredictionOption as any
);
