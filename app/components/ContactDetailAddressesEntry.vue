<template>
  <div>
    <ContactDetailGroupEntry
      v-if="!editMode"
      v-model="addressesText"
      icon="location_on"
    />
    <AddressesInput
      v-else
      class="pl-4"
      v-model="addresses"
    />
  </div>
</template>

<script>
import AddressesInput from './AddressesInput'
import ContactDetailGroupEntry from './ContactDetailGroupEntry'

export default {
  components: {
    AddressesInput,
    ContactDetailGroupEntry
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addresses: []
    }
  },
  computed: {
    addressesText: {
      get () {
        return this.value && this.value.map(addr => `${addr.number} ${addr.street} - ${addr.city}, ${addr.state} ${addr.zip}`)
      },
      set () {}
    }
  },
  watch: {
    value (val) {
      this.addresses = val
    },
    addresses (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.addresses = this.value
  }
}
</script>
