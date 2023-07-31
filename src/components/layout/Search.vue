<template>
  <form class="search" style="z-index: 8" role="search">
    <v-text-field
      label="Search"
      solo
      append-icon="mdi-magnify"
      clearable
      hide-details
      class="search-field"
      v-model="textTerm"
      @input="searchText"
      type=""
      ria-label="Search"
      @focus="isHovered = true"
      @blur="isHovered = false"
      @keyup.enter="doSearch"
    ></v-text-field>
  </form>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {};
  },
};
</script>
<style scoped>
label.v-label.theme--light {
  font-size: 14px;
}
</style>