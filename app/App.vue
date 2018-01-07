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
      @click.stop="createContact"
    >
      <v-icon>add</v-icon>
    </v-btn>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
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
  },
  methods: {
    ...mapMutations(['selectContact']),
    createContact () {
      this.selectContact({
        phoneNumbers: [''],
        emails: [''],
        addresses: []
      })
    }
  }
}
</script>

<style lang="stylus">
@import './stylus/main'
</style>
