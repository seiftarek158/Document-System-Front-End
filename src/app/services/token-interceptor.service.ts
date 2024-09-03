import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  private loginUrl = 'http://localhost:8080/login';
  private registerUrl = 'http://localhost:8080/Home/users';
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
  
    const token = localStorage.getItem('Authorization');
    console.log("inside token interceptor");

  // Exclude the login 
  if (req.url === this.loginUrl || req.url === this.registerUrl) {
    return next.handle(req);
  }

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}