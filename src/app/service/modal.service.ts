import { Injectable, inject, ViewContainerRef, Optional, Inject, InjectionToken, OnDestroy } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ModalComponent } from '../components/modal/modal.component';

export interface ModalConfig {
    title: string;
    content: string;
}

const MODAL_VIEW_CONTAINER_REF = new InjectionToken<ViewContainerRef>('MODAL_VIEW_CONTAINER_REF')

@Injectable({
  providedIn: 'root',
})
export class ModalService implements OnDestroy {
    constructor(
        @Optional() @Inject(MODAL_VIEW_CONTAINER_REF) private _globalVcr: ViewContainerRef | null
    ) { }

    private _overlay: Overlay = inject(Overlay);
    private _overlayRef!: OverlayRef;

    ngOnDestroy(): void {
        this.close();
    }

    private close() {
        if (this._overlayRef && this._overlayRef.hasAttached()) {
            this._overlayRef.detach();
            this._overlayRef.dispose();
        }
    }

    public open(config: ModalConfig): OverlayRef {
        this._overlayRef = this._overlay.create({
            positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically(),
            hasBackdrop: true,
            backdropClass: 'modal-backdrop'
        });
        const modalPortal = new ComponentPortal(ModalComponent, this._globalVcr);
        const componentRef = this._overlayRef.attach(modalPortal);
        componentRef.instance.config = config;

        componentRef.instance.close.subscribe(() => this.close());
        this._overlayRef.backdropClick().subscribe(() => this.close());

        return this._overlayRef;
    }
}