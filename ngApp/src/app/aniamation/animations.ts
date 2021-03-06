import {
    trigger, animateChild, group,
    transition, animate, style, query
} from '@angular/animations';

const optionA = [
    style({ position: 'relative', height: '*' }),
    query(':enter, :leave', [
        style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
        })
    ]),
    query(':enter', [
        style({ left: '-100%' })
    ]),
    query(':leave', animateChild()),
    group([
        query(':leave', [
            animate('500ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
            animate('500ms ease-out', style({ left: '0%' }))
        ])
    ]),
    query(':enter', animateChild()),
]

// Routable animations
export const slideInAnimation =
    trigger('routeAnimations', [
        transition('ManagerLincense <=> ManagerUser', optionA),
        transition('ManagerLicenseDetail <=> ManagerLincense', optionA),
        transition('ManagerLicenseDetail <=> ManagerUser', optionA),
    ]);