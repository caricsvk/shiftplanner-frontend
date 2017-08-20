import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {HttpModule, Http, XHRBackend, RequestOptions} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {MiloModule} from "../../ang-milo/src/app/milo.module";
import {InterceptedHttp} from "../../ang-milo/src/app/http.interceptor";
import {AppRoutingModule} from "./app-routing.module";
import {AgentsComponent} from "./agents/agents.component";
import {ShiftsComponent} from "./shifts/shifts.component";
import {ShiftsService} from "./shifts.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AgentsService} from "./agents.service";
import {CreateAgentComponent} from "./agents/create-agent.component";
import {CurrentShiftComponent} from "./shifts/current-shift.component";
import {ScheduleShiftComponent} from "./shifts/schedule-shift.component";

@NgModule({
	declarations: [
		AppComponent,
		AgentsComponent,
		CreateAgentComponent,
		ShiftsComponent,
		DashboardComponent,
		CurrentShiftComponent,
		ScheduleShiftComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		MiloModule,
		AppRoutingModule,
	],
	providers: [
		ShiftsService,
		AgentsService,
		{
			provide: Http,
			deps: [XHRBackend, RequestOptions],
			useFactory: httpFactory
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

export function httpFactory(xhrBackend:XHRBackend, requestOptions:RequestOptions):Http {
	return new InterceptedHttp(xhrBackend, requestOptions);
}
