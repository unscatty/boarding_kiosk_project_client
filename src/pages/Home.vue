<template>
  <div>
    <div></div>
    <v-btn
      @click="
        showModal = true;
        dialogTitle = 'Select your identity document';
      "
      >Select identity document
    </v-btn>
    <!-- <v-btn @click="">Validate</v-btn> -->

    <file-dialog
      :title="dialogTitle"
      :show-dialog="showModal"
      @close="onModalClosed"
      @selected="verify"
    ></file-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileDialog, { UploadResult } from '@/components/file-dialog.vue';
import kioskService, { KioskService } from '@/services/kiosk.service';

@Component({ components: { FileDialog } })
export default class Home extends Vue {
  dialogTitle = '';
  showModal = false;

  kiokskService: KioskService = kioskService;

  onModalClosed() {
    this.showModal = false;
  }

  async verify(result: UploadResult) {
    const response = await this.kiokskService.validateIdentityDocument(result.file);
    console.log(response);
  }
}
</script>
