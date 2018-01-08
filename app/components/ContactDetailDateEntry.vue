<template>
  <v-layout
    class="pa-2 mt-2"
    v-if="editMode || value"
  >
    <v-flex
      xs1
      class="text-xs-center"
    >
      <v-icon>cake</v-icon>
    </v-flex>
    <v-flex
      xs11
      v-if="!editMode"
      class="pl-3"
    >
      {{ text }}
    </v-flex>
    <v-flex
      xs11
      v-else
      class="pl-3"
    >
      <DateInput
        v-model="date"
        hide-label
        remove-top-padding
      />
    </v-flex>
  </v-layout>
</template>

<script>
import DateInput from './DateInput'
import { format } from 'date-fns'

export default {
  components: {
    DateInput
  },
  props: {
    value: {
      type: Date,
      default: null
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: null
    }
  },
  computed: {
    text () {
      if (this.value) {
        return format(this.value, 'MMM Do YYYY')
      }
      return ''
    }
  },
  watch: {
    value (val) {
      this.date = val
    },
    date (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.date = this.value
  }
}
</script>
