import "./image-number-prediction-follow-up.css";
import "../image-number-prediction-option";

import { LiveLikeNumberFollowUp } from "@livelike/engagementsdk";

const html = (window as any).html;

class LLtntImageNumberPredictionFollowUp extends LiveLikeNumberFollowUp {
  render() {
    const isUserCorrect =
      this.options?.filter(
        (option: any) => option.number === option.correct_number
      ).length === 2
        ? true
        : false;

    return html`
      <template kind="image-number-prediction-follow-up">
        <livelike-widget-root class="custom-widget">
          <livelike-widget-header class="widget-header" slot="header">
            <div>Quiz</div>
            <livelike-title class="custom-title"></livelike-title>
          </livelike-widget-header>
          <livelike-widget-body>
            <livelike-select>
              <template>
                <ll-tnt-image-number-prediction-option .isFollowUp=${true}>
                </ll-tnt-image-number-prediction-option>
              </template>
            </livelike-select>
            <livelike-footer>
              <div class="results">
                ${this.interaction || this.isUserInteracted
                  ? isUserCorrect
                    ? "Correct!"
                    : "Wrong!"
                  : "Expired - No selection submitted"}
              </div>
            </livelike-footer>
          </livelike-widget-body>
        </livelike-widget-root>
      </template>
    `;
  }
}

customElements.define(
  "ll-tnt-image-number-prediction-follow-up",
  LLtntImageNumberPredictionFollowUp as any
);
