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
      class="grey lighten-4 mb-2 pa-2"
    >
      <v-flex xs4>
        <v-text-field
          v-model="address.number"
          placeholder="Number"
          class="pr-1"
        />
      </v-flex>
      <v-flex xs8>
        <v-text-field
          v-model="address.street"
          placeholder="Street"
        />
      </v-flex>
      <v-flex xs6>
        <v-text-field
          v-model="address.city"
          placeholder="City"
          class="pr-1"
        />
      </v-flex>
      <v-flex xs2>
        <v-text-field
          v-model="address.state"
          placeholder="State"
          class="pr-1"
        />
      </v-flex>
      <v-flex xs4>
        <v-text-field
          v-model="address.zip"
          placeholder="Zip code"
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
    addresses (val) {
      this.$emit('input', val.filter(a => Object.keys(a).length))
    }
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
