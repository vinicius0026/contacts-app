<template>
  <div>
    <v-layout>
      <v-flex xs10>
        <v-subheader class="pl-0">
          <span>
            <v-icon class="mr-3">location_on</v-icon>
            Addresses
          </span>
        </v-subheader>
      </v-flex>
      <v-flex
        xs2
        class="text-xs-right"
      >
        <v-btn
          icon
          class="mr-0"
          @click="addAddress"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout
      v-for="(address, i) in addresses"
      :key="i"
      wrap
      class="mb-2 pa-2 address-block"
    >
      <v-flex xs4>
        <v-text-field
          v-model="address.number"
          label="Number"
          class="pr-1"
          hide-details
          maxlength="10"
        />
      </v-flex>
      <v-flex xs8>
        <v-text-field
          v-model="address.street"
          label="Street"
          hide-details
          maxlength="100"
        />
      </v-flex>
      <v-flex xs6>
        <v-text-field
          v-model="address.city"
          label="City"
          class="pr-1"
          hide-details
          maxlength="100"
        />
      </v-flex>
      <v-flex xs2>
        <v-text-field
          v-model="address.state"
          label="State"
          class="pr-1"
          hide-details
          maxlength="2"
        />
      </v-flex>
      <v-flex xs4>
        <v-text-field
          v-model="address.zip"
          label="Zip code"
          hide-details
          maxlength="10"
        />
      </v-flex>
      <v-flex class="text-xs-center">
        <v-btn
          icon
          @click="removeAddress(i)"
        >
          <v-icon>delete</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      addresses: []
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
  },
  methods: {
    addAddress () {
      this.addresses.push({})
    },
    removeAddress (i) {
      this.addresses.splice(i, 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
.address-block:not(:last-child)
  border-bottom 1px solid rgba(0,0,0,.25)
</style>
