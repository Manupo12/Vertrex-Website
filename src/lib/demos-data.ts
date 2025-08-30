export interface Demo {
  businessName: string;
  businessType: string;
  videoMobile: string;  
  videoDesktop: string; 
}

export const demos: Demo[] = [
  {
    businessName: 'Principerfum',
    businessType: 'Tienda de Perfumes',
    videoMobile: '/videos/principerfummv.mp4',
    videoDesktop: '/videos/principerfumpc.mp4',
  },
  {
    businessName: 'Urban Gym',
    businessType: 'Gimnasio y Fitness',
    videoMobile: '/videos/urbangymmv.mp4',
    videoDesktop: '/videos/urbangympc.mp4',
  },
  {
    businessName: 'Ser Deseable',
    businessType: 'Influencer de Fitness',
    videoMobile: '/videos/serdeseablemv.mp4',
    videoDesktop: '/videos/serdeseablepc.mp4',
  },
];