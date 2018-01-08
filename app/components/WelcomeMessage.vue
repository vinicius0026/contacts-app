<template>
  <v-card
    class="elevation-0"
  >
    <v-card-title primary-title>
      <h3 class="headline">
        Welcome to Contacts App
      </h3>
    </v-card-title>
    <v-card-text>
      <p>Add new contacts by clicking on the <v-icon>add</v-icon> button on the bottom right corner.</p>
      <p v-if="contacts.length">Or search your existing contacts and click on the names to see the contacts details.</p>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['contacts'])
  }
}
</script>
