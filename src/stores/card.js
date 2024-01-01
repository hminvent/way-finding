import { defineStore } from 'pinia'

export const useCardStore = defineStore('card', {
  state: () => ({
    inputs: [
      {
        "name": "primaryColor",
        "value": {
          "text": "#892d7a"
        }
      },
      {
        "name": "logo",
        "value": []
      },
      {
        "name": "loginLogo",
        "value": []
      },
      {
        "name": "userEmail",
        "value": {
          "text": ""
        }
      },
      {
        "name": "userPassword",
        "value": {
          "text": ""
        }
      },
      {
        "name": "ecrypt",
        "value": false
      }
    ],
    attachments: {}
  }),

  getters: {
    model: (state) => {
      const inputs = state.inputs
      return inputs.reduce((acc, input) => {
        if (!(input.name || '').toLowerCase().includes('actions') && Array.isArray(input.value)) {
          acc[input.name] = state.attachments[input.name] || []
        } else {
          acc[input.name] = input.value
        }
        return acc
      }, {})
    }
  },

  actions: {
    updateModel(model) {
      this.inputs = model.inputs
      this.attachments = model.attachments
    }
  }
})
