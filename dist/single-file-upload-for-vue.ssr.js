'use strict';function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}//
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
  data: function data() {
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
    currentMessage: function currentMessage() {
      if (this.error && !this.uploaded_file.name) return this.error; // file not uploaded, error

      if (this.uploaded_file.name) return ''; // we have a file

      return this.message; // default message
    }
  },
  methods: {
    dropFile: function dropFile(event) {
      this.$refs['file-input'].files = event.dataTransfer.files;
      this.uploadTemporaryFile();
    },
    triggerFileSelect: function triggerFileSelect() {
      this.$refs['file-input'].click();
    },
    uploadTemporaryFile: function uploadTemporaryFile() {
      var _this = this;

      var files = this.$refs['file-input'].files;
      var form_data = new FormData();
      this.error = ''; // reset the error

      form_data.append(this.name, files[0]);
      this.message = 'uploading...';
      fetch(this.store_url, {
        method: 'POST',
        body: form_data,
        headers: this.headers // make Laravel return JSON if validation fails

      }).then(function (response) {
        if (!response.ok) return response.json().then(function (error) {
          throw error;
        });
        return response.json();
      }).then(function (data) {
        if (!data.url) throw 'No url provided...';
        _this.message = _this.default_message;
        _this.is_dragging = false; // display file name and size

        _this.message = '';
        _this.error = '';
        _this.uploaded_file.name = data.url.substring(data.url.lastIndexOf('/') + 1);
        _this.uploaded_file.url = data.url;
        _this.uploaded_file.size = data.size;

        _this.$emit('complete', data);
      }).catch(function (error) {
        var _error$message;

        return _this.error = (_error$message = error === null || error === void 0 ? void 0 : error.message) !== null && _error$message !== void 0 ? _error$message : error;
      });
    },
    removeTemporaryFile: function removeTemporaryFile() {
      var _this2 = this;

      if (!this.uploaded_file.url) throw 'Url for uploaded file is not provided';

      if (this.$refs['delete-button'].style.filter === 'brightness(75%)') {
        fetch(this.destroy_url + '/' + this.uploaded_file.name, {
          method: 'DELETE',
          headers: this.headers // make Laravel return JSON if validation fails

        }).then(function (response) {
          if (!response.ok) return response.json().then(function (error) {
            throw error;
          });
          return response.json();
        }).then(function (data) {
          if (!data.result) throw 'File is not deleted...';
          _this2.uploaded_file.name = '';
          _this2.uploaded_file.url = '';
          _this2.uploaded_file.size = 0;
          _this2.message = _this2.default_message;
          _this2.error = '';
          _this2.$refs['delete-button'].style.filter = '';
        }).catch(function (error) {
          var _error$message2;

          _this2.$refs['delete-button'].style.filter = '';
          _this2.error = (_error$message2 = error === null || error === void 0 ? void 0 : error.message) !== null && _error$message2 !== void 0 ? _error$message2 : error;
        });
        return;
      }

      this.$refs['delete-button'].style.filter = 'brightness(75%)';
    }
  },
  created: function created() {
    this.message = this.default_message;

    if (this.loaded) {
      this.uploaded_file.name = this.loaded.url.substring(this.loaded.url.lastIndexOf('/') + 1);
      this.uploaded_file.url = this.loaded.url;
      this.uploaded_file.size = this.loaded.size;
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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
      "dragover": function dragover($event) {
        $event.preventDefault();
      },
      "dragenter": function dragenter($event) {
        !_vm.uploaded_file.name ? _vm.is_dragging = true : _vm.is_dragging = false;
      },
      "dragleave": function dragleave($event) {
        _vm.is_dragging = false;
      },
      "drop": function drop($event) {
        $event.preventDefault();
        return _vm.dropFile.apply(null, arguments);
      },
      "click": _vm.triggerFileSelect
    }
  }, [_vm._ssrNode("<input type=\"file\">" + _vm._ssrEscape("\n    " + _vm._s(_vm.currentMessage) + "\n\n    ") + (_vm.uploaded_file.name ? "<div><div class=\"file\"><p><a target=\"_blank\"" + _vm._ssrAttr("href", _vm.uploaded_file.url) + ">" + _vm._ssrEscape(_vm._s(_vm.uploaded_file.name)) + "</a></p> <p>" + _vm._ssrEscape(_vm._s(!_vm.error ? _vm.uploaded_file.size + 'B' : _vm.error)) + "</p> <p><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><path d=\"M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z\"></path></svg></p></div></div>" : "<!---->"))]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-588033f3_0", {
    source: ".single-file-upload-for-vue{width:100%;height:100%;font-size:.75em;border:2px dashed #d3d3d3;background:#f1f1f1;display:flex;align-items:center;justify-content:center;cursor:pointer;text-align:center;overflow:scroll}.single-file-upload-for-vue.dragging{filter:brightness(.9)}.single-file-upload-for-vue>input{display:none}.single-file-upload-for-vue>div{max-width:100%;padding:1rem}.single-file-upload-for-vue .file{overflow:hidden}.single-file-upload-for-vue .file>p:nth-of-type(1){overflow:hidden;text-overflow:ellipsis;direction:rtl;text-align:left}.single-file-upload-for-vue .file>p:nth-of-type(1)>a{white-space:nowrap}.single-file-upload-for-vue .file>p:nth-of-type(3){text-align:center;padding-top:.5rem;margin-bottom:0;line-height:1}.single-file-upload-for-vue .file>p:nth-of-type(3)>svg{fill:red;height:1rem;width:1rem;cursor:pointer}.single-file-upload-for-vue.failed{border:2px dashed #d50000;background:#ffecec}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = "data-v-588033f3";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);

var component$1 = __vue_component__;// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = component$1; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('SingleFileUploadForVue', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default':component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;