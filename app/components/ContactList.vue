<template>
  <v-flex
    xs12
    sm6
    md4
  >
    <v-list>
      <v-list-tile
        v-for="contact in contacts"
        :key="contact.id"
        @click="selectContact(contact)"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{ contact.fullName }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['contacts'])
  },
  methods: {
    ...mapMutations(['selectContact'])
  }
}
</script>
