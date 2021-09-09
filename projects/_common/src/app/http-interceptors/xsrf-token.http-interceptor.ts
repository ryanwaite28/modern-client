import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as Cookies from 'js-cookie';

@Injectable()
export class XsrfTokenInterceptor implements HttpInterceptor {
  loggedOnceBefore = false;

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const xsrfTokenCookie = Cookies.get(`xsrf-token`) || Cookies.get(`XSRF-TOKEN`);
    if (xsrfTokenCookie) {
      if (!this.loggedOnceBefore) {
        this.loggedOnceBefore = true;
        console.log({ xsrfTokenCookieFoundAndRead: !!xsrfTokenCookie });
      }
      request = request.clone({
        headers: request.headers.set(`x-xsrf-token`, xsrfTokenCookie)
      });
    }

    return next.handle(request);
  }
}