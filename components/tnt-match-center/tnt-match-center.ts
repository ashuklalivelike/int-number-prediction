import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import LiveLike from "@livelike/engagementsdk";
import type { IWidgetPayload } from "@livelike/javascript";
import { ITNTWidget, TNTWidgetType } from "../../../../types";
import { createWidgets, getProgram } from "../../api";

import "../tnt-match-center-timeline";

const { getWidgets, init } = LiveLike;

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */

const CLIENT_ID = import.meta.env.VITE_LL_CLIENT_ID;

@customElement("tnt-match-center")
export class TNTMatchCenter extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property({ type: String })
  matchId: string = "";

  @property({ type: String })
  widgetTypes: string = "";

  @property({ type: Boolean })
  loading: boolean = true;

  @property({ type: String })
  error: string = "";

  @property({ type: String })
  programId: string = "";

  @property({ type: Array })
  widgets: ITNTWidget[] = [];

  /**
   * The number of times the button has been clicked.
   */
  //   @state()
  //   count = 0;

  async connectedCallback() {
    super.connectedCallback();
    if (!CLIENT_ID) {
      this.error = "Client Id is missing";
      return;
    }
    await init({
      clientId: CLIENT_ID,
    });
    const widgetTypes = this.widgetTypes?.length
      ? (this.widgetTypes.split(",") as TNTWidgetType[])
      : [];
    if (!this.matchId || !widgetTypes.length) {
      this.loading = false;
      return;
    }
    const { programId, widgets } = await this.initializeGameCenter(
      this.matchId,
      widgetTypes
    );
    this.programId = programId;
    this.widgets = widgets;
    this.loading = false;
  }

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this;
  }

  async initializeGameCenter(matchId: string, widgetTypes: TNTWidgetType[]) {
    const program = await getProgram({ customId: matchId });
    if (!program) {
      return await createWidgets(matchId, widgetTypes);
    } else {
      // check which widgetType are not created and create only those widget
      const widgetsRes = await getWidgets({ programId: program.id });
      const llWidgets = widgetsRes.results;
      let pendingWidgetTypes = widgetTypes.filter((widgetType) => {
        return !llWidgets.some((widget: IWidgetPayload) =>
          widget.widget_attributes.some(({ value }) => value === widgetType)
        );
      });
      return await createWidgets(matchId, pendingWidgetTypes);
    }
  }

  protected updated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    _changedProperties.forEach((_, name) => {
      if (name === "matchId" || name === "widgetTypes") {
        if (!this.matchId || !this.widgetTypes?.length) {
          return;
        }
        this.loading = true;
        const widgetTypes = this.widgetTypes?.length
          ? (this.widgetTypes.split(",") as TNTWidgetType[])
          : [];
        this.initializeGameCenter(this.matchId, widgetTypes).then(
          ({ programId, widgets }) => {
            this.programId = programId;
            this.widgets = widgets;
            this.loading = false;
          }
        );
      }
    });
  }

  renderTimeline() {
    return html`<tnt-match-center-timeline
      programId=${this.programId}
    ></tnt-match-center-timeline>`;
  }

  render() {
    if (!this.matchId) {
      return null;
    }
    if (this.loading) {
      return "Loading...";
    }
    if (!this.programId) {
      return null;
    }
    return html`
      <div class="tnt-match-center-container">${this.renderTimeline()}</div>
    `;
  }

  static styles = css``;
}
