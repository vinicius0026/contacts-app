<template>
  <v-flex
    xs12
    sm6
    md4
    class="contact-list"
  >
    <v-container>
      <v-layout class="search-box pa-1">
        <v-flex xs1>
          <v-icon>search</v-icon>
        </v-flex>
        <v-flex xs11>
          <input
            type="text"
            class="search-box-input"
            @keyup="filter"
            v-model="searchTerm"
          >
        </v-flex>
      </v-layout>
    </v-container>
    <v-list v-if="contacts.length">
      <v-list-tile
        v-for="contact in filteredContacts"
        :key="contact.id"
        @click="selectContact(contact.id)"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ contact.fullName }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="filteredContacts.length === 0">
        <v-list-tile-content>
          <v-list-tile-title>
            <em>No contact matched your query</em>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <WelcomeMessage v-else-if="isMobile"/>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'lodash'
import WelcomeMessage from './WelcomeMessage'

export default {
  components: {
    WelcomeMessage
  },
  data () {
    return {
      searchTerm: '',
      filteredContacts: []
    }
  },
  computed: {
    ...mapGetters(['contacts', 'isMobile'])
  },
  watch: {
    contacts () {
      const filterRegex = new RegExp(this.searchTerm, 'i')
      this.filteredContacts = this.contacts.filter(contact => contact.fullName.match(filterRegex))
    }
  },
  mounted () {
    this.filteredContacts = this.contacts
  },
  methods: {
    ...mapActions(['selectContact']),
    filter: debounce(function () {
      const filterRegex = new RegExp(this.searchTerm, 'i')
      this.filteredContacts = this.contacts.filter(contact => contact.fullName.match(filterRegex))
    }, 100)
  }
}
</script>

<style lang="stylus" scoped>
.contact-list
  overflow-y scroll
  max-height 100vh

.search-box
  border 1px solid rgba(0,0,0,.25)
  border-radius 2px

  &-input
    width 100%
    height 100%
    font-family 'Roboto', sans-serif

    &:focus
      outline none
</style>
