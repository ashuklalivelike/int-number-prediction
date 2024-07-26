import "../image-poll-option";
import "./image-poll.css";

import { LiveLikePoll } from "@livelike/engagementsdk";
const html = (window as any).html;
export const predictionVotes = {};

class LLtntImagePoll extends LiveLikePoll {
  @((window as any).property({ type: Object })) optionSelected: Record<
    string,
    Object
  > = {};
  @((window as any).property({ type: Boolean })) isExpired = false;
  @((window as any).property({ type: Boolean })) isUserInteracted = false;

  setOptionSelected = (option: any) => {
    if (this.disabled) return;
    this.optionSelected = option;
  };

  connectedCallback() {
    super.connectedCallback();
    this.isUserInteracted = !!this.interaction;
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
        this.isUserInteracted = true;
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

  submitVote = (option: any) => {
    if (!this.disabled && option.id !== this.selectedOption.id) {
      this.updateVoteCount(option);
      this.selectedOption = option;
      this.interactionEvent();
    }
  };
  lockInVote = () => {
    if (!this.disabled && this.optionSelected?.id) {
      this.voteDisable = true;
      this.submitVote(this.optionSelected);
      this.createVote(this.optionSelected.vote_url).then(() => {
        this.disabled = true;
        this.isUserInteracted = true;
      });
    }
  };

  render() {
    const renderOptions = () =>
      this.isUserInteracted
        ? html`
            <livelike-select>
              <template>
                <livelike-option>
                  <livelike-image height="48px" width="48px"></livelike-image>
                  <div class="livelike-voting-image-container">
                    <div class="image-description-wrapper">
                      <livelike-description></livelike-description>
                    </div>
                    <livelike-percentage></livelike-percentage>
                  </div>
                  <livelike-progress></livelike-progress>
                </livelike-option>
              </template>
            </livelike-select>
          `
        : html`
            <livelike-select>
              <template>
                <ll-tnt-image-poll-option
                  .setOptionSelected=${this.setOptionSelected}
                >
                </ll-tnt-image-poll-option>
              </template>
            </livelike-select>
          `;

    const renderSubmitBtnText = () => {
      if (this.isExpired) {
        if (this.interaction) return "Expired - Answer submitted";
        else return "Expired";
      } else {
        if (this.disabled) return "Submitted";
        else return "Submit";
      }
    };

    const renderFooter = () =>
      this.disabled && !this.isExpired
        ? null
        : html`
            <livelike-footer>
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
            </livelike-footer>
          `;

    return html`
      <template kind="image-poll">
        <livelike-widget-root class="custom-widget">
          <livelike-widget-header class="widget-header" slot="header">
            <livelike-title class="custom-title"></livelike-title>
          </livelike-widget-header>
          <livelike-widget-body>
            ${renderOptions()} ${renderFooter()}
          </livelike-widget-body>
        </livelike-widget-root>
      </template>
    `;
  }
}

customElements.define("ll-tnt-image-poll", LLtntImagePoll as any);
