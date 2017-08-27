import {Component, OnInit} from '@angular/core';
import {Response} from "@angular/http";
import {TableAdapterBasic} from "../../../ang-milo/src/app/table/table-adapter-basic";
import {TableState} from "../../../ang-milo/src/app/table/table-state";
import {AgentsService} from "../agents.service";
import {TableColumn} from "../../../ang-milo/src/app/table/table-column";
import {Agent} from "./agent";
import {TableAction} from "../../../ang-milo/src/app/table/table-action";

@Component({
	selector: 'app-agents',
	templateUrl: './agents.component.html',
	styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

	tableAdapter: AgentsTableAdapter;
	agent = new Agent();

	constructor(private agentsService: AgentsService) {
	}

	ngOnInit() {
		this.initTable();
		this.agentsService.dataChangeEvents.subscribe(() => this.initTable());
	}

	private initTable() {
		let tableActions = [
			new TableAction('Edit', (agent: Agent) => this.agent = agent),
			new TableAction('Delete', (agent: Agent) => {
				if (confirm('Are you sure you want to delete an agent?')) {
					this.agentsService.remove(agent).then(() => {},
						(errorResponse: Response) => alert(errorResponse.text())
					);
				}
			}),
			new TableAction('Activate', (agent: Agent) => {
				this.agentsService.activate(agent).then(() => alert('Agent was activated!'),
					(errorResponse: Response) => alert(errorResponse.text())
				);
			})
		];
		this.tableAdapter = new AgentsTableAdapter(this.agentsService, tableActions);
	}

}

class AgentsTableAdapter extends TableAdapterBasic {

	constructor(private service: AgentsService, private actions: TableAction[]) {
		super();
	}

	fetchData(tableState:TableState):Promise<any> {
		return this.service.search(tableState.getUrlSearchParams());
	}

	fetchCount(tableState:TableState):Promise<number> {
		return this.service.count(tableState.getUrlSearchParams());
	}

	getAllColumns():TableColumn[] {
		return [
			new TableColumn("ID", "id", "number"),
			new TableColumn("Name", "name"),
			new TableColumn("E-mail", "email"),
			new TableColumn("Phone", "phone")
		];
	}

	getActions():TableAction[] {
		return this.actions;
	}
}
