import {Component, OnInit, Input, AfterViewInit, ElementRef} from "@angular/core";
import {AgentsService} from "../agents.service";
import {Agent} from "./agent";
import {NotificationComponent} from "../../../ang-milo/src/app/notification/notification.component";

declare var jQuery: any;

@Component({
	selector: 'app-create-agent',
	templateUrl: './create-agent.component.html'
})
export class CreateAgentComponent implements AfterViewInit {

	@Input() agent: Agent;
	isSavingInProgress = false;

	private jForm: any;

	constructor(private agentsService: AgentsService, private element:ElementRef) {
		console.log('CreateAgentComponent', this);
	}

	ngAfterViewInit():void {
		this.jForm = jQuery(this.element.nativeElement).find('form');
		this.jForm.form({
			on: 'blur', inline: true, keyboardShortcuts: false,
			fields: {
				name: 'empty',
				email: 'email'
			}
		});
	}

	resetAgent() {
		this.agent = new Agent();
	}

	save(): void {
		if (!this.jForm.form('is valid')) {
			return;
		}
		this.isSavingInProgress = true;
		this.agentsService.save(this.agent).then(
			() => {
				this.isSavingInProgress = false;
				this.agent = new Agent();
			}, (response: Response) => {
				this.isSavingInProgress = false;
				console.log('error', response);
				NotificationComponent.error('error')
			}
		);
	}

}