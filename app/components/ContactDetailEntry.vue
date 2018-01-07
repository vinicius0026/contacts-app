<template>
  <v-layout class="pa-2 mt-2">
    <v-flex
      xs1
      class="text-xs-right pr-3"
    >
      <v-icon>{{ icon }}</v-icon>
    </v-flex>
    <v-flex
      xs11
      v-if="!editMode"
    >
      {{ value }}
    </v-flex>
    <v-flex
      xs11
      v-else
    >
      <v-text-field
        v-model="text"
        hide-details
        class="pt-0"
        :append-icon="appendIconEdit"
        :append-icon-cb="appendIconClicked"
        :type="type"
        maxlength="100"
      />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    appendIconEdit: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      text: ''
    }
  },
  watch: {
    value (val) {
      this.text = val
    },
    text (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.text = this.value
  },
  methods: {
    appendIconClicked () {
      this.$emit('appendIconClicked')
    }
  }
}
</script>
