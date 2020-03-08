import { Injectable } from "@angular/core"
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http"
import { ActivatedRoute } from "@angular/router"
import { Observable } from "rxjs"

import { environment } from "@authentication/env"

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
	constructor(private route: ActivatedRoute) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token: string = this.route.snapshot.queryParams.dev_bearer_token

		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		})

		return next.handle(request)
	}
}
