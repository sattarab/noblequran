import { config } from "../../../helpers/config"

// eslint-disable-next-line camelcase
mixpanel.init( config.mixpanelToken, { batch_requests: true } )

export function trackMixpanelEvent( eventName: string, properties: { [ key: string ]: string } ): void {
  mixpanel.track( eventName, properties )
}
