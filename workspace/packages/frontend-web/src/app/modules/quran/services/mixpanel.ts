import mixpanel from "mixpanel-browser"

import { environment } from "../../../../environments/environment"

mixpanel.init( environment.mixpanelToken )

export function trackMixpanelEvent( eventName: string, properties: { [ key: string ]: string } ): void {
  mixpanel.track( eventName, properties )
}
