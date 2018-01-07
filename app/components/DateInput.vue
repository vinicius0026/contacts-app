<template>
  <v-menu
    lazy
    :close-on-content-click="false"
    v-model="showPicker"
    transition="scale-transition"
    offset-y
    full-width
    :nudge-right="40"
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      :label="hideLabel ? '' : 'Birthday'"
      v-model="date"
      readonly
      :class="{ 'pt-0': removeTopPadding }"
    />
    <v-date-picker
      v-model="date"
      no-title
      scrollable
      actions
    >
      <template slot-scope="{ save, cancel }">
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            flat
            @click="save"
          >
            OK
          </v-btn>
        </v-card-actions>
      </template>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { format } from 'date-fns'
export default {
  props: {
    value: {
      type: null,
      default: null
    },
    hideLabel: {
      type: Boolean,
      default: false
    },
    removeTopPadding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: null,
      showPicker: false
    }
  },
  watch: {
    date (val) {
      const [year, month, day] = val.split('-')
      this.$emit('input', new Date(year, month - 1, day))
    }
  },
  mounted () {
    if (this.value) {
      this.date = format(this.value, 'YYYY-MM-DD')
    }
  }
}
</script>
