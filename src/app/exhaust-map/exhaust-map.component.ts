import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, concatMap, exhaustMap, filter, fromEvent, interval, mergeMap, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-exhaust-map',
  templateUrl: './exhaust-map.component.html',
  styleUrl: './exhaust-map.component.css'
})
export class ExhaustMapComponent  implements OnInit,AfterViewInit{
  @ViewChild('button',{static:true}) button : ElementRef | undefined;
  clicks$:Observable<Event> | undefined ;
  count=0;

  srcObservable= of(1,2,3,4);
  innerObservable= of('A','B','C','D');
  ngOnInit(): void {
      this.srcObservable.pipe(
        exhaustMap( val => {
          console.log('Source value '+val)
          console.log('starting new observable')
          return this.innerObservable
        })
      )
      .subscribe(ret=> {
        console.log('Recd ' + ret);
      })
  }

  ngAfterViewInit(): void {
    this.clicks$ = fromEvent(this.button!.nativeElement, 'click');
    //this.exhaustMapExample3();
    this.switchExample();
    //this.mergeMapExample();
    //this.concatMapExample3();
  }

  delayedObs(count:number) {
    return new Observable((observer) => {
      setTimeout(() => { observer.next(count+" A") }, 1000);
      setTimeout(() => { observer.next(count+" B") }, 2000);
      setTimeout(() => { observer.next(count+" C") }, 3000);
      setTimeout(() => { observer.next(count+" D") }, 4000);
      setTimeout(() => { observer.next(count+" E"); observer.complete() }, 5000);
    })
  }
  exhaustMapExample3() {
    let obs=this.clicks$!
      .pipe(
        exhaustMap(() => {
          this.count=this.count+1;
          return this.delayedObs(this.count)
        })
      )
      .subscribe((val: any) => console.log(val));
  }


  mergeMapExample() {
 
    let obs=
 
    this.clicks$!
      .pipe(
        mergeMap(() => {
          this.count=this.count+1;
          return this.delayedObs(this.count)
        })
      )
      .subscribe(
          val => console.log(val)
        , ()=>{console.log('Complete')}
      );
  }

  concatMapExample3() {
 
    let obs=
 
    this.clicks$!
      .pipe(
        concatMap(() => {
          this.count=this.count+1;
          return this.delayedObs(this.count)
        })
      )
      .subscribe(val => console.log(val));
  }

  switchExample() {
    this.clicks$!
      .pipe(
        switchMap(() => {
          return interval(500)
        })
      )
      .subscribe({
        next:value=>{
          console.log(value)
        }
      });
  }
  
}
