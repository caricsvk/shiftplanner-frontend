import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable, Subscriber} from "rxjs/Rx";
import {Shift} from "./shifts/shift";
import {ReplayStore} from "../../ang-milo/src/app/replay.store";

@Injectable()
export class ShiftsService {

	private apiPath: string = "/api/shifts";

	private currentShiftStore: ReplayStore<Shift> = new ReplayStore();
	private currentShift = new Shift();

	public dataChangeSubscriber: Subscriber<DataChangeType> = Subscriber.create();
	public dataChangeEvents: Observable<DataChangeType> = Observable.create(subscriber => this.dataChangeSubscriber = subscriber)
		.share();

	constructor(private http:Http) {
		this.fetchCurrentShift();
		this.dataChangeEvents.subscribe(() => this.fetchCurrentShift());
		setInterval(() => {
			this.fetchCurrentShift();
		}, 60*1000)
	}

	public save(entity: Shift): Promise<Shift> {
		let promiseResult = this.http[entity.id ? 'put' : 'post'](this.apiPath, entity)
			.map((r: Response) => Object.assign(new Shift(), r.json())).toPromise();
		promiseResult.then(() => this.dataChangeSubscriber.next(DataChangeType.CREATE));
		return promiseResult;
	}

	public remove(shift: Shift): Promise<Response> {
		let promiseResult = this.http.delete(`${this.apiPath}/${shift.id}`).toPromise();
		promiseResult.then(() => this.dataChangeSubscriber.next(DataChangeType.DELETE));
		return promiseResult;
	}

	public read(id: number): Observable<Shift> {
		return this.http.get(this.apiPath + id).map(this.mapResponseToShift);
	}

	public search(querySearchParams:URLSearchParams):Promise<Shift[]> {
		return this.http.get(this.apiPath, {search: querySearchParams}).map(this.mapResponseToShifts).toPromise();
	}

	public count(querySearchParams:URLSearchParams):Promise<number> {
		return this.http.get(this.apiPath + '/count', {search: querySearchParams})
			.map((response:Response) => response.json().value).toPromise();
	}

	public getCurrentShift(): Observable<Shift> {
		return this.currentShiftStore.observable;
	}

	private fetchCurrentShift(): void {
		this.http.get(this.apiPath, {search: "limit=1&order=start&orderType=DESC&state_exact=DEPLOYED"}).map((response: Response) =>
			(<any>Object).assign(new Shift(), response.json()[0])
		).subscribe((newShift: Shift) => {
			if (newShift.id != this.currentShift.id) {
				this.currentShiftStore.subscriber.next(newShift);
				let wasCurrentShiftSet = !!this.currentShift.id;
				this.currentShift = newShift;
				if (wasCurrentShiftSet) {
					this.dataChangeSubscriber.next(DataChangeType.EDIT);
				}
			}
		});
	}

	private mapResponseToShifts(response: Response): Shift[] {
		let requestsJson = response.json() || [], results: Shift[] = [];
		requestsJson.forEach((jsonObject: {}) => results.push((<any>Object).assign(new Shift(), jsonObject)));
		return results;
	}

	private mapResponseToShift(response: Response): Shift {
		return (<any>Object).assign(new Shift(), response.json());
	}

}

export enum DataChangeType {
	CREATE, EDIT, DELETE
}