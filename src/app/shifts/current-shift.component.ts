import {Component, OnInit} from '@angular/core';
import {ShiftsService} from "../shifts.service";
import {Shift} from "./shift";

@Component({
	selector: 'app-current-shift',
	templateUrl: './current-shift.component.html'
})
export class CurrentShiftComponent implements OnInit {

	currentShift: Shift = new Shift();
	nextShiftStartIn: number;

	constructor(private shiftsService: ShiftsService) {
	}

	ngOnInit() {
		this.shiftsService.getCurrentShift().subscribe(shift => this.currentShift = shift);
		this.shiftsService.getUpcomingShift().subscribe(upcomingShift => {
			if (this.currentShift) {
				let startDateTime = new Date(this.currentShift.start).getTime();
				let endDateTime = new Date(upcomingShift.start).getTime();
				this.nextShiftStartIn = endDateTime/1000 - startDateTime/1000 - this.currentShift.getDuration();
			}
		});
	}



}