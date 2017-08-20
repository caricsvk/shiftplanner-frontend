import {Component, OnInit} from '@angular/core';
import {TableAdapterBasic} from "../../../ang-milo/src/app/table/table-adapter-basic";
import {TableState} from "../../../ang-milo/src/app/table/table-state";
import {TableColumn} from "../../../ang-milo/src/app/table/table-column";
import {ShiftsService} from "../shifts.service";
import {DurationPipe} from "../../../ang-milo/src/app/pipes/duration.pipe";
import {Shift, ShiftStateType} from "./shift";

@Component({
	selector: 'app-shifts',
	templateUrl: './shifts.component.html',
	styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

	shiftsTableAdapter: ShiftsTableAdapter;
	totalDuration = null;

	constructor(private shiftsService: ShiftsService,
	            private durationPipe: DurationPipe) {
	}

	ngOnInit() {
		this.shiftsTableAdapter = new ShiftsTableAdapter(this.shiftsService, this.durationPipe);
	}

}

class ShiftsTableAdapter extends TableAdapterBasic {
	
	constructor(private shiftsService: ShiftsService,
	            private durationPipe: DurationPipe) {
		super();
	}

	fetchData(tableState:TableState):Promise<any> {
		return this.shiftsService.search(tableState.getUrlSearchParams());
	}

	fetchCount(tableState:TableState):Promise<number> {
		return this.shiftsService.count(tableState.getUrlSearchParams());
	}

	getAllColumns():TableColumn[] {
		return [
		// columns.push(new TableColumn("ID", "id", "number"));
			new TableColumn("From", "start", "datetime"),
			new TableColumn("To", "end", "datetime", (shift: Shift) => shift.getEnd() ?
				shift.getEnd() : shift.isStatePlanned() ? '' : 'now'),
			new TableColumn("Duration", "duration", "number", (shift: Shift) => shift.isStatePlanned()
				? '' : !shift.getEnd() ? 'In progress' :this.durationPipe.transform(shift.getDuration())
			),
			new TableColumn("Agent", "agent.name", "entity", function (row) {return row.agent.name})
		];
	}

}