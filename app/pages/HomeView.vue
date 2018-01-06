<template>
  <v-layout>
    <ContactList/>
    <ContactDetails/>
  </v-layout>
</template>

<script>
import ContactDetails from '../components/ContactDetails'
import ContactList from '../components/ContactList'

export default {
  asyncData ({ store }) {
    return store.dispatch('loadContacts')
  },
  components: {
    ContactDetails,
    ContactList
  }
}
</script>
