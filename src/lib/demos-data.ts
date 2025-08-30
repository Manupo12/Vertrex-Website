export interface Demo {
  businessName: string;
  businessType: string;
  videoMobile: string;
  videoDesktop: string;
  date: string; // Propiedad para ordenar por fecha
}

export const demos: Demo[] = [
    {
    businessName: 'Urban Gym',
    businessType: 'Gimnasio y Fitness',
    videoMobile: '/videos/urbangymmv.mp4',
    videoDesktop: '/videos/urbangympc.mp4',
    date: '2025-08-29',
  },
  {
    businessName: 'Principerfum',
    businessType: 'Tienda de Perfumes',
    videoMobile: '/videos/principerfummv.mp4',
    videoDesktop: '/videos/principerfumpc.mp4',
    date: '2025-07-29', // Fecha más reciente
  },
  {
    businessName: 'Ser Deseable',
    businessType: 'Influencer de Fitness',
    videoMobile: '/videos/serdeseablemv.mp4',
    videoDesktop: '/videos/serdeseablepc.mp4',
    date: '2025-06-23', // Fecha más antigua
  },
  // Cuando añadas una nueva demo, solo asegúrate de ponerle la fecha actual o más reciente.
];