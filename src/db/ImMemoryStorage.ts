import { STORAGE } from "./storage";

export class InMemoryStorage {
   save(data: any) {
      STORAGE.push(data)
   }
   load() {
      return STORAGE[0];
   }
}