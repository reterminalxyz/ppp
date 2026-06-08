import { Product } from './types';

const getDriveImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w800`;

export const products: Product[] = [
  {
    id: 'c1',
    name: 'Opuntia (Prickly Pear)',
    price: 0.00,
    images: [
      getDriveImageUrl('1al7VSQVxClTsqMFwttKDtqznZHE_1MdZ'),
      getDriveImageUrl('1GxTVXLPjwvt-KbY5A-TL1SfVcNROGr97')
    ],
    description: 'Bright green pads. A classic desert survivor with a fractal growth pattern. / Pale verdi brillanti. Un classico sopravvissuto del deserto.',
    effect: 'Tactile synesthesia, grounding energy.'
  },
  {
    id: 'c2',
    name: 'Austrocylindropuntia (Eve\'s Pin)',
    price: 0.00,
    images: [
      getDriveImageUrl('1Cf1oUqVHEJNj2XoE_hDg0XQCZSb1bHlh'),
      getDriveImageUrl('1Qvz4QpXOctwZy2kzU6ZKbCFZVd01pqB4')
    ],
    description: 'Long cylindrical stems with fleshy needle-leaves. Alien appearance. / Lunghi steli cilindrici. Aspetto alieno.',
    effect: 'Spatial distortion, enhanced focus.'
  },
  {
    id: 'c3',
    name: 'Cereus Forbesii Spiralis',
    price: 0.00,
    images: [
      getDriveImageUrl('1dtyokKwRp4-wSo2w9TQ0MMZxaLcARb_I'),
      getDriveImageUrl('13X9ZcgKwQO4oCXoDDLYuyujP2fBWjREb')
    ],
    description: 'Mesmerizing spiral cactus. Its twisted ribs create a natural optical illusion. / Cactus a spirale ipnotico.',
    effect: 'Spatial distortion, deep focus.'
  },
  {
    id: 'c4',
    name: 'Echinopsis Pachanoi (San Pedro)',
    price: 0.00,
    images: [
      getDriveImageUrl('1m_Pn7I0amAWwNshRPWZEn5qZ_RxHdAQc'),
      getDriveImageUrl('1bhAb8qqFQG4CcFeYwNfNht48g5zyoQTq')
    ],
    description: 'Ancient columnar wisdom. Thrives in direct sunlight and deep contemplation. / Antica saggezza colonnare.',
    effect: 'Expanded perception, warm aura.'
  },
  {
    id: 'c5',
    name: 'Lophophora Williamsii (Peyote)',
    price: 0.00,
    images: [
      getDriveImageUrl('1ngMJoidjMY51I1WC-YVepjFTnR0snCha'),
      getDriveImageUrl('14HO79ZjIXyj80Fbv1CZBCsxBGWyysuT_')
    ],
    description: 'Small, spineless, and incredibly powerful. A true gem of the digital desert. / Piccolo, senza spine, potente.',
    effect: 'Geometric visions, time dilation.'
  },
  {
    id: 'c6',
    name: 'Astrophytum Asterias (Star Cactus)',
    price: 0.00,
    images: [
      getDriveImageUrl('1KhoVlbVhybj0B0UhYbaAPAdOu2fMz31I'),
      getDriveImageUrl('1q2c1NIsldY2MLHlovws7Wk8TUobTuUD_')
    ],
    description: 'Star-shaped geometry covered in white flecks. Cosmic origins. / Geometria a forma di stella. Origini cosmiche.',
    effect: 'Stellar alignment, lucid dreaming.'
  },
  {
    id: 'c7',
    name: 'Echinocactus Grusonii (Golden Barrel)',
    price: 0.00,
    images: [
      getDriveImageUrl('1iU7G3lxr4JDY9H00XHaI0Z7atNOS14kU'),
      getDriveImageUrl('1-QNcBt43qZeYpvkCmcOfbhK9Bdrl00Rm')
    ],
    description: 'A perfect sphere of golden spines. Radiates pure solar energy. / Sfera perfetta di spine dorate.',
    effect: 'Joyful grounding, warm glow.'
  },
  {
    id: 'c8',
    name: 'Gymnocalycium Mihanovichii',
    price: 0.00,
    images: [
      getDriveImageUrl('1m0ppadUxUagQPBqtXUesLjQriQAP6s7z'),
      getDriveImageUrl('1AoTEpXnobBpfZIARgzVKTOYXR5Tpu8a2')
    ],
    description: 'Mutant species lacking chlorophyll. Feeds on neon light and digital noise. / Specie mutante senza clorofilla.',
    effect: 'Lunar cycle synchronization.'
  },
  {
    id: 'c9',
    name: 'Mammillaria Elongata',
    price: 0.00,
    images: [
      getDriveImageUrl('13jy9vN94iY_7Qg667ot7ps1uHxUb8nRl'),
      getDriveImageUrl('1382o-8bjeFpMpQm7klK82N2-pAu18C-8')
    ],
    description: 'Dense clusters of golden fingers. Vibrates at 432Hz. / Densi grappoli di dita dorate.',
    effect: 'Audio-visual synesthesia.'
  },
  {
    id: 'c10',
    name: 'Schlumbergera (Neon Christmas)',
    price: 0.00,
    images: [
      getDriveImageUrl('15bvifEF0YXmv-sQ-yzOBctFqwQ0JPsUB'),
      getDriveImageUrl('17M2gPepIBOxzppWlzuqNR5X7ocQNZZfU')
    ],
    description: 'Forest cactus blooming with bright neon flashes in the dark. / Cactus della foresta con fioriture al neon.',
    effect: 'Euphoria, color trails.'
  },
  {
    id: 'c11',
    name: 'Euphorbia Lactea (Medusa\'s Head)',
    price: 0.00,
    images: [
      getDriveImageUrl('1rJrFOvkQBA1h1VzJ8l_-gUFw4ziUvuF_'),
      getDriveImageUrl('1NdFlQXBUEWwmG2c_YAzeZgmqLVCimLvm')
    ],
    description: 'Crested mutation resembling a coral reef or an alien brain. / Mutazione crestata simile a un cervello alieno.',
    effect: 'Telepathic modem connection.'
  }
];
