import { boot } from 'quasar/wrappers'
import { useCardStore } from 'stores/card'
import './registerServiceWorker'

// required to register service worker in production only.
const isProd = process.env.NODE_ENV !== 'development'

export default boot(async (/* { app, ...args } */) => {
  // eslint-disable-next-line no-undef
  if ($cardSDK) {
    const cardStore = useCardStore()
    // eslint-disable-next-line no-undef
    $cardSDK.modelUpdateListener(model => {
      cardStore.updateModel(model)
    })

    // @todo: remove the following before push for production.
    if (!isProd) {
      // eslint-disable-next-line no-undef
      $cardSDK.loadModel()
    }
  }
})
