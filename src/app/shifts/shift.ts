import {Agent} from "../agents/agent";

export class Shift {

	private end: string;
	private state: ShiftStateType | string;
	private duration: number;

	constructor(
		public id?: number,
		public agent: Agent = new Agent(),
		public start?: string
	) {}

	getEnd(): string {
		return this.end;
	}

	getState(): ShiftStateType | string {
		return this.state;
	}

	getDuration(): number {
		return this.duration;
	}

	isStatePlanned(): boolean {
		return this.getState() == ShiftStateType.PLANNED || this.getState() == 'PLANNED';
	}
}

export enum ShiftStateType {
	PLANNED, DEPLOYED
}