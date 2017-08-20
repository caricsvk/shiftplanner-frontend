import {Component} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	public componentInitialized: boolean = true;

	constructor() {
	}

	reload(): void {
		this.componentInitialized = false;
		setTimeout(() => this.componentInitialized = true);
	}
}
