import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root',
})
export class ToastService {
    constructor(private toastrService: ToastrService) {}

    public success(message: string = '', title: string = ''): void {
        this.toastrService.success(message, title);
    }

    public error(message: string = '', title: string = ''): void {
        this.toastrService.error(message, title);
    }

}