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
      <v-card-title
        primary-title
        v-if="!editMode"
        style="padding-bottom: 2px"
      >
        <h3 class="headline" >
          {{ selectedContact.firstName }} {{ selectedContact.lastName }}
        </h3>
        <v-spacer/>
        <v-btn
          icon
          @click="switchToEditMode"
          v-if="!loading"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="handleRemoveContact"
          v-if="!loading"
        >
          <v-icon>delete</v-icon>
        </v-btn>
        <v-btn
          icon
          disabled
          v-else
        >
          <v-icon class="fa-spin">fa-spinner</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-title
        primary-title
        v-else
        class="pb-0"
      >
        <v-container class="pa-0">
          <v-layout>
            <v-flex xs5>
              <v-text-field
                v-model="editedContact.firstName"
                label="First Name"
                class="pr-1"
                hide-details
              />
            </v-flex>
            <v-flex xs5>
              <v-text-field
                v-model="editedContact.lastName"
                label="Last Name"
                hide-details
              />
            </v-flex>
            <v-flex
              xs2
              class="text-xs-right"
            >
              <v-btn
                icon
                @click="switchToViewMode"
                v-if="!loading"
              >
                <v-icon>clear</v-icon>
              </v-btn>
              <v-btn
                icon
                @click="handleCreateOrUpdate"
                v-if="!loading"
              >
                <v-icon>check</v-icon>
              </v-btn>
              <v-btn
                icon
                disabled
                v-else
              >
                <v-icon class="fa-spin">fa-spinner</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
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
            v-model="editedContact.phoneNumbers"
            :edit-mode="editMode"
          />
          <ContactDetailGroupEntry
            icon="email"
            v-model="editedContact.emails"
            :edit-mode="editMode"
          />
          <ContactDetailDateEntry
            v-model="editedContact.birthday"
            :edit-mode="editMode"
          />
          <ContactDetailAddressesEntry
            v-model="editedContact.addresses"
            :edit-mode="editMode"
          />
        </v-container>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { isEqual, cloneDeep } from 'lodash'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ContactDetailGroupEntry from './ContactDetailGroupEntry'
import ContactDetailDateEntry from './ContactDetailDateEntry'
import ContactDetailAddressesEntry from './ContactDetailAddressesEntry'
import { contact as validateContact } from '../util/validate'

export default {
  components: {
    ContactDetailAddressesEntry,
    ContactDetailDateEntry,
    ContactDetailGroupEntry
  },
  data () {
    return {
      editMode: false,
      editedContact: {},
      contact: {},
      loading: false
    }
  },
  computed: {
    ...mapGetters(['selectedContact'])
  },
  watch: {
    selectedContact () {
      this.contact = cloneDeep(this.selectedContact)
      this.editedContact = cloneDeep(this.selectedContact)

      if (!this.selectedContact || !this.selectedContact.id) {
        this.editMode = true
      } else {
        this.editMode = false
      }
    }
  },
  methods: {
    ...mapMutations(['setErrorMessage', 'selectContact']),
    ...mapActions(['removeContact', 'createOrUpdateContact']),
    async handleCreateOrUpdate () {
      this.loading = true

      try {
        validateContact.create(this.editedContact)
        await this.createOrUpdateContact(this.editedContact)
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
    },
    async handleRemoveContact () {
      if (!window.confirm('Do you really wanto to remove this contact? This action cannot be undone!')) {
        return
      }
      try {
        this.loading = true
        await this.removeContact(this.selectedContact.id)
      } catch (err) {
        this.setErrorMessage(err.message)
      }
      this.loading = false
    },
    switchToEditMode () {
      this.editMode = true
    },
    switchToViewMode () {
      if (isEqual(this.editedContact, this.contact)) {
        this.editMode = false
        if (!this.editedContact.id) {
          this.selectContact(null)
        }
        return
      }

      if (!window.confirm('All your changes will be lost. Confirm?')) {
        return
      }

      this.editedContact = cloneDeep(this.selectedContact)
      this.editMode = false

      if (!this.editedContact.id) {
        this.selectContact(null)
      }
    }
  }
}
</script>
