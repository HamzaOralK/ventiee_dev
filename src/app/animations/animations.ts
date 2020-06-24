import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, height: '100%', width: '100%', display: 'flex', justifyContent: 'center' })
      ], { optional: true }),
      query(':leave', [
        style({ display: 'none', height: '0px', width: '0px' })
      ], { optional: true }),
      group([
        query(':leave', [
          animate(300, style({
            opacity: 0,
            display: 'none'
          }))
        ], {
          optional: true
        }),
        query(':enter', [
          style({
            opacity: 0
          }),
          animate(300, style({
            opacity: 1
          }))
        ], {
          optional: true
        })
      ])
    ])
  ]);
