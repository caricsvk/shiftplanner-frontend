import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {Observable, Subscriber} from "rxjs/Rx";
import {Shift} from "./shifts/shift";
import {ReplayStore} from "../../ang-milo/src/app/replay.store";

@Injectable()
export class ShiftsService {

	private apiPath: string = "/api/shifts";

	private upcomingShiftStore: ReplayStore<Shift> = new ReplayStore();
	private currentShiftStore: ReplayStore<Shift> = new ReplayStore();
	private currentShift = new Shift();

	private durationSumStore: ReplayStore<{value: number}> = new ReplayStore();

	public dataChangeSubscriber: Subscriber<DataChangeType> = Subscriber.create();
	public dataChangeEvents: Observable<DataChangeType> = Observable.create(subscriber => this.dataChangeSubscriber = subscriber)
		.share();

	constructor(private http:Http) {
		this.fetchCurrentShift();
		this.fetchUpcomingShift();
		this.dataChangeEvents.subscribe(() => {
			this.fetchCurrentShift();
			this.fetchUpcomingShift();
		});
		setInterval(() => {
			this.fetchCurrentShift();
			this.fetchUpcomingShift();
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
		this.fetchDurationSum(querySearchParams);
		return this.http.get(this.apiPath, {search: querySearchParams}).map(this.mapResponseToShifts).toPromise();
	}

	public lastSearchDurationSum() {
		return this.durationSumStore.observable.map((response: {value: number}) => response.value);
	}

	public count(querySearchParams:URLSearchParams):Promise<number> {
		return this.http.get(this.apiPath + '/count', {search: querySearchParams})
			.map((response:Response) => response.json().value).toPromise();
	}

	public getCurrentShift() {
		return this.currentShiftStore.observable;
	}

	public getUpcomingShift() {
		return this.upcomingShiftStore.observable;
	}

	private fetchDurationSum(querySearchParams:URLSearchParams): void {
		this.http.get(`${this.apiPath}/sum-duration`, {search: querySearchParams})
			.subscribe((response:Response) => this.durationSumStore.subscriber.next(response.json()));
	}

	private fetchCurrentShift(): void {
		this.http.get(this.apiPath, {search: "limit=1&order=start&orderType=DESC&state_exact=DEPLOYED"}).map((response: Response) =>
			(<any>Object).assign(new Shift(), response.json()[0])
		).subscribe((newShift: Shift) => {
			this.currentShiftStore.subscriber.next(newShift);
			let wasCurrentShiftChanged = newShift.id != this.currentShift.id;
			this.currentShift = newShift;
			if (wasCurrentShiftChanged) {
				this.dataChangeSubscriber.next(DataChangeType.EDIT);
			}
		});
	}

	private fetchUpcomingShift(): void {
		this.http.get(this.apiPath, {search: "limit=1&order=start&orderType=ASC&state_exact=PLANNED"}).map((response: Response) =>
			(<any>Object).assign(new Shift(), response.json()[0])
		).subscribe((shift: Shift) => this.upcomingShiftStore.subscriber.next(shift));
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
