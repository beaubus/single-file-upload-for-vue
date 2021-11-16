# Simple single file upload with Drag'n'Drop for Vue2

<a href="https://www.npmjs.com/package/@beaubus/single-file-upload-for-vue">
    <img src="https://img.shields.io/npm/dt/@beaubus/single-file-upload-for-vue?logo=npm" alt="npm downnloads count">
</a>

<a href="https://github.com/beaubus/single-file-upload-for-vue/blob/master/LICENSE">
    <img alt="MIT" src="https://img.shields.io/github/license/beaubus/single-file-upload-for-vue">
</a>
&nbsp;&nbsp;
<a href="https://twitter.com/intent/follow?screen_name=daily_web_dev">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/daily_web_dev?style=social">
</a>

<br>
<br>

Modern upload input with Drag'n'Drop support, based on the Fetch Api (POST and DELETE methods). As simple and lightweight as possible.

![](demo.gif)

## Installation

NPM
```bash
npm i @beaubus/single-file-upload-for-vue
```

CDN
```bash
<script src="https://unpkg.com/@beaubus/single-file-upload-for-vue/dist/single-file-upload-for-vue.min.js"></script>
```

## Usage
```js
import single_file_upload_for_vue from '@beaubus/single-file-upload-for-vue';

components: {
    'single-file-upload-for-vue': single_file_upload_for_vue
}
```

Wrap component with `<div>` as it takes all the space:
```html
<div style="width:120px;height:120px">
    <single-file-upload-for-vue 
        :headers="{'Accept': 'application/json'}"
        :loaded="{url: 'https://full-url-to-your-file.pdf', size: 56}"
        store_url="/url-to-backend-store"
        destroy_url="/url-to-backend-destroy"
        @complete="uploadComplete"
    ></single-file-upload-for-vue>
</div>
```