const ActionEvent = {
  Click: 'CLICK_TOUCH'
}

const ActionType = {
  System: 'SYSTEM',
  Application: 'APPLICATION',
  Layout: 'LAYOUT'
}

export function useActions () {
  const actionsPerEvent = (actions) => {
    return actions.reduce((group, action) => {
      group[action.event] = group[action.event] || []
      group[action.event].push(action)
      return group
    }, {})
  }

  const handleLayoutAction = (action) => {
    const sdk = window.$cardSDK
    if (sdk && sdk.modules) {
      const { ACTIONS, CardSDKMessage, CardSDKState } = sdk.modules
      const message = new CardSDKMessage(
        action.target ? ACTIONS.SystemAction : ACTIONS.LocalAction,
        new CardSDKState({ ...(sdk.state.store || {}), action }, sdk.state.config),
        null,
        sdk.id
      )
      if (window && window.parent) {
        window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*')
      } else {
        console.error('there is no parent')
      }
    } else {
      console.error('Please update SDK used version')
    }
  }

  const handleSystemAction = (action) => {
    const sdk = window.$cardSDK
    if (sdk && sdk.modules) {
      const { ACTIONS, CardSDKMessage, CardSDKState } = sdk.modules
      const message = new CardSDKMessage(
        ACTIONS.SystemAction,
        new CardSDKState({ ...(sdk.state.store || {}), action }, sdk.state.config),
        null,
        sdk.id
      )
      if (window && window.parent) {
        window.parent.postMessage(JSON.parse(JSON.stringify(message)), '*')
      } else {
        console.error('there is no parent')
      }
    } else {
      console.error('Please update SDK used version')
    }
  }

  const handleClickAction = (actionsList) => {
    const actions = actionsPerEvent(actionsList)[ActionEvent.Click] || []

    actions.filter(action => action.type === ActionType.Layout)
      .forEach((action) => handleLayoutAction(action))

    actions.filter(({ type }) => type === ActionType.Application || type === ActionType.System)
      .forEach((action) => handleSystemAction(action))
  }

  return {
    handleSystemAction,
    handleLayoutAction,
    handleClickAction
  }
}
