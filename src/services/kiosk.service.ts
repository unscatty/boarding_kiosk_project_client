import axios from 'axios';
import { AxiosInstance } from 'axios';

export class KioskService {
  protected axiosInstance: AxiosInstance;

  constructor(protected baseURL: string) {
    this.axiosInstance = axios.create({ baseURL });
  }

  async validateIdentityDocument(docFile: File) {
    const formdata = new FormData();
    formdata.append('id_document', docFile);

    const response = await this.axiosInstance.post('/identity-file', formdata, {
      headers: { ContentType: 'multipart/form-data' },
    });

    return response.data;
  }
}

const kioskService = new KioskService('http://localhost:5000');

export default kioskService;
