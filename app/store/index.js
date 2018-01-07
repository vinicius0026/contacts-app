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
        commit('setContacts', contacts)
      })
  },
  async createOrUpdateContact ({ commit, dispatch }, payload) {
    let contact

    if (payload.id) {
      contact = await contactsService.update(payload)
    } else {
      contact = await contactsService.create(payload)
    }

    await dispatch('loadContacts')
    await commit('selectContact', contact)
  },
  async selectContact ({ commit }, id) {
    const contact = await contactsService.read(id)
    commit('selectContact', contact)
  },
  async removeContact ({ commit, dispatch }, id) {
    await contactsService.remove(id)
    await dispatch('loadContacts')
    commit('selectContact', null)
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
