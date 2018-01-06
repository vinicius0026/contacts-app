<template>
  <div>
    <v-text-field
      v-for="i in numberOfEntries"
      :key="i"
      :label="label"
      v-model="entries[i - 1]"
      :prepend-icon="icon"
      :append-icon="i === numberOfEntries ? 'add' : 'remove'"
      :append-icon-cb="addOrRemoveEntry(i)"
      :type="type"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
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
      entries: ['']
    }
  },
  computed: {
    numberOfEntries () {
      return this.entries.length
    }
  },
  watch: {
    entries (val) {
      this.$emit('input', val.filter(p => !!p))
    }
  },
  methods: {
    addOrRemoveEntry (i) {
      return () => {
        if (i === this.numberOfEntries) {
          this.entries.push('')
          return
        }
        this.entries.splice(i - 1, 1)
      }
    }
  }
}
</script>
