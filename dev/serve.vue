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
    <single-file-upload-for-vue :headers="{'Accept': 'application/json'}"
                                :loaded="{url: 'https://urlofthetestfileserver.dev/gOm8aODn5RdBwktjqKU280K7JNuyK8mMB8iq8ieb.pdf', size: 56}"
                                store_url="/backend_store_url"
                                destroy_url="/backend_destroy_url"
                                @complete="uploadComplete"
    ></single-file-upload-for-vue>
  </div>
</template>
