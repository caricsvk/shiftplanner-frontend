import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShiftsComponent} from "./shifts/shifts.component";
import {AgentsComponent} from "./agents/agents.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes:Routes = [
	{path: '', component: DashboardComponent},
	{path: 'shifts', component: ShiftsComponent},
	{path: 'agents', component: AgentsComponent}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
