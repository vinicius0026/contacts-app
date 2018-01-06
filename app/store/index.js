import Vue from 'vue'
import Vuex from 'vuex'
import contactsService from '../services/contacts'

Vue.use(Vuex)

const state = {
  contacts: [],
  selectedContact: null,
  errorMessage: ''
}

const getters = {
  contacts: state => state.contacts,
  selectedContact: state => state.selectedContact,
  errorMessage: state => state.errorMessage
}

const mutations = {
  setContacts (state, contacts) {
    state.contacts = contacts
  },
  selectContact (state, contact) {
    state.selectedContact = contact
  },
  setErrorMessage (state, message) {
    state.errorMessage = message
  }
}

const actions = {
  loadContacts ({ commit }) {
    return contactsService.load()
      .then(contacts => {
        console.log('contacts', contacts)
        commit('setContacts', contacts)
      })
  },
  createContact ({ dispatch }, payload) {
    return contactsService.create(payload)
      .then(() => {
        return dispatch('loadContacts')
      })
  }
}

export function createStore () {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters
  })
}
