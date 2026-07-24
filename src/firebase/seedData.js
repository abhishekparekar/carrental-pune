import { addCar, getCars } from './firestore';

export const SAMPLE_CARS = [
  {
    name: 'Fronx 2026',
    brand: 'Maruti',
    category: 'hatchback',
    modelYear: 'Fronx 2026',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'manual',
    fuelType: 'petrol',
    seats: 5,
    pricePerHour: 145,
    pricePerDay: 3480,
    pricePerMonth: 35000,
    securityDeposit: 2000,
    features: ['Air Conditioner', 'Bluetooth Music', 'Power Windows', 'ABS Brakes', 'Dual Airbags'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.8,
    mileage: '21.7 kmpl',
    luggageCapacity: '2 Bags',
    description: 'Modern crossover SUV with high ground clearance, stylish coupe styling, and agile city drive.',
  },
  {
    name: 'Innova Hycross AT 2024-25',
    brand: 'Toyota',
    category: 'muv',
    modelYear: 'Innova Hycross AT 2024-25',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'automatic',
    fuelType: 'hybrid',
    seats: 7,
    pricePerHour: 400,
    pricePerDay: 9768,
    pricePerMonth: 110000,
    securityDeposit: 5000,
    features: ['Ottoman Rear Seats', 'Panoramic Sunroof', 'ADAS Safety', 'Hybrid Electric Engine', 'JBL Audio'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.9,
    mileage: '23.2 kmpl',
    luggageCapacity: '4 Bags',
    description: 'Ultra-luxurious 7-seater hybrid MUV engineered for royal family trips and long-distance comfort.',
  },
  {
    name: 'Scorpio N 2024-25',
    brand: 'Mahindra',
    category: 'suv',
    modelYear: 'Scorpio N 2024-25',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'manual',
    fuelType: 'diesel',
    seats: 7,
    pricePerHour: 295,
    pricePerDay: 7080,
    pricePerMonth: 85000,
    securityDeposit: 4000,
    features: ['mHawk Diesel Engine', 'Sony 3D Audio', 'Sunroof', '4XPLOR Terrain Modes', 'Wireless Charging'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.9,
    mileage: '16 kmpl',
    luggageCapacity: '3 Bags',
    description: 'Big daddy of SUVs offering commanding seating height, 7-seater road presence, and rugged power.',
  },
  {
    name: 'Swift ZXi 2025',
    brand: 'Maruti',
    category: 'hatchback',
    modelYear: 'Swift ZXi 2025',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'manual',
    fuelType: 'petrol',
    seats: 5,
    pricePerHour: 110,
    pricePerDay: 2650,
    pricePerMonth: 28000,
    securityDeposit: 2000,
    features: ['SmartPlay Infotainment', 'Auto AC', 'Dual Airbags', 'Push Button Start'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.7,
    mileage: '24.8 kmpl',
    luggageCapacity: '2 Bags',
    description: 'India\'s most loved hatchback with peppy engine, easy parking, and top fuel economy.',
  },
  {
    name: 'Thar 4x4 Convertible',
    brand: 'Mahindra',
    category: 'suv',
    modelYear: 'Thar 4x4 2025',
    images: [
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'manual',
    fuelType: 'diesel',
    seats: 4,
    pricePerHour: 230,
    pricePerDay: 5490,
    pricePerMonth: 65000,
    securityDeposit: 5000,
    features: ['4x4 Drivetrain', 'Hard Top / Convertible', 'Off-Road Suspension', 'Touchscreen Navigation'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.9,
    mileage: '15 kmpl',
    luggageCapacity: '2 Bags',
    description: 'Legendary off-roader built for weekend mountain getaways and road presence.',
  },
  {
    name: 'Creta SX (O) Turbo',
    brand: 'Hyundai',
    category: 'suv',
    modelYear: 'Creta 2025-26',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    ],
    transmission: 'automatic',
    fuelType: 'petrol',
    seats: 5,
    pricePerHour: 220,
    pricePerDay: 5208,
    pricePerMonth: 60000,
    securityDeposit: 3500,
    features: ['Panoramic Sunroof', 'Ventilated Seats', 'Bose Premium Audio', 'Level 2 ADAS'],
    citiesAvailable: ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad'],
    isActive: true,
    rating: 4.9,
    mileage: '18 kmpl',
    luggageCapacity: '3 Bags',
    description: 'Feature-loaded mid-SUV providing supreme ride quality, digital cockpit, and panoramic sunroof.',
  },
];

export async function seedInitialCars(tenantId = 'nextrent-demo') {
  try {
    const existing = await getCars(tenantId);
    if (existing && existing.length > 0) {
      console.log('Cars already exist in tenant:', tenantId);
      return { success: true, count: existing.length, seeded: false };
    }

    let addedCount = 0;
    for (const car of SAMPLE_CARS) {
      await addCar(tenantId, car);
      addedCount++;
    }
    return { success: true, count: addedCount, seeded: true };
  } catch (err) {
    console.error('Error seeding car data:', err);
    throw err;
  }
}
