<template>
  <div>
    <ContactDetailEntry
      v-for="i in entries.length"
      v-model="entries[i - 1]"
      :key="i"
      :icon="i === 1 ? icon : ''"
      :edit-mode="editMode"
      :append-icon-edit="i === entries.length ? 'add' : 'remove'"
      @appendIconClicked="addOrRemoveEntry(i)"
    />
  </div>
</template>

<script>
import ContactDetailEntry from './ContactDetailEntry'
export default {
  components: {
    ContactDetailEntry
  },
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
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      entries: []
    }
  },
  watch: {
    value (val) {
      this.entries = val
    },
    entries (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.entries = this.value
  },
  methods: {
    addOrRemoveEntry (i) {
      if (i === this.entries.length) {
        this.entries.push('')
        return
      }
      this.entries.splice(i - 1, 1)
    }
  }
}
</script>
