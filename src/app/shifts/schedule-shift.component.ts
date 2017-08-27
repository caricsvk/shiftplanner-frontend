import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {ShiftsService} from "../shifts.service";
import {Shift} from "./shift";
import {AgentsService} from "../agents.service";
import {Agent} from "../agents/agent";

declare var jQuery: any;

@Component({
	selector: 'app-schedule-shift',
	templateUrl: './schedule-shift.component.html'
})
export class ScheduleShiftComponent implements OnInit, AfterViewInit {

	allAgents: Agent[] = [];
	newShift = new Shift();
	newShiftMinDate = new Date();
	isShiftBeingSaved = false;

	private jForm: any;

	constructor(private shiftsService: ShiftsService,
	            private agentsService: AgentsService,
	            private element: ElementRef) {
	}

	ngOnInit() {
		// this.agentsService.dataChangeEvents.subscribe(() => this.fetchCurrentShift());
		this.agentsService.search().then(agents => this.allAgents = agents)
	}

	ngAfterViewInit():void {
		this.jForm = jQuery(this.element.nativeElement).find('form');
		this.jForm.form({
			on: 'blur', inline: true, keyboardShortcuts: false,
			fields: {
				agent: 'empty',
				datetime: 'empty'
			}
		});
	}

	save() {
		if (!this.jForm.form('is valid')) {
			return;
		}
		this.isShiftBeingSaved = true;
		this.shiftsService.save(this.newShift).then(
			() => {
				this.newShift = new Shift();
				this.isShiftBeingSaved = false;
			}, () => {}
		);
	}

	setNewShiftStart(date: {date: Date}) {
		if (date && date.date) {
			let utcDate = date.date;
			let newStart = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000)
			this.newShift.start = newStart.toISOString().substr(0, 22);
		}
	}

}