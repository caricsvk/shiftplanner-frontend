import {Component, OnInit} from '@angular/core';
import {TableAdapterBasic} from "../../../ang-milo/src/app/table/table-adapter-basic";
import {TableState} from "../../../ang-milo/src/app/table/table-state";
import {TableColumn} from "../../../ang-milo/src/app/table/table-column";
import {ShiftsService} from "../shifts.service";
import {DurationPipe} from "../../../ang-milo/src/app/pipes/duration.pipe";
import {Shift} from "./shift";
import {TableAdapter} from "../../../ang-milo/src/app/table/table-adapter";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
	selector: 'app-shifts',
	templateUrl: './shifts.component.html',
	styleUrls: ['./shifts.component.css']
})
export class ShiftsComponent implements OnInit {

	shiftsTableAdapter: TableAdapter;
	totalDuration = null;

	constructor(private shiftsService: ShiftsService,
	            private durationPipe: DurationPipe,
	            private activatedRoute: ActivatedRoute,
	            private router: Router) {
		activatedRoute.queryParams.subscribe(params => {
			if (this.shiftsTableAdapter) {
				this.shiftsTableAdapter.setState(TableState.create(params));
			}
		});
		this.totalDuration = this.shiftsService.lastSearchDurationSum();
	}

	ngOnInit() {
		let initialTableState = TableState.create(this.activatedRoute.snapshot.queryParams);
		if (! initialTableState.order) {
			initialTableState.order = 'start';
		}
		// put initial state to the url and initialize table
		this.navigateByState(initialTableState, true);
		this.shiftsTableAdapter = new ShiftsTableAdapter(initialTableState, this.shiftsService, this.durationPipe);
		this.shiftsTableAdapter.onStateChange().subscribe(state => this.navigateByState(state));
	}

	private navigateByState(tableState: TableState, replaceUrl = false) {
		this.router.navigate(['.'], {
			queryParams: tableState,
			preserveFragment: true,
			relativeTo: this.activatedRoute,
			replaceUrl: replaceUrl
		});
	}

}

class ShiftsTableAdapter extends TableAdapterBasic {
	
	constructor(initialTableState: TableState,
	            private shiftsService: ShiftsService,
	            private durationPipe: DurationPipe) {
		super(initialTableState);
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
			new TableColumn("Agent", "agent.name", "entity", function (row) {return row.agent.name}),
			new TableColumn("From", "start", "datetime"),
			new TableColumn("To", "end", "datetime", (shift: Shift) => shift.getEnd() ?
				shift.getEnd() : shift.isStatePlanned() ? '' : 'now'),
			new TableColumn("Duration", "duration", "number", (shift: Shift) => shift.isStatePlanned()
				? '' : !shift.getEnd() ? 'In progress' :this.durationPipe.transform(shift.getDuration())
			)
		];
	}

}