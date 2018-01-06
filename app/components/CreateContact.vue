<template>
  <v-card>
    <v-card-title class="headline">
      New contact
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-layout wrap>
          <v-flex xs6>
            <v-text-field
              label="First name"
              v-model="contact.firstName"
              class="pr-1"
            />
          </v-flex>
          <v-flex>
            <v-text-field
              label="Last name"
              v-model="contact.lastName"
            />
          </v-flex>
        </v-layout>
        <DateInput v-model="contact.birthday"/>
        <MultipleInput
          v-model="contact.phoneNumbers"
          label="Phone"
          icon="phone"
          type="tel"
        />
        <MultipleInput
          v-model="contact.emails"
          label="Email"
          icon="email"
          type="email"
        />
        <AddressesInput
          v-model="contact.addresses"
        />
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        flat
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        v-if="!loading"
        flat
        @click="handleCreateContact"
      >
        Create
      </v-btn>
      <v-btn
        flat
        disabled
        v-else
      >
        <v-icon class="fa-spin">fa-spinner</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AddressesInput from './AddressesInput'
import DateInput from './DateInput'
import MultipleInput from './MultipleInput'
import { contact as validateContact } from '../util/validate'
import { mapMutations, mapActions } from 'vuex'

export default {
  components: {
    AddressesInput,
    DateInput,
    MultipleInput
  },
  data () {
    return {
      contact: {},
      loading: false
    }
  },
  methods: {
    ...mapMutations(['setErrorMessage']),
    ...mapActions(['createContact']),
    close () {
      this.contact = {}
      this.$emit('closeModal')
    },
    async handleCreateContact () {
      this.loading = true

      try {
        validateContact.create(this.contact)
        await this.createContact(this.contact)

        this.close()
      } catch (err) {
        if (err.response && err.response.data && err.response.data.statusCode === 400) {
          this.setErrorMessage('Please provide a valid email')
        } else if (err.response && err.response.data && err.response.data.statusCode === 500) {
          this.setErrorMessage('Sorry... Something went bad server-side.')
        } else {
          this.setErrorMessage(err.message)
        }
      }

      this.loading = false
    }
  }
}
</script>
