import {
  Component,
  inject,
  ViewContainerRef,
  ViewChild,
  viewChild,
  AfterViewInit,
  Type,
  OnDestroy
} from '@angular/core';

import { CallToAction } from '../common/call-to-action/call-to-action';

@Component({
  selector: 'app-home',
  imports: [
    CallToAction
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit, OnDestroy {
  // We instead create a separate view container ref (Angular 16-)
  @ViewChild('adHost', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  private adTypes = ['banner', 'video', 'text'];
  private currentIndex = 0;
  private intervalId: any;

  private adConfigs = [
      {
        type: 'banner',
        imageSrc: 'https://via.placeholder.com/468x60?text=Ad+1',
        company: 'AdCorp'
      },
      {
        type: 'video',
        videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
        captionText: 'Check out our new features!'
      },
      {
        type: 'banner',
        imageSrc: 'https://via.placeholder.com/468x60?text=Ad+2',
        company: 'CoolSoft'
      }
  ];

  ngAfterViewInit() {
    this.loadNextAd(); // Load first ad
    this.intervalId = setInterval(() => this.loadNextAd(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private async loadNextAd() {
    const type = this.adTypes[this.currentIndex];
    const component = await this.resolveComponent(type);

    // For Angular 16-
    this.viewContainerRef.clear();
    const componentRef = this.viewContainerRef.createComponent(component);

    // For Angular 17+
    // this.viewContainerRef()?.clear();
    // const componentRef = this.viewContainerRef()?.createComponent(component);

    // get ad config
    const ad = this.adConfigs[this.currentIndex];

    // Set @Input()s
    if (type === 'banner') {
      componentRef?.setInput('imageSrc', ad.imageSrc);
      componentRef?.setInput('company', ad.company);
    } else if (ad.type === 'video') {
      componentRef?.setInput('videoSrc', ad.videoSrc);
      componentRef?.setInput('captionText', ad.captionText);
    }

    this.currentIndex = (this.currentIndex + 1) % this.adTypes.length;
  }

  private async resolveComponent(type: string): Promise<Type<any>> {
    switch (type) {
      case 'banner':
        const banner = await import('../common/ads/ad-banner/ad-banner');
        return banner.AdBanner;

      case 'video':
        const video = await import('../common/ads/ad-video/ad-video');
        return video.AdVideo;

      case 'text':
        const text = await import('../common/ads/ad-text/ad-text');
        return text.AdText;

      default:
        throw new Error(`Unknown ad type: ${type}`);
    }
  }
}
