import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = environment.serverUrl + '/Files';

  constructor(private http: HttpClient) {}

  upload(
    id: string,
    description: string,
    file: File
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/` + id + '?description=' + description,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
        // withCredentials: true,
      }
    );

    return this.http.request(req);
  }

  downloadFile(id: string, filename: string, contentType: string): any {
    return this.http.get(
      this.baseUrl +
        '/' +
        id +
        '?name=' +
        filename +
        '&contentType=' +
        contentType,
      {
        responseType: 'blob',
        // withCredentials: true,
      }
    );
  }

  deleteFile(id: string, filename: string, fileId: string): any {
    return this.http.delete(
      this.baseUrl + '/' + id + '?fileName=' + filename + '&fileId=' + fileId,
      {
        // withCredentials: true,
      }
    );
  }

  getViewableLink(id: string, name: string) {
    return this.http.get(
      this.baseUrl + '/CreateViewableLink/' + id + '?name=' + name,
      {
        responseType: 'text',
        // withCredentials: true,
      }
    );
  }

  destroyViewableLink(id: string, name: string) {
    return this.http.delete(this.baseUrl + '/DestroyViewableLink/' + id + '?name=' + name,
    {
      // withCredentials: true,
    });
  }
}
