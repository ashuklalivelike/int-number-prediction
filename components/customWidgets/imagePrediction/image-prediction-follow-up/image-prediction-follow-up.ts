import "./image-prediction-follow-up.css";

import { LiveLikeFollowUp } from "@livelike/engagementsdk";

const html = (window as any).html;

class LLtntImagePredictionFollowUp extends LiveLikeFollowUp {
  render() {
    const isUserCorrect =
      this.isUserRight ?? this.interaction?.is_correct ?? false;

    return html`
      <template kind="image-prediction-follow-up" id="custom-prediction">
        <livelike-widget-root class="custom-widget">
          <livelike-widget-header class="widget-header" slot="header">
            <livelike-title class="custom-title"></livelike-title>
          </livelike-widget-header>
          <livelike-widget-body>
            <livelike-select>
              <template>
                <livelike-option>
                  <div class="livelike-voting-image-container">
                    <div class="image-description-wrapper">
                      <livelike-description></livelike-description>
                    </div>
                    <livelike-percentage></livelike-percentage>
                  </div>
                  <livelike-image height="60px"></livelike-image>
                  <livelike-progress></livelike-progress>
                </livelike-option>
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
  "ll-tnt-image-prediction-follow-up",
  LLtntImagePredictionFollowUp as any
);
