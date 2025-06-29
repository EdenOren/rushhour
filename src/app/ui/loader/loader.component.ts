import { Component, OnInit, signal, WritableSignal } from "@angular/core";

const UPDATE_INTERVAL: number = 50;
const MILLI_SECONDS: number = 1000;
const MILLI_PLACES: number = 3;


@Component({
    standalone: true,
    selector: 'loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    private startTime = 0;
    private intervalId: ReturnType<typeof setInterval> | undefined;

    public displayTime: WritableSignal<string> = signal<string>('0.000s');

    ngOnInit(): void {
        this.startTime = performance.now();
        this.intervalId = setInterval(() => {
            const elapsed = performance.now() - this.startTime;
            this.displayTime.set((elapsed / MILLI_SECONDS).toFixed(MILLI_PLACES) + 's');
        }, UPDATE_INTERVAL);
    }
}