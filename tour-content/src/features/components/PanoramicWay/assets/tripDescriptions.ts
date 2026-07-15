type destination = {
    tag: string,
    title: string,
    desc: string,
}

export const tripDescriptions : Record<string, destination> = {
   "las-vegas-nevada": {
        tag: 'Las Vegas',
        title: 'Neonovy Sen Vegas',
        desc: 'Gdzie noc nigdy się nie kończy',
    },

    "Arizona": {
        tag: 'Arizona',
        title: 'Duch Doliny Monumentów',
        desc: 'Poczuj majestat czerwonych skał pod palącym słońcem zachodu.',
    },

    "beach-hawaii": {
        tag: 'Hawaje',
        title: 'Szmaragdowy Pacyfik',
        desc: 'Pomiędzy klifami Na Pali a czarnym piaskiem odnajdziesz rytm natury, który dyktuje tętno oceanu.',
    },

    "american-landscape": {
        tag: 'The West',
        title: 'Obietnica Horyzontu',
        desc: 'To tutaj kończą się mapy, a zaczyna prawdziwa wolność. Tylko Ty, radio i droga.',
    },

    "bisons-yellowstone": {
        tag: 'Wyoming',
        title: 'Królestwo Bizona',
        desc: 'W sercu Yellowstone czas stanął w miejscu. Stań oko w oko z potęgą natury.',
    },
    
}