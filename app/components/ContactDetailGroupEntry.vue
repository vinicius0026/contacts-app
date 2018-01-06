<template>
  <div>
    <ContactDetailEntry
      v-for="(entry, i) in entries"
      :key="i"
      :icon="i === 0 ? icon : ''"
      :text="entry"
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
    icon: {
      type: String,
      default: ''
    },
    entries: {
      type: Array,
      default: () => []
    }
  }
}
</script>
