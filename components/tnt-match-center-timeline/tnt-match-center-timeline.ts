import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./tnt-match-center-timeline.css";
import "../customWidgets/imagePrediction/image-prediction";
import "../customWidgets/imagePrediction/image-prediction-follow-up";
import "../customWidgets/imageNumberPrediction/image-number-prediction";
import "../customWidgets/imageNumberPrediction/image-number-prediction-follow-up";
import "../customWidgets/imagePoll/image-poll";
import "../customWidgets/textPoll/text-poll";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */

enum WidgetKind {
  IMAGE_NUMBER_PREDICTION = "image-number-prediction",
  IMAGE_NUMBER_PREDICTION_FOLLOW_UP = "image-number-prediction-follow-up",
}

@customElement("tnt-match-center-timeline")
export class TNTMatchCenterTimeline extends LitElement {
  @property({ type: String })
  programId: string = "";

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  filterWidgets() {
    const followUpWidgetsList = [WidgetKind.IMAGE_NUMBER_PREDICTION_FOLLOW_UP];
    const allowedWidgetKinds = Object.values(WidgetKind);
    setTimeout(() => {
      const widgets = document.querySelector("livelike-widgets");
      //@ts-ignore
      const updateWidgetToFollowUpWidget = ({ widgets }) => {
        const followUpWidgets = widgets.filter((widget: any) => {
          return followUpWidgetsList.includes(widget.kind);
        });
        const nonFollowUpWidgets = widgets.filter(
          (widget: any) => !followUpWidgetsList.includes(widget.kind)
        );
        const updatedWidgets = nonFollowUpWidgets.map(
          (nfWidget: any) =>
            followUpWidgets.find(
              (fWidget: any) => fWidget.id === nfWidget.follow_ups?.[0].id
            ) ?? nfWidget
        );
        const filteredAllowedWidgets = updatedWidgets.filter(
          (widget: any) => allowedWidgetKinds.includes(widget.kind) || true
        );
        return filteredAllowedWidgets;
      };
      const customWidgetRenderer = (args: any) => {
        let widgetPayload = args.widgetPayload;
        switch (widgetPayload.kind) {
          case WidgetKind.IMAGE_NUMBER_PREDICTION: {
            return document.createElement("ll-tnt-image-number-prediction");
          }
          case WidgetKind.IMAGE_NUMBER_PREDICTION_FOLLOW_UP: {
            return document.createElement(
              "ll-tnt-image-number-prediction-follow-up"
            );
          }
          default:
            break;
        }
      };
      const handleIncomingFollowUpWidget = (widgetPayload: any) => {
        const isWidgetAllowed = allowedWidgetKinds.includes(widgetPayload.kind);
        if (!isWidgetAllowed) return null;
        const isFollowUpWidget = followUpWidgetsList.includes(
          widgetPayload.kind
        );
        if (!isFollowUpWidget) return widgetPayload;
        if (
          widgetPayload.kind === WidgetKind.IMAGE_NUMBER_PREDICTION_FOLLOW_UP
        ) {
          const predictionWidget: any = document.querySelector(
            `[widgetId="${widgetPayload.image_number_prediction_id}"]`
          );
          if (predictionWidget) {
            if (predictionWidget?.interaction) {
              const interaction = { ...predictionWidget.interaction };
              predictionWidget.remove();

              const userSelectedAns = interaction.votes.map((option: any) => ({
                number: option.number,
                option_id: option.option_id,
              }));
              const updatedWidgetPayload = {
                ...widgetPayload,
                isUserInteracted: true,
                options: widgetPayload.options.map((option: any) => ({
                  ...option,
                  number:
                    userSelectedAns.find(
                      (ans: any) => ans.option_id === option.id
                    ).number ?? "",
                })),
              };
              return updatedWidgetPayload;
            } else {
              const userSelectedAns = predictionWidget.options.map(
                (option: any) => ({
                  number: option.number,
                  option_id: option.id,
                })
              );
              const isDoneVoting = predictionWidget.voteDisable;
              predictionWidget.remove();

              const updatedWidgetPayload = {
                ...widgetPayload,
                isUserInteracted: isDoneVoting,
                options: widgetPayload.options.map((option: any) => ({
                  ...option,
                  number:
                    userSelectedAns.find(
                      (ans: any) => ans.option_id === option.id
                    ).number ?? "",
                })),
              };
              return updatedWidgetPayload;
            }
          }
        }
      };
      widgets &&
        //@ts-ignore
        (widgets.onInitialWidgetsLoaded = updateWidgetToFollowUpWidget);
      // @ts-ignore
      widgets && (widgets.customWidgetRenderer = customWidgetRenderer);

      //@ts-ignore
      widgets && (widgets.onWidgetReceived = handleIncomingFollowUpWidget);
    }, 0);
  }

  async connectedCallback() {
    super.connectedCallback();
    this.filterWidgets();
  }

  render() {
    return html`
      <livelike-widgets
        programId=${this.programId}
        mode="interactive-timeline"
      ></livelike-widgets>
    `;
  }

  static styles = css``;
}
