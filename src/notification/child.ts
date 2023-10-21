import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import '@vandeurenglenn/lit-elements/icon.js'

@customElement('notification-child')
export class NotificationChild extends LitElement {
  @property()
  title: string

  @property()
  message: string

  @property()
  type: 'error' | 'info' | 'warning'

  #onclick = () => {
    this.parentElement.removeChild(this)
  }

  static styles = css`:host {
    display: flex;
    flex-direction: column;
    font-size: 13px;
    border: 1px solid;
    border-radius: 12px;
    padding: 6px 12px;
    box-sizing: border-box;
    background: #fff;

    --svg-icon-size: 20px;
    margin-bottom: 12px;
  }
  flex-row {
    height: 24px;
    box-sizing: border-box;
    align-items: center;
  }

  strong {
    font-size: 14px;
  }
  `

  render() {
    return html`
  <flex-row>
    <strong>${this.title}</strong>
    <flex-it></flex-it>
    <custom-icon icon="close" @click=${this.#onclick}></custom-icon>
  </flex-row>

  <p>${this.message}</p>
    `
  }
}