import { openBlock, createElementBlock, normalizeClass, withModifiers, createElementVNode, createTextVNode, toDisplayString, createCommentVNode } from 'vue';

var script = {
  name: 'single-file-upload-for-vue',
  props: {
    name: {
      type: String,
      default: 'file_input'
    },
    store_url: {
      type: String,
      default: '/store-url'
    },
    destroy_url: {
      type: String,
      default: '/destroy-url'
    },
    headers: Object,
    loaded: Object,
    accept: String
  },

  data() {
    return {
      is_dragging: false,
      uploaded_file: {
        name: '',
        url: '',
        size: 0
      },
      default_message: 'Drop files in here or click to upload',
      message: '',
      error: ''
    };
  },

  computed: {
    currentMessage() {
      if (this.error && !this.uploaded_file.name) return this.error; // file not uploaded, error

      if (this.uploaded_file.name) return ''; // we have a file

      return this.message; // default message
    },

    currentFileSize() {
      if (this.error) return this.error;
      let bytes = this.uploaded_file.size; // output formatted file size

      if (bytes === 0) return '0 B';
      const decimals = 2;
      const k = 1024;
      let dm = decimals;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

  },
  methods: {
    dropFile(event) {
      if (!event.dataTransfer.files || !event.dataTransfer.files[0]) return;

      if (this.accept) {
        // validate dropped file
        let array_of_accepted_files = this.accept.split(',');
        let file_name = event.dataTransfer.files[0].name || '';
        let mime_type = (event.dataTransfer.files[0].type || '').toLowerCase();
        let base_mime_type = mime_type.replace(/\/.*$/, '');
        let is_valid = array_of_accepted_files.some(type => {
          let valid_type = type.trim().toLowerCase();
          if (valid_type.charAt(0) === '.') return file_name.toLowerCase().endsWith(valid_type);
          if (valid_type.endsWith('/*')) return base_mime_type === valid_type.replace(/\/.*$/, '');
          return mime_type === valid_type;
        });

        if (!is_valid) {
          this.error = 'File type is not valid';
          this.is_dragging = false;
          return;
        }
      }

      this.$refs['file-input'].files = event.dataTransfer.files;
      this.uploadTemporaryFile();
    },

    triggerFileSelect() {
      this.$refs['file-input'].click();
    },

    uploadTemporaryFile() {
      let files = this.$refs['file-input'].files;
      let form_data = new FormData();
      if (!files[0]) return;
      this.is_dragging = false; // dragging is finished

      this.error = ''; // reset the error

      form_data.append(this.name, files[0]);
      this.message = 'uploading...';
      fetch(this.store_url, {
        method: 'POST',
        body: form_data,
        headers: this.headers // make Laravel return JSON if validation fails

      }).then(response => {
        if (!response.ok) return response.json().then(error => {
          throw error;
        });
        return response.json();
      }).then(data => {
        if (!data.url) throw 'No url provided...';
        this.message = this.default_message;
        this.is_dragging = false; // display file name and size

        this.message = '';
        this.error = '';
        this.uploaded_file.name = data.url.substring(data.url.lastIndexOf('/') + 1);
        this.uploaded_file.url = data.url;
        this.uploaded_file.size = data.size;
        this.$emit('complete', data);
      }).catch(error => this.error = (error === null || error === void 0 ? void 0 : error.message) ?? error);
    },

    removeTemporaryFile() {
      if (!this.uploaded_file.url) throw 'Url for uploaded file is not provided';

      if (this.$refs['delete-button'].style.filter === 'brightness(75%)') {
        fetch(this.destroy_url + '/' + this.uploaded_file.name, {
          method: 'DELETE',
          headers: this.headers // make Laravel return JSON if validation fails

        }).then(response => {
          if (!response.ok) return response.json().then(error => {
            throw error;
          });
          return response.json();
        }).then(data => {
          if (!data.result) throw 'File is not deleted...';
          this.uploaded_file.name = '';
          this.uploaded_file.url = '';
          this.uploaded_file.size = 0;
          this.message = this.default_message;
          this.error = '';
          this.$refs['delete-button'].style.filter = '';
        }).catch(error => {
          this.$refs['delete-button'].style.filter = '';
          this.error = (error === null || error === void 0 ? void 0 : error.message) ?? error;
        });
        return;
      }

      this.$refs['delete-button'].style.filter = 'brightness(75%)';
    }

  },

  created() {
    this.message = this.default_message;

    if (this.loaded) {
      this.uploaded_file.name = this.loaded.url.substring(this.loaded.url.lastIndexOf('/') + 1);
      this.uploaded_file.url = this.loaded.url;
      this.uploaded_file.size = this.loaded.size;
    }
  }

};

const _hoisted_1 = ["accept"];
const _hoisted_2 = {
  class: "file"
};
const _hoisted_3 = ["href"];

const _hoisted_4 = /*#__PURE__*/createElementVNode("path", {
  d: "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
}, null, -1);

const _hoisted_5 = [_hoisted_4];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass([{
      dragging: $data.is_dragging
    }, {
      failed: $data.error
    }, 'single-file-upload-for-vue']),
    onDragover: _cache[3] || (_cache[3] = withModifiers(() => {}, ["prevent"])),
    onDragenter: _cache[4] || (_cache[4] = $event => !$data.uploaded_file.name ? $data.is_dragging = true : $data.is_dragging = false),
    onDragleave: _cache[5] || (_cache[5] = $event => $data.is_dragging = false),
    onDrop: _cache[6] || (_cache[6] = withModifiers(function () {
      return $options.dropFile && $options.dropFile(...arguments);
    }, ["prevent"])),
    onClick: _cache[7] || (_cache[7] = function () {
      return $options.triggerFileSelect && $options.triggerFileSelect(...arguments);
    })
  }, [createElementVNode("input", {
    type: "file",
    accept: $props.accept,
    onChange: _cache[0] || (_cache[0] = function () {
      return $options.uploadTemporaryFile && $options.uploadTemporaryFile(...arguments);
    }),
    ref: "file-input"
  }, null, 40, _hoisted_1), createTextVNode(" " + toDisplayString($options.currentMessage) + " ", 1), $data.uploaded_file.name ? (openBlock(), createElementBlock("div", {
    key: 0,
    onClick: _cache[2] || (_cache[2] = withModifiers(() => {}, ["stop"]))
  }, [createElementVNode("div", _hoisted_2, [createElementVNode("p", null, [createElementVNode("a", {
    target: "_blank",
    href: $data.uploaded_file.url
  }, toDisplayString($data.uploaded_file.name), 9, _hoisted_3)]), createElementVNode("p", null, toDisplayString($options.currentFileSize), 1), createElementVNode("p", null, [(openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    ref: "delete-button",
    onClick: _cache[1] || (_cache[1] = function () {
      return $options.removeTemporaryFile && $options.removeTemporaryFile(...arguments);
    })
  }, _hoisted_5, 512))])])])) : createCommentVNode("", true)], 34);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.single-file-upload-for-vue {\n        width: 100%;\n        height: 100%;\n        font-size: .75em;\n        border: 2px dashed lightgray;\n        background: #f1f1f1;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        cursor: pointer;\n        text-align: center;\n        overflow: scroll;\n}\n.single-file-upload-for-vue.dragging {\n        filter: brightness(0.9);\n}\n.single-file-upload-for-vue > input{\n        display: none;\n}\n.single-file-upload-for-vue > div {\n        max-width: 100%;\n        padding: 1rem;\n}\n.single-file-upload-for-vue .file {\n        overflow: hidden;\n}\n.single-file-upload-for-vue .file >p:nth-of-type(1) {\n        overflow: hidden;\n        text-overflow: ellipsis;\n        direction: rtl;\n        text-align: left;\n}\n.single-file-upload-for-vue .file >p:nth-of-type(1) > a {\n        white-space: nowrap;\n}\n.single-file-upload-for-vue .file >p:nth-of-type(3) {\n        display: flex;\n        justify-content: center;\n        padding-top: .5rem;\n        margin-bottom: 0;\n        line-height: 1;\n}\n.single-file-upload-for-vue .file >p:nth-of-type(3) > svg {\n        fill: #FF0000;\n        height: 1rem;\n        width: 1rem;\n        cursor: pointer;\n}\n.single-file-upload-for-vue.failed {\n        border: 2px dashed #d50000;\n        background: #ffecec;\n}\n";
styleInject(css_248z);

script.render = render;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('SingleFileUploadForVue', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
