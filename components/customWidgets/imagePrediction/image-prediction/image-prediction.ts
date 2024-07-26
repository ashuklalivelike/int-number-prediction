import "../image-prediction-option";
import "./image-prediction.css";

import { LiveLikePrediction } from "@livelike/engagementsdk";
const html = (window as any).html;
export const predictionVotes = {};

class LLtntImagePrediction extends LiveLikePrediction {
  @((window as any).property({ type: Object })) optionSelected: Record<
    string,
    string
  > = {};
  @((window as any).property({ type: Boolean })) isExpired = false;

  // optionSubmitted = () => {
  //   this.submitVote(this.optionSelected);
  // };

  setOptionSelected = (option: any) => {
    if (this.disabled) return;
    this.optionSelected = option;
  };

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

  // submitVote = (option: any) => {
  //   if (!this.disabled && option.id !== this.selectedOption.id) {
  //     this.selectedOption = option;
  //     this.interactionEvent();
  //   }
  // };
  lockInVote = () => {
    if (!this.disabled && this.optionSelected?.id) {
      this.voteDisable = true;
      this.createVote(this.optionSelected.vote_url).then(() => {
        this.voteDisable = true;
        this.disabled = true;
      });
    }
  };

  render() {
    const renderSubmitBtnText = () => {
      if (this.isExpired) {
        if (this.interaction) return "Expired - Answer submitted";
        else return "Expired";
      } else {
        if (this.disabled) return "Submitted";
        else return "Submit";
      }
    };
    return html`
      <template kind="image-prediction" id="custom-prediction">
        <livelike-widget-root class="custom-widget">
          <livelike-widget-header class="widget-header" slot="header">
            <livelike-title class="custom-title"></livelike-title>
          </livelike-widget-header>
          <livelike-widget-body>
            <livelike-select>
              <template>
                <ll-tnt-image-prediction-option
                  .setOptionSelected=${this.setOptionSelected}
                >
                </ll-tnt-image-prediction-option>
              </template>
            </livelike-select>
           <!-- <livelike-footer>
              <button
                class=${`widget-button ${
                  this.isExpired
                    ? "widget-expired"
                    : this.optionSelected?.id
                    ? "option-selected"
                    : ""
                }`}
                @click=${this.lockInVote}
                ?disabled=${this.disabled}
              >
                ${renderSubmitBtnText()}
              </button>
            </livelike-footer> --!>
          </livelike-widget-body>
        </livelike-widget-root>
      </template>
    `;
  }
}

customElements.define("ll-tnt-image-prediction", LLtntImagePrediction as any);
