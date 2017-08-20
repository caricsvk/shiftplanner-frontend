import {Component, OnInit} from '@angular/core';
import {ShiftsService} from "../shifts.service";
import {Shift} from "./shift";
import {AgentsService} from "../agents.service";

@Component({
	selector: 'app-current-shift',
	templateUrl: './current-shift.component.html'
})
export class CurrentShiftComponent implements OnInit {

	currentShift: Shift = new Shift();

	constructor(private shiftsService: ShiftsService, private agentsService: AgentsService) {
	}

	ngOnInit() {
		this.fetchCurrentShift();
		this.agentsService.dataChangeEvents.subscribe(() => this.fetchCurrentShift());
	}

	private fetchCurrentShift = () => this.shiftsService.getCurrentShift().subscribe(shift => this.currentShift = shift);

}