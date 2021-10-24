import { Injectable } from '@angular/core';
import { USER_TYPES } from '../enums/all.enums';
// import { ContentChange } from 'ngx-quill';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  // checkEditorEmpty(changeEvent: ContentChange) {
  //   const value = (
  //     changeEvent && changeEvent.text ||
  //     ''
  //   );
  //   const editorIsEmpty = !value || (/^[↵\n\s]+$/gi).test(value);
  //   return editorIsEmpty;
  // }

  isJwtFormat(value: any) {
    return !!value && (/[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/).test(value);
  }

  // quillGetHTML(inputDelta: Delta | string): string {
  //   const useValue: Delta = typeof(inputDelta) === 'string'
  //     ? JSON.parse(inputDelta)
  //     : inputDelta;
  //   var tempQuill = new Quill(document.createElement("div"));
  //   tempQuill.setContents(useValue);
  //   return tempQuill.root.innerHTML;
  // }
}
