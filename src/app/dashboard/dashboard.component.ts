import {Component, OnInit} from "@angular/core";
import {URLSearchParams} from "@angular/http";
import {Agent} from "../agents/agent";
import {AgentsService} from "../agents.service";
import {Shift} from "../shifts/shift";
import {ShiftsService} from "../shifts.service";
import {SubscribingComponent} from "../../../ang-milo/src/app/subscribing-component";
import {NotificationComponent} from "../../../ang-milo/src/app/notification/notification.component";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends SubscribingComponent implements OnInit {

	agents: Agent[] = [];
	upcomingShifts: Shift[] = [];
	currentShift: Shift = new Shift();

	agentsActivationInProgress: Agent = null;
	shiftsDeletionInProgress: Shift = null;

	constructor(private agentsService: AgentsService,
	            private shiftsService: ShiftsService) {
		super();
	}

	ngOnInit() {
		this.fetchShifts();
		this.shiftsService.dataChangeEvents.takeUntil(this.onDestroy).subscribe(() => this.fetchShifts());
		this.agentsService.search(new URLSearchParams("limit=8")).then(agents => this.agents = agents);
	}

	activate(agent: Agent) {
		this.agentsActivationInProgress = agent;
		this.agentsService.activate(agent).then(
			agent => this.agentsActivationInProgress = null,
			(errorResponse: Response) => {
				this.agentsActivationInProgress = null;
				NotificationComponent.error('Activation failed: ' + errorResponse.text());
			}
		);
	}

	deleteShift(shift: Shift) {
		this.shiftsDeletionInProgress = shift;
		this.shiftsService.remove(shift).then(
			() => this.shiftsDeletionInProgress = null,
			(errorResponse: Response) => {
				this.shiftsDeletionInProgress = null;
				NotificationComponent.error('Deletion failed: ' + errorResponse.text());
			}
		);
	}

	private fetchShifts() {
		this.shiftsService.search(new URLSearchParams("limit=100&end_empty=true&order=start&orderType=ASC"))
			.then((shifts) => this.upcomingShifts = shifts);
		this.shiftsService.getCurrentShift().takeUntil(this.onDestroy).subscribe(shift => this.currentShift = shift);
	}

}
