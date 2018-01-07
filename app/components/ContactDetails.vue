<template>
  <v-flex
    xs12
    sm6
    md8
  >
    <v-card
      v-if="selectedContact"
      class="elevation-0"
    >
      <v-card-title primary-title>
        <h3 class="headline">
          {{ selectedContact.firstName }} {{ selectedContact.lastName }}
        </h3>
        <v-spacer/>
        <v-btn icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="handleRemoveContact"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <v-subheader>Contact details</v-subheader>
            </v-flex>
          </v-layout>
          <ContactDetailGroupEntry
            icon="phone"
            :entries="selectedContact.phoneNumbers"
          />
          <ContactDetailGroupEntry
            icon="email"
            :entries="selectedContact.emails"
          />
          <ContactDetailGroupEntry
            icon="location_on"
            :entries="addresses"
          />
          <ContactDetailEntry
            icon="cake"
            :text="birthday"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import {
  format as formatDate
} from 'date-fns'
import ContactDetailGroupEntry from './ContactDetailGroupEntry'
import ContactDetailEntry from './ContactDetailEntry'

export default {
  components: {
    ContactDetailEntry,
    ContactDetailGroupEntry
  },
  computed: {
    ...mapGetters(['selectedContact']),
    addresses () {
      return this.selectedContact && this.selectedContact.addresses.map(addr => `${addr.number} ${addr.street} - ${addr.city}, ${addr.state} ${addr.zip}`)
    },
    birthday () {
      return this.selectedContact && formatDate(this.selectedContact.birthday, 'MMM Do YYYY')
    }
  },
  methods: {
    ...mapMutations(['setErrorMessage']),
    ...mapActions(['removeContact']),
    handleRemoveContact () {
      if (!window.confirm('Do you really wanto to remove this contact? This action cannot be undone!')) {
        return
      }
      try {
        this.removeContact(this.selectedContact.id)
      } catch (err) {
        this.setErrorMessage(err.message)
      }
    }
  }
}
</script>
