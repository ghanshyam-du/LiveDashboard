/**
 * Realistic Seed Script for Live Vehicle Service Dashboard
 *
 * Creates:
 * - 10 vehicle services
 * - 55 customers (with Indian names)
 * - 22 mechanics (with specializations)
 * - 55 vehicles (one per customer)
 * - 520+ bookings spread across 90 days
 *
 * Safe to run repeatedly — drops existing data before inserting.
 * Run with: npx ts-node -r tsconfig-paths/register scripts/seed.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { BookingStatus, MechanicStatus, FuelType, NotificationType } from '../src/common/enums';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/live-dashboard';

// ── Realistic Indian names ────────────────────────────────────────────────────

const customerFirstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Kavitha',
  'Suresh', 'Deepa', 'Ajay', 'Meera', 'Kiran', 'Pooja', 'Nikhil', 'Divya',
  'Arjun', 'Sunita', 'Ravi', 'Nisha', 'Manish', 'Rekha', 'Sanjay', 'Anita',
  'Vijay', 'Geeta', 'Arun', 'Lakshmi', 'Prakash', 'Usha', 'Anil', 'Savita',
  'Rajesh', 'Mala', 'Naresh', 'Shobha', 'Dinesh', 'Padma', 'Girish', 'Vimala',
  'Harish', 'Sudha', 'Mohan', 'Radha', 'Ganesh', 'Saraswathi', 'Venkat', 'Bhavna',
  'Sunil', 'Jyoti', 'Kapil', 'Rashmi', 'Dev', 'Asha', 'Yash', 'Nandini',
];

const customerLastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Verma', 'Mehta', 'Reddy',
  'Nair', 'Iyer', 'Joshi', 'Rao', 'Desai', 'Shah', 'Chandra', 'Malhotra',
  'Agarwal', 'Bose', 'Das', 'Pandey',
];

const mechanicNames = [
  'Suresh Yadav', 'Ramesh Patil', 'Manoj Shetty', 'Dinesh Gaikwad', 'Vijay Kadam',
  'Santosh More', 'Raju Pawar', 'Ganesh Jadhav', 'Anil Nikam', 'Pravin Salve',
  'Vishal Bhosale', 'Santosh Waghmare', 'Mahesh Karpe', 'Akash Sonawane', 'Nilesh Mane',
  'Prashant Shinde', 'Sudhir Kulkarni', 'Deepak Thorat', 'Amol Deshpande', 'Yogesh Kale',
  'Nitin Powar', 'Sagar Chavan',
];

const vehicleMakes = [
  { make: 'Maruti Suzuki', models: ['Swift', 'Baleno', 'Ertiga', 'Dzire', 'Alto', 'Wagon R', 'Vitara Brezza', 'Ciaz'] },
  { make: 'Hyundai', models: ['i20', 'Creta', 'Verna', 'Grand i10', 'Tucson', 'Santro'] },
  { make: 'Tata Motors', models: ['Nexon', 'Harrier', 'Punch', 'Altroz', 'Safari', 'Tigor'] },
  { make: 'Mahindra', models: ['XUV700', 'Scorpio', 'Thar', 'Bolero', 'XUV300'] },
  { make: 'Honda', models: ['City', 'Amaze', 'Jazz', 'WR-V', 'Elevate'] },
  { make: 'Toyota', models: ['Innova Crysta', 'Fortuner', 'Urban Cruiser', 'Glanza'] },
  { make: 'Kia', models: ['Seltos', 'Sonet', 'Carens', 'EV6'] },
  { make: 'MG Motor', models: ['Hector', 'ZS EV', 'Gloster', 'Astor'] },
];

const vehicleColors = ['White', 'Silver', 'Black', 'Red', 'Blue', 'Grey', 'Brown', 'Orange'];
const fuelTypes = [FuelType.PETROL, FuelType.DIESEL, FuelType.PETROL, FuelType.PETROL, FuelType.CNG];

const indianStates = [
  'Mumbai, Maharashtra', 'Pune, Maharashtra', 'Bengaluru, Karnataka',
  'Chennai, Tamil Nadu', 'Hyderabad, Telangana', 'Delhi', 'Ahmedabad, Gujarat',
  'Kolkata, West Bengal', 'Jaipur, Rajasthan', 'Surat, Gujarat',
];

// ── Service catalogue ─────────────────────────────────────────────────────────

const serviceData = [
  { name: 'General Service', category: 'Maintenance', description: 'Comprehensive vehicle checkup and servicing', basePrice: 3500, estimatedDurationMinutes: 180 },
  { name: 'Oil Change', category: 'Maintenance', description: 'Engine oil and filter replacement', basePrice: 1200, estimatedDurationMinutes: 45 },
  { name: 'Brake Service', category: 'Safety', description: 'Brake pad inspection, replacement, and brake fluid top-up', basePrice: 2500, estimatedDurationMinutes: 90 },
  { name: 'Battery Replacement', category: 'Electrical', description: 'Battery testing and replacement', basePrice: 4500, estimatedDurationMinutes: 30 },
  { name: 'AC Service', category: 'Comfort', description: 'AC gas refill, filter cleaning, and performance check', basePrice: 2800, estimatedDurationMinutes: 120 },
  { name: 'Tire Service', category: 'Safety', description: 'Tire rotation, balancing, alignment, and puncture repair', basePrice: 1800, estimatedDurationMinutes: 60 },
  { name: 'Engine Diagnostics', category: 'Diagnostics', description: 'Computer diagnostics scan and fault code analysis', basePrice: 1500, estimatedDurationMinutes: 60 },
  { name: 'Car Wash & Detailing', category: 'Cosmetic', description: 'Full exterior wash, interior vacuuming, and polish', basePrice: 800, estimatedDurationMinutes: 90 },
  { name: 'Suspension Check', category: 'Safety', description: 'Shock absorber, spring, and steering inspection', basePrice: 2000, estimatedDurationMinutes: 90 },
  { name: 'Electrical Repair', category: 'Electrical', description: 'Wiring, fuse, and electrical component repair', basePrice: 3000, estimatedDurationMinutes: 120 },
];

// ── Helper utilities ──────────────────────────────────────────────────────────

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generatePhone(): string {
  return `+91 ${randomInt(70, 99)}${randomInt(10000000, 99999999)}`;
}

function generateRegistrationNumber(): string {
  const state = randomItem(['MH', 'KA', 'TN', 'DL', 'GJ', 'RJ', 'WB', 'UP']);
  const num = randomInt(1, 99).toString().padStart(2, '0');
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter1 = randomItem([...letters]);
  const letter2 = randomItem([...letters]);
  const digits = randomInt(1000, 9999);
  return `${state}${num}${letter1}${letter2}${digits}`;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function randomDateInRange(start: Date, end: Date): Date {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return new Date(startMs + Math.random() * (endMs - startMs));
}

// ── Schema definitions (minimal — only what seed needs) ───────────────────────

const customerSchema = new mongoose.Schema({ name: String, email: String, phone: String, address: String }, { timestamps: true });
const mechanicSchema = new mongoose.Schema({
  name: String, email: String, phone: String, specializations: [String],
  currentStatus: String, totalJobsCompleted: Number, rating: Number,
  yearsOfExperience: Number, isActive: Boolean,
}, { timestamps: true });
const vehicleSchema = new mongoose.Schema({ customer: mongoose.Schema.Types.ObjectId, make: String, model: String, year: Number, registrationNumber: String, color: String, fuelType: String }, { timestamps: true });
const serviceSchema = new mongoose.Schema({ name: String, category: String, description: String, basePrice: Number, estimatedDurationMinutes: Number, isActive: Boolean }, { timestamps: true });
const bookingSchema = new mongoose.Schema({
  bookingNumber: String, customer: mongoose.Schema.Types.ObjectId, vehicle: mongoose.Schema.Types.ObjectId,
  service: mongoose.Schema.Types.ObjectId, mechanic: mongoose.Schema.Types.ObjectId,
  status: String, amount: Number, notes: String, scheduledAt: Date,
  completedAt: Date, cancelledAt: Date, cancellationReason: String, statusHistory: [Object],
}, { timestamps: true });
const notificationSchema = new mongoose.Schema({ type: String, title: String, message: String, referenceId: mongoose.Schema.Types.ObjectId, referenceType: String, isRead: Boolean }, { timestamps: true });

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // Drop existing data for clean reseed
  const db = mongoose.connection.db;
  await db.collection('customers').deleteMany({});
  await db.collection('mechanics').deleteMany({});
  await db.collection('vehicles').deleteMany({});
  await db.collection('services').deleteMany({});
  await db.collection('bookings').deleteMany({});
  await db.collection('notifications').deleteMany({});
  console.log('🗑  Cleared existing data\n');

  const CustomerModel = mongoose.model('Customer', customerSchema, 'customers');
  const MechanicModel = mongoose.model('Mechanic', mechanicSchema, 'mechanics');
  const VehicleModel = mongoose.model('Vehicle', vehicleSchema, 'vehicles');
  const ServiceModel = mongoose.model('Service', serviceSchema, 'services');
  const BookingModel = mongoose.model('Booking', bookingSchema, 'bookings');
  const NotificationModel = mongoose.model('Notification', notificationSchema, 'notifications');

  // ── 1. Seed services ────────────────────────────────────────────────────────
  const services = await ServiceModel.insertMany(
    serviceData.map((s) => ({ ...s, isActive: true })),
  );
  console.log(`✅ Seeded ${services.length} services`);

  // ── 2. Seed customers ───────────────────────────────────────────────────────
  const usedEmails = new Set<string>();
  const customerDocs = [];

  for (let i = 0; i < 55; i++) {
    const firstName = randomItem(customerFirstNames);
    const lastName = randomItem(customerLastNames);
    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + randomInt(1, 99)}@gmail.com`;
    }
    usedEmails.add(email);

    customerDocs.push({
      name: `${firstName} ${lastName}`,
      email,
      phone: generatePhone(),
      address: randomItem(indianStates),
    });
  }

  const customers = await CustomerModel.insertMany(customerDocs);
  console.log(`✅ Seeded ${customers.length} customers`);

  // ── 3. Seed mechanics ───────────────────────────────────────────────────────
  const specializations = [
    ['Engine Repair', 'Oil Change', 'General Service'],
    ['Brake Service', 'Suspension Check', 'Tire Service'],
    ['AC Service', 'Electrical Repair'],
    ['Engine Diagnostics', 'Engine Repair', 'General Service'],
    ['Car Wash & Detailing', 'Tire Service'],
    ['Battery Replacement', 'Electrical Repair'],
  ];

  const mechanicStatuses = [
    MechanicStatus.AVAILABLE, MechanicStatus.AVAILABLE, MechanicStatus.AVAILABLE,
    MechanicStatus.BUSY, MechanicStatus.ON_THE_WAY, MechanicStatus.OFFLINE,
  ];

  const mechanicDocs = mechanicNames.map((name, index) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}${index + 1}@instantmechanic.in`,
    phone: generatePhone(),
    specializations: randomItem(specializations),
    currentStatus: randomItem(mechanicStatuses),
    totalJobsCompleted: randomInt(40, 380),
    rating: randomFloat(3.5, 5.0),
    yearsOfExperience: randomInt(2, 15),
    isActive: true,
  }));

  const mechanics = await MechanicModel.insertMany(mechanicDocs);
  console.log(`✅ Seeded ${mechanics.length} mechanics`);

  // ── 4. Seed vehicles (one per customer) ────────────────────────────────────
  const vehicleDocs = customers.map((customer) => {
    const brand = randomItem(vehicleMakes);
    return {
      customer: customer._id,
      make: brand.make,
      model: randomItem(brand.models),
      year: randomInt(2016, 2024),
      registrationNumber: generateRegistrationNumber(),
      color: randomItem(vehicleColors),
      fuelType: randomItem(fuelTypes),
    };
  });

  const vehicles = await VehicleModel.insertMany(vehicleDocs);
  console.log(`✅ Seeded ${vehicles.length} vehicles`);

  // Build a map: customerId → vehicle for easy lookup
  const vehicleByCustomer = new Map(
    vehicles.map((v) => [v.customer.toString(), v]),
  );

  // ── 5. Seed bookings (520+ across 90 days) ─────────────────────────────────
  const statusWeights: { status: BookingStatus; weight: number }[] = [
    { status: BookingStatus.COMPLETED, weight: 50 },
    { status: BookingStatus.PENDING, weight: 15 },
    { status: BookingStatus.ASSIGNED, weight: 12 },
    { status: BookingStatus.MECHANIC_ON_THE_WAY, weight: 8 },
    { status: BookingStatus.CANCELLED, weight: 15 },
  ];

  function weightedRandomStatus(): BookingStatus {
    const totalWeight = statusWeights.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { status, weight } of statusWeights) {
      random -= weight;
      if (random <= 0) return status;
    }
    return BookingStatus.PENDING;
  }

  const notes = [
    'Customer requested quick service.',
    'Vehicle making unusual noise.',
    'Scheduled as part of annual maintenance plan.',
    'Customer will wait on site.',
    'Key under the front mat.',
    '',
  ];

  const cancellationReasons = [
    'Customer not available', 'Vehicle already repaired elsewhere',
    'Customer rescheduled', 'No mechanics available',
  ];

  const bookingDocs = [];
  const notificationDocs = [];
  const rangeStart = daysAgo(90);

  for (let i = 1; i <= 520; i++) {
    const customer = randomItem(customers as any[]);
    const vehicle = vehicleByCustomer.get(customer._id.toString());
    const service = randomItem(services as any[]);

    // 80% of completed/assigned bookings have a mechanic
    const needsMechanic =
      Math.random() > 0.2 ||
      [BookingStatus.ASSIGNED, BookingStatus.MECHANIC_ON_THE_WAY, BookingStatus.COMPLETED].includes(
        BookingStatus.PENDING, // placeholder, actual status determined below
      );

    const status = weightedRandomStatus();
    const mechanic =
      status !== BookingStatus.PENDING && status !== BookingStatus.CANCELLED
        ? randomItem(mechanics as any[])
        : null;

    const scheduledAt = randomDateInRange(rangeStart, new Date());
    const amount = service.basePrice + randomInt(-200, 800);

    const bookingNumber = `BK-${String(i).padStart(5, '0')}`;

    const statusHistory = [
      { status: BookingStatus.PENDING, changedAt: scheduledAt, notes: '' },
    ];

    let completedAt: Date | undefined;
    let cancelledAt: Date | undefined;
    let cancellationReason: string | undefined;

    if (status === BookingStatus.ASSIGNED) {
      statusHistory.push({ status: BookingStatus.ASSIGNED, changedAt: new Date(scheduledAt.getTime() + 30 * 60000), notes: '' });
    } else if (status === BookingStatus.MECHANIC_ON_THE_WAY) {
      statusHistory.push({ status: BookingStatus.ASSIGNED, changedAt: new Date(scheduledAt.getTime() + 30 * 60000), notes: '' });
      statusHistory.push({ status: BookingStatus.MECHANIC_ON_THE_WAY, changedAt: new Date(scheduledAt.getTime() + 60 * 60000), notes: '' });
    } else if (status === BookingStatus.COMPLETED) {
      statusHistory.push({ status: BookingStatus.ASSIGNED, changedAt: new Date(scheduledAt.getTime() + 30 * 60000), notes: '' });
      statusHistory.push({ status: BookingStatus.MECHANIC_ON_THE_WAY, changedAt: new Date(scheduledAt.getTime() + 60 * 60000), notes: '' });
      statusHistory.push({ status: BookingStatus.COMPLETED, changedAt: new Date(scheduledAt.getTime() + 180 * 60000), notes: '' });
      completedAt = new Date(scheduledAt.getTime() + 180 * 60000);
    } else if (status === BookingStatus.CANCELLED) {
      cancelledAt = new Date(scheduledAt.getTime() + randomInt(10, 120) * 60000);
      cancellationReason = randomItem(cancellationReasons);
      statusHistory.push({ status: BookingStatus.CANCELLED, changedAt: cancelledAt, notes: cancellationReason });
    }

    bookingDocs.push({
      bookingNumber,
      customer: customer._id,
      vehicle: vehicle?._id,
      service: service._id,
      mechanic: mechanic?._id ?? null,
      status,
      amount,
      notes: randomItem(notes),
      scheduledAt,
      completedAt,
      cancelledAt,
      cancellationReason,
      statusHistory,
    });

    // Create a notification for each booking
    notificationDocs.push({
      type: NotificationType.BOOKING_CREATED,
      title: `New Booking ${bookingNumber}`,
      message: `${customer.name} booked ${service.name} for ${scheduledAt.toDateString()}.`,
      referenceType: 'Booking',
      isRead: i < 480, // last 40 bookings are unread
    });
  }

  await BookingModel.insertMany(bookingDocs);
  console.log(`✅ Seeded ${bookingDocs.length} bookings`);

  await NotificationModel.insertMany(notificationDocs);
  console.log(`✅ Seeded ${notificationDocs.length} notifications`);

  console.log('\n🎉 Seed complete! Database is ready.\n');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
