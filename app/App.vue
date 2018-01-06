<template>
  <v-app class="white">
    <v-content>
      <v-container
        fluid
        class="pa-0"
      >
        <router-view/>
      </v-container>
    </v-content>
    <v-btn
      fab
      bottom
      right
      color="red"
      dark
      fixed
      @click.stop="showCreateContact = true"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog
      model="visible"
      max-width="500"
      v-model="showCreateContact"
    >
      <CreateContact @closeModal="showCreateContact = false"/>
    </v-dialog>
    <v-snackbar
      :timeout="6000"
      bottom
      v-model="showSnack"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-app>
</template>

<script>
import CreateContact from './components/CreateContact'
import { mapGetters } from 'vuex'

export default {
  components: {
    CreateContact
  },
  data () {
    return {
      showCreateContact: false,
      showSnack: false
    }
  },
  computed: {
    ...mapGetters(['errorMessage'])
  },
  watch: {
    errorMessage (val) {
      this.showSnack = !!val
    }
  }
}
</script>

<style lang="stylus">
@import './stylus/main'
</style>
