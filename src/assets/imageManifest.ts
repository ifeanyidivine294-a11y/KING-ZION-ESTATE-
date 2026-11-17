import heroDuplex from './images/ng_hero_duplex_1794585692827.jpg';
import housesDuplex from './images/ng_houses_duplex_1794585693906.jpg';
import landCategory from './images/ng_land_category_1794585694414.jpg';
import rentalInterior from './images/ng_rental_interior_1794585696910.jpg';
import semiDetached from './images/ng_semi_detached_1794585696661.jpg';
import bungalow from './images/ng_bungalow_1794585697267.jpg';
import gatedEstate from './images/ng_gated_estate_1794585697269.jpg';
import surveyPegsLand from './images/ng_survey_pegs_land_1794585698128.jpg';
import apartmentExterior from './images/ng_apartment_exterior_1794585698889.jpg';
import apartmentBedroom from './images/ng_apartment_bedroom_1794585699657.jpg';
import estateEntrance from './images/ng_estate_entrance_1794585699985.jpg';
import estateDevLand from './images/ng_estate_dev_land_1794585700467.jpg';

export const NIGERIAN_ASSETS = {
  heroDuplex,
  housesDuplex,
  landCategory,
  rentalInterior,
  semiDetached,
  bungalow,
  gatedEstate,
  surveyPegsLand,
  apartmentExterior,
  apartmentBedroom,
  estateEntrance,
  estateDevLand,
};

export interface GalleryVisualItem {
  id: string;
  category: 'houses' | 'land' | 'rentals';
  image: string;
  caption: string;
  alt: string;
}

export const ILLUSTRATIVE_GALLERY_VISUALS: GalleryVisualItem[] = [
  {
    id: 'gal-house-1',
    category: 'houses',
    image: heroDuplex,
    caption: 'Contemporary Detached Residence — Nigerian Urban Architecture',
    alt: 'Modern Nigerian luxury detached duplex architectural visual',
  },
  {
    id: 'gal-house-2',
    category: 'houses',
    image: housesDuplex,
    caption: 'Executive Detached Duplex with Perimeter Security Fence',
    alt: 'Nigerian detached duplex with paved compound and perimeter gate',
  },
  {
    id: 'gal-house-3',
    category: 'houses',
    image: semiDetached,
    caption: 'Twin Semi-Detached Residential Duplex Design',
    alt: 'Modern Nigerian semi-detached twin duplex residential exterior',
  },
  {
    id: 'gal-house-4',
    category: 'houses',
    image: bungalow,
    caption: 'Contemporary Nigerian Bungalow with Stone-Coated Roofing',
    alt: 'Modern Nigerian 4-bedroom bungalow with perimeter wall',
  },
  {
    id: 'gal-land-1',
    category: 'land',
    image: landCategory,
    caption: 'Dry Residential Land Parcel with Visible Demarcation Boundaries',
    alt: 'Nigerian dry residential land plot with boundary markers and laterite road',
  },
  {
    id: 'gal-land-2',
    category: 'land',
    image: surveyPegsLand,
    caption: 'Demarcated Residential Plot with Concrete Survey Beacon Pillars',
    alt: 'Nigerian residential land plot with concrete survey boundary beacons',
  },
  {
    id: 'gal-land-3',
    category: 'land',
    image: estateDevLand,
    caption: 'Developing Estate Layout with Graded Access Corridors',
    alt: 'Nigerian estate development land layout with graded earth road',
  },
  {
    id: 'gal-land-4',
    category: 'land',
    image: gatedEstate,
    caption: 'Gated Residential Estate Perimeter & Internal Compound',
    alt: 'Modern gated Nigerian residential estate view',
  },
  {
    id: 'gal-rent-1',
    category: 'rentals',
    image: rentalInterior,
    caption: 'Serviced Apartment Living Room Interior',
    alt: 'Modern Nigerian serviced apartment living room interior',
  },
  {
    id: 'gal-rent-2',
    category: 'rentals',
    image: apartmentExterior,
    caption: 'Modern Multi-Unit Residential Apartment Block',
    alt: 'Modern 3-story Nigerian residential apartment building exterior',
  },
  {
    id: 'gal-rent-3',
    category: 'rentals',
    image: apartmentBedroom,
    caption: 'Spacious Ensuite Primary Bedroom Interior',
    alt: 'Modern Nigerian serviced apartment bedroom interior',
  },
];
