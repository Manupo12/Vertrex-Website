// 1. Definimos la forma de una 'variante' de video
export interface DemoVariant {
  label: string; // Ej: 'Lunes', 'Principal', 'Función X'
  videoMobile: string;
  videoDesktop: string;
}

export interface Demo {
  businessName: string;
  businessType: string;
  date: string;
  // 2. Reemplazamos los campos de video por un array de variantes
  variants: DemoVariant[];
}

export const demos: Demo[] = [
  {
    businessName: 'Organica 420',
    businessType: 'Gastro Bar Weed-Friendly',
    date: '2025-09-01', // La más nueva
    variants: [
      { label: 'Principal', videoMobile: '/videos/principalorganicamv.mp4', videoDesktop: '/videos/principalorganicapc.mp4' },
      { label: 'Lunes', videoMobile: '/videos/lunesorganicamv.mp4', videoDesktop: '/videos/lunesorganicapc.mp4' },
      { label: 'Martes', videoMobile: '/videos/martesorganicamv.mp4', videoDesktop: '/videos/martesorganicapc.mp4' },
      { label: 'Miércoles', videoMobile: '/videos/principalorganicamv.mp4', videoDesktop: '/videos/principalorganicapc.mp4' },
      { label: 'Jueves', videoMobile: '/videos/juevesorganicamv.mp4', videoDesktop: '/videos/juevesorganicapc.mp4' },
      { label: 'Viernes', videoMobile: '/videos/viernesorganicamv.mp4', videoDesktop: '/videos/viernesorganicapc.mp4' },
      { label: 'Sábado', videoMobile: '/videos/sabadoorganicamv.mp4', videoDesktop: '/videos/sabadoorganicapc.mp4' },
    ]
  },
  {
    businessName: 'Urban Gym',
    businessType: 'Gimnasio y Fitness',
    date: '2025-08-29',
    variants: [
        { label: 'Principal', videoMobile: '/videos/urbangymmv.mp4', videoDesktop: '/videos/urbangympc.mp4' }
    ]
  },
  {
    businessName: 'Principerfum',
    businessType: 'Tienda de Perfumes',
    date: '2025-07-29', 
    variants: [
        { label: 'Principal', videoMobile: '/videos/principerfummv.mp4', videoDesktop: '/videos/principerfumpc.mp4' }
    ]
  },
  {
    businessName: 'Ser Deseable',
    businessType: 'Influencer de Fitness',
    date: '2025-06-23',
    variants: [
        { label: 'Principal', videoMobile: '/videos/serdeseablemv.mp4', videoDesktop: '/videos/serdeseablepc.mp4' }
    ]
  },
];