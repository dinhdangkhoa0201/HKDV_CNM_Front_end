import { FileAvatar } from './../_interfaces/file-avatar';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

const API_URL = environment.API_URL + '/api/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  uploadAvatar(file, userId): Observable<any> {
    const url = `${API_URL}/upload-avatar/${userId}`;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    // return this.httpClient.post<FileAvatar>(url, { file: file });
    return this.httpClient.post<FileAvatar>(url, formData, { observe: 'response' })
  }

  downloadAvatar(userId): Observable<any> {
    const url = `${API_URL}/download-avatar/${userId}`;
    return this.httpClient.get(url, { responseType: 'arraybuffer' });
  }
}
