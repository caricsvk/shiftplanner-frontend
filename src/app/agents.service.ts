import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable, Subscriber} from "rxjs/Rx";
import {Agent} from "./agents/agent";
import {ShiftsService} from "./shifts.service";

@Injectable()
export class AgentsService {

	private apiPath: string = "/api/agents";

	private dataChangeSubscriber: Subscriber<DataChangeType> = Subscriber.create();
	public dataChangeEvents: Observable<DataChangeType> = Observable.create(subscriber => this.dataChangeSubscriber = subscriber)
		.share();

	constructor(private http:Http,
	            private shiftsService: ShiftsService) {
	}

	activate(agent: Agent): Promise<Response> {
		let result = this.http.put(`${this.apiPath}/activate`, agent).toPromise();
		result.then(() => this.shiftsService.dataChangeSubscriber.next(DataChangeType.EDIT));
		return result;
	}

	save(entity: Agent): Promise<Agent> {
		let promise = this.http[entity.id ? 'put' : 'post'](this.apiPath, entity).map(AgentsService.mapResponseToEntity).toPromise();
		promise.then(() => this.dataChangeSubscriber.next(entity.id ? DataChangeType.EDIT : DataChangeType.CREATE));
		return promise;
	}

	remove(agent: Agent): Promise<Response> {
		let promise = this.http.delete(`${this.apiPath}/${agent.id}`).toPromise();
		promise.then(() => this.dataChangeSubscriber.next(DataChangeType.DELETE), () => {});
		return promise;
	}

	read = (id: number): Promise<Agent> => this.http.get(this.apiPath + id).map(AgentsService.mapResponseToEntity).toPromise();

	search(querySearchParams:URLSearchParams = new URLSearchParams()):Promise<Agent[]> {
		return this.http.get(this.apiPath, {search: querySearchParams}).map(AgentsService.mapResponseToEntities).toPromise();
	}

	count(querySearchParams:URLSearchParams):Promise<number> {
		return this.http.get(this.apiPath + '/count', {search: querySearchParams})
			.map((response:Response) => response.json().value).toPromise();
	}

	static mapResponseToEntities(response: Response): Agent[] {
		let requestsJson = response.json() || [], results: Agent[] = [];
		requestsJson.forEach((jsonObject: {}) => results.push((<any>Object).assign(new Agent(), jsonObject)));
		return results;
	}

	static mapResponseToEntity(response: Response): Agent {
		return (<any>Object).assign(new Agent(), response.json());
	}
}

export enum DataChangeType {
	CREATE, EDIT, DELETE
}