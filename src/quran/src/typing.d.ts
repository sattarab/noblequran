interface MixpanelConfig {
  // eslint-disable-next-line camelcase
  batch_requests: boolean
}

declare const mixpanel: {
  init( token: string, config?: MixpanelConfig, name?: string ): void
  track(
    eventName: string,
    properties?: { [ key: string ]: string | boolean },
  ): void
}
