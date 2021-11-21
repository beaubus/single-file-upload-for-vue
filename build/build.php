<?php

$file1 = file_get_contents('./dist/single-file-upload-for-vue.min.js');
$file2 = file_get_contents('./dist/vue3/single-file-upload-for-vue.min.js');

$file1 = str_replace('var SingleFileUploadForVue=', "var SingleFileUploadForVue=Vue.version[0]==='2'?", $file1);
$file1 = substr($file1, 0, -1).':';

$file2 = str_replace('var SingleFileUploadForVue=', '', $file2);

file_put_contents('./dist/min.js', $file1 . $file2);
