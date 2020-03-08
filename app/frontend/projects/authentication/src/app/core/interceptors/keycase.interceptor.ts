import { Injectable } from "@angular/core"
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse,
} from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { map, catchError } from "rxjs/operators"
import * as camelcaseKeys from "camelcase-keys"
import * as snakecaseKeys from "snakecase-keys"

@Injectable()
export class KeyCaseInterceptor implements HttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (["POST", "PATCH", "PUT", "DELETE"].includes(request.method.toUpperCase()) === true) {
			request = request.clone({
				body: snakecaseKeys(request.body),
			})
		}

		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					event = event.clone({
						body: camelcaseKeys(event.body, { deep: true }),
					})
				}

				return event
			}),
			catchError((error: HttpErrorResponse) => {
				error = new HttpErrorResponse({
					...error,
					error: camelcaseKeys(error.error, { deep: true }),
				})

				return throwError(error)
			}),
		)
	}
}
