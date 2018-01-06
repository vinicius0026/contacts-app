<template>
  <v-layout class="pa-2 mt-2">
    <v-flex
      xs1
      class="text-xs-right pr-3"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-flex>
    <v-flex xs11>{{ text }}</v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
