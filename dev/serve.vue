<script>
import Vue from 'vue';
import SingleFileUploadForVue from '@/single-file-upload-for-vue.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    SingleFileUploadForVue
  },
  methods: {
    uploadComplete(data)
    {
        console.log(data.url)
    }
  }

});
</script>

<template>
  <div id="app">
    <single-file-upload-for-vue
        :headers="{'Accept': 'application/json'}"
        accept=".pdf"
        store_url="/backend_store_url"
        destroy_url="/backend_destroy_url"
        @complete="uploadComplete"
    ></single-file-upload-for-vue>
  </div>
</template>
