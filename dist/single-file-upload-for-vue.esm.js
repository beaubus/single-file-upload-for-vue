//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: 'single-file-upload-for-vue',
  props: {
    name: {
      type: String,
      default: 'file_input'
    },
    store_url: {
      type: String,
      default: '/url-to-backend-store'
    },
    destroy_url: {
      type: String,
      default: '/url-to-backend-destroy'
    },
    headers: Object,
    loaded: Object
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
    }

  },
  methods: {
    dropFile(event) {
      this.$refs['file-input'].files = event.dataTransfer.files;
      this.uploadTemporaryFile();
    },

    triggerFileSelect() {
      this.$refs['file-input'].click();
    },

    uploadTemporaryFile() {
      let files = this.$refs['file-input'].files;
      let form_data = new FormData();
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

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    class: [{
      dragging: _vm.is_dragging
    }, {
      failed: _vm.error
    }, 'single-file-upload-for-vue'],
    on: {
      "dragover": function ($event) {
        $event.preventDefault();
      },
      "dragenter": function ($event) {
        !_vm.uploaded_file.name ? _vm.is_dragging = true : _vm.is_dragging = false;
      },
      "dragleave": function ($event) {
        _vm.is_dragging = false;
      },
      "drop": function ($event) {
        $event.preventDefault();
        return _vm.dropFile.apply(null, arguments);
      },
      "click": _vm.triggerFileSelect
    }
  }, [_c('input', {
    ref: "file-input",
    attrs: {
      "type": "file"
    },
    on: {
      "change": _vm.uploadTemporaryFile
    }
  }), _vm._v("\n    " + _vm._s(_vm.currentMessage) + "\n\n    "), _vm.uploaded_file.name ? _c('div', {
    on: {
      "click": function ($event) {
        $event.stopPropagation();
      }
    }
  }, [_c('div', {
    staticClass: "file"
  }, [_c('p', [_c('a', {
    attrs: {
      "target": "_blank",
      "href": _vm.uploaded_file.url
    }
  }, [_vm._v(_vm._s(_vm.uploaded_file.name))])]), _vm._v(" "), _c('p', [_vm._v(_vm._s(!_vm.error ? _vm.uploaded_file.size + 'B' : _vm.error))]), _vm._v(" "), _c('p', [_c('svg', {
    ref: "delete-button",
    attrs: {
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 20 20"
    },
    on: {
      "click": _vm.removeTemporaryFile
    }
  }, [_c('path', {
    attrs: {
      "d": "M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"
    }
  })])])])]) : _vm._e()]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-588033f3_0", {
    source: ".single-file-upload-for-vue{width:100%;height:100%;font-size:.75em;border:2px dashed #d3d3d3;background:#f1f1f1;display:flex;align-items:center;justify-content:center;cursor:pointer;text-align:center;overflow:scroll}.single-file-upload-for-vue.dragging{filter:brightness(.9)}.single-file-upload-for-vue>input{display:none}.single-file-upload-for-vue>div{max-width:100%;padding:1rem}.single-file-upload-for-vue .file{overflow:hidden}.single-file-upload-for-vue .file>p:nth-of-type(1){overflow:hidden;text-overflow:ellipsis;direction:rtl;text-align:left}.single-file-upload-for-vue .file>p:nth-of-type(1)>a{white-space:nowrap}.single-file-upload-for-vue .file>p:nth-of-type(3){text-align:center;padding-top:.5rem;margin-bottom:0;line-height:1}.single-file-upload-for-vue .file>p:nth-of-type(3)>svg{fill:red;height:1rem;width:1rem;cursor:pointer}.single-file-upload-for-vue.failed{border:2px dashed #d50000;background:#ffecec}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var component = __vue_component__;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = component; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('SingleFileUploadForVue', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
