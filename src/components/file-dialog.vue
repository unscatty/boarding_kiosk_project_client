<template>
  <v-dialog v-model="show" max-width="750">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-img v-if="fileURL && extension(fileURL) !== '.pdf'" :src="fileURL" alt="" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary darken-1" text @click="cancel">Cancel</v-btn>
        <!-- <span v-if="filename">{{ filename }}</span>
        <br /> -->
        <v-spacer></v-spacer>
        <input
          ref="uploader"
          class="d-none"
          type="file"
          accept="image/*,.pdf"
          @change="onFileChanged"
        />
        <v-btn color="success" @click="selectFile"
          ><v-icon left> mdi-cloud-upload </v-icon>{{ filename || 'Select a file' }}</v-btn
        >
        <v-btn color="secondary darken-1" text @click="upload">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Ui from '@/store/modules/ui';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { extension } from '@/utils/text.util';

const uiStore = namespace('Ui');

export interface UploadResult {
  file: File;
  dataURL: string;
}

@Component
export default class FileDialog extends Vue {
  @Prop({ type: String, required: false, default: 'Select a file' })
  title: string;

  @Prop({ default: false })
  showDialog: boolean;

  file: File;

  fileURL = '';
  filename = '';

  @uiStore.Action
  showToast: typeof Ui.prototype.showToast;

  extension = extension;

  get show() {
    return this.showDialog;
  }

  set show(value) {
    if (!value) {
      this.close();
    }
  }

  reset() {
    this.fileURL = '';
    this.file = null;
    this.filename = '';
  }

  cancel() {
    this.reset();
    this.show = false;
  }

  @Emit()
  close() {
    return;
  }

  @Emit()
  selected(result: UploadResult) {
    return result;
  }

  upload() {
    return this.selected({
      file: this.file,
      dataURL: this.fileURL,
    });
  }

  selectFile() {
    const uploaderRef = this.$refs.uploader as any;
    uploaderRef.click();
  }

  onFileChanged(e: Event) {
    const { files } = e.target as HTMLInputElement;

    if (files && files[0]) {
      const selectedFile = files[0];

      this.fileURL = URL.createObjectURL(selectedFile);
      this.file = selectedFile;
      this.filename = selectedFile.name;
    }
  }

  // async crop() {
  //   const result = await this.getCropResult();

  //   this.selected(result);

  //   // Close
  //   this.show = false;
  // }

  // async getCropResult(): Promise<CropResult> {
  //   const result: CropResult = {
  //     blob: undefined,
  //     imageSrc: '',
  //   };

  //   const { canvas } = this.cropperRef.getResult();

  //   result.blob = await canvasToBlob(canvas, this.imageType || undefined);
  //   result.imageSrc = URL.createObjectURL(result.blob);

  //   return result;
  // }

  onError() {
    // Show error message
    this.showToast({
      text: 'No se puede recortar esta imagen',
      color: 'error',
    });

    // Close dialog
    this.show = false;
  }
}
</script>
