import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient) { }

  async getAllGroups() {
    const response = await firstValueFrom(this.httpClient.get<any>('https://localhost:8080/api/group', {
      observe: 'body'
    }));
    console.log(response);
  }
}
