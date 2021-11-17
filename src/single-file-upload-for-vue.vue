<template>
    <div :class="[{ dragging: is_dragging }, {failed: error}, 'single-file-upload-for-vue']"
         @dragover.prevent=""
         @dragenter="!uploaded_file.name ? is_dragging = true : is_dragging = false"
         @dragleave="is_dragging = false"
         @drop.prevent="dropFile"
         @click="triggerFileSelect"
    >
        <input type="file"
               @change="uploadTemporaryFile"
               ref="file-input"
        >
        {{ currentMessage }}

        <div v-if="uploaded_file.name" @click.stop="">
            <div class="file">
                <p>
                    <a target="_blank" :href="uploaded_file.url">{{ uploaded_file.name }}</a>
                </p>
                <p>{{ !error ? uploaded_file.size + 'B' : error}}</p>
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20"
                         ref="delete-button"
                         @click="removeTemporaryFile"
                    >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z"></path>
                    </svg>
                </p>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'single-file-upload-for-vue',

    props: ['name', 'headers', 'store_url', 'destroy_url', 'loaded'],

    data()
    {
        return {
            is_dragging: false,
            uploaded_file: {
                name: '',
                url: '',
                size: 0,
            },
            default_message: 'Drop files in here or click to upload',
            message: '',
            error: '',
        }
    },

    computed: {
        currentMessage()
        {
            if (this.error && !this.uploaded_file.name) return this.error // file not uploaded, error
            if (this.uploaded_file.name) return '' // we have a file
            return this.message // default message
        }
    },

    methods: {
        dropFile(event)
        {
            this.$refs['file-input'].files = event.dataTransfer.files

            this.uploadTemporaryFile()
        },

        triggerFileSelect()
        {
            this.$refs['file-input'].click();
        },

        uploadTemporaryFile() {
            let files = this.$refs['file-input'].files
            let form_data = new FormData()

            this.error = ''; // reset the error
            form_data.append(this.name ?? 'file_input', files[0])

            this.message = 'uploading...'

            fetch(this.store_url, {
                method: 'POST',
                body: form_data,
                headers: this.headers // make Laravel return JSON if validation fails
            })
            .then(response => {
                if (!response.ok) return response.json().then(error => {throw error})
                return response.json()
            })
            .then(data => {
                if (!data.url) throw 'No url provided...';
                this.message = this.default_message
                this.is_dragging = false

                // display file name and size
                this.message = '';
                this.error = ''
                this.uploaded_file.name = data.url.substring(data.url.lastIndexOf('/')+1)
                this.uploaded_file.url = data.url;
                this.uploaded_file.size = data.size;

                this.$emit('complete', data)
            })
            .catch(error => this.error = error?.message ?? error )
        },

        removeTemporaryFile()
        {
            if (!this.uploaded_file.url) throw 'Url for uploaded file is not provided'

            if (this.$refs['delete-button'].style.filter === 'brightness(75%)') {
                fetch(this.destroy_url + '/' + this.uploaded_file.name, {
                    method: 'DELETE',
                    headers: this.headers // make Laravel return JSON if validation fails
                })
                .then(response => {
                    if (!response.ok) return response.json().then(error => {throw error})
                    return response.json()
                })
                .then(data => {
                    if (!data.result) throw 'File is not deleted...'

                    this.uploaded_file.name = ''
                    this.uploaded_file.url = ''
                    this.uploaded_file.size = 0
                    this.message = this.default_message
                    this.error = ''
                    this.$refs['delete-button'].style.filter = ''
                })
                .catch(error => {
                    this.$refs['delete-button'].style.filter = ''
                    this.error = error?.message ?? error
                })

                return
            }

            this.$refs['delete-button'].style.filter = 'brightness(75%)'
        }
    },

    created()
    {
        this.message = this.default_message

        if (this.loaded) {
            this.uploaded_file.name = this.loaded.url.substring(this.loaded.url.lastIndexOf('/')+1)
            this.uploaded_file.url = this.loaded.url;
            this.uploaded_file.size = this.loaded.size;
        }
    }
};
</script>


<style>
    .single-file-upload-for-vue {
        width: 100%;
        height: 100%;
        font-size: .75em;
        border: 2px dashed lightgray;
        background: #f1f1f1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        text-align: center;
        overflow: scroll;
    }

    .single-file-upload-for-vue.dragging {
        filter: brightness(0.9);
    }

    .single-file-upload-for-vue > input{
        display: none;
    }

    .single-file-upload-for-vue > div {
        max-width: 100%;
        padding: 1rem;
    }

    .single-file-upload-for-vue .file {
        overflow: hidden;
    }

    .single-file-upload-for-vue .file >p:nth-of-type(1) {
        overflow: hidden;
        text-overflow: ellipsis;
        direction: rtl;
        text-align: left;
    }

    .single-file-upload-for-vue .file >p:nth-of-type(1) > a {
        white-space: nowrap;
    }

    .single-file-upload-for-vue .file >p:nth-of-type(3) {
        text-align: center;
        padding-top: .5rem;
        margin-bottom: 0;
        line-height: 1;
    }

    .single-file-upload-for-vue .file >p:nth-of-type(3) > svg {
        fill: #FF0000;
        height: 1rem;
        width: 1rem;
        cursor: pointer;
    }

    .single-file-upload-for-vue.failed {
        border: 2px dashed #d50000;
        background: #ffecec;
    }
</style>

