import { Group, Product, ResponseMessage } from 'src/app/common/common.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  baseUrl: string = 'https://localhost:8080/api';

  constructor(private httpClient: HttpClient) { }

  async getAllGroups(): Promise<Group[]> {
    const response = await firstValueFrom(this.httpClient.get<Group[]>(this.baseUrl + '/group', {
      observe: 'body'
    }));
    return response;
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await firstValueFrom(this.httpClient.get<Product[]>(this.baseUrl + '/product', {
      observe: 'body'
    }));
    
    return response;
  }

  async getGroupById(id: string): Promise<ResponseMessage> {
    const response = await axios.get(this.baseUrl + `/group/`);
    console.log('response', response);
    return Promise.resolve({
      code: response.status,
      text: response.data
    });
  }

  async updateProduct(product: Product): Promise<ResponseMessage> {
    try {
      const response = await axios.put(this.baseUrl + `/product/${product.id}`, product);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async updateGroup(group: Group): Promise<ResponseMessage> {
    try {
      const response = await axios.put(this.baseUrl + `/group/${group.id}`, group);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async getProductsForGroup(groupName: string): Promise<ResponseMessage> {
    const objectToSend = {
      groupStart: groupName
    }
    try {
      const response = await axios.post(this.baseUrl + '/search', objectToSend);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async addProduct(name: string, count: number): Promise<ResponseMessage> {
    const objectToSend = {
      name: name,
      count: count
    }
    let response;
    try {
      response = await axios.post(this.baseUrl + '/add/product', objectToSend);
      return Promise.resolve({
        code: response.status,
        text: response.data
      })
    } catch (err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
    
  }

  async removeProduct(name: string, count: number): Promise<ResponseMessage> {
    const objectToSend = {
      name: name,
      count: count
    }
    try {
      const response = await axios.post(this.baseUrl + '/remove/product', objectToSend);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async addGroup(group: Group): Promise<ResponseMessage> {
    try {
      const response = await axios.post(this.baseUrl + '/group', group);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async addProductToGroup(product: Product): Promise<ResponseMessage> {
    try {
      console.log('product', product);
      const response = await axios.post(this.baseUrl + '/product', product);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async deleteGroup(id: number): Promise<void> {
    try {
      await axios.delete(this.baseUrl + `/group/${id}`);
    } catch(err) {
      console.log('Error while removing group');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await axios.delete(this.baseUrl + `/product/${id}`);
    } catch(err) {
      console.log('Error while removing group');
    }
  }

  async filterProducts(filter: any): Promise<ResponseMessage> {
    try {
      const response = await axios.post(this.baseUrl + '/search', filter);
      return Promise.resolve({
        code: response.status,
        text: response.data
      });
    } catch(err) {
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }

  async getTotalCost(): Promise<ResponseMessage> {
    try {
      const response = await axios.get(this.baseUrl + '/stats');
      console.log(response);
      return Promise.resolve({
        code: response.status,
        text: response.data.price
      });
    } catch(err) {
      console.log(err)
      return Promise.resolve({
        code: err.response.status,
        text: err.response.data
      });
    }
  }
}
