<template>
  <v-layout wrap>
    <ContactList/>
    <ContactDetails v-if="!isMobile"/>
    <v-dialog
      v-else
      v-model="showDetails"
      fullscreen
      transition="dialog-right-transition"
      :overlay="false"
    >
      <ContactDetails/>
    </v-dialog>
  </v-layout>
</template>

<script>
import ContactDetails from '../components/ContactDetails'
import ContactList from '../components/ContactList'
import { mapGetters, mapMutations } from 'vuex'

export default {
  asyncData ({ store }) {
    return store.dispatch('loadContacts')
  },
  components: {
    ContactDetails,
    ContactList
  },
  computed: {
    ...mapGetters(['isMobile', 'selectedContact']),
    showDetails () {
      return !!this.selectedContact
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize, { passive: true })
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },
  methods: {
    ...mapMutations(['setWindowWidth']),
    onResize () {
      this.setWindowWidth(window.innerWidth)
    }
  }
}
</script>
