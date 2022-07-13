export interface Group {
  id?: number
  name: string,
  description: string 
}

export interface Product {
  id?:number
  name: string,
  description: string,
  vendor: string,
  count: number,
  price: number,
  group: string
}

export interface ResponseMessage {
  code: number,
  text: any
}

export interface DialogData {
  header: string,
  text: string
}