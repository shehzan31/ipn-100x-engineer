const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../data/restaurants.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

// Helper function to parse operating hours
function parseOperatingHours(hoursStr) {
  // Extract all time patterns from the string
  const timePattern = /(\d{1,2}):?(\d{2})?\s*(AM|PM)/gi;
  const times = [];
  let match;

  while ((match = timePattern.exec(hoursStr)) !== null) {
    const hour = parseInt(match[1]);
    const minute = match[2] || '00';
    const period = match[3].toUpperCase();

    // Convert to 24-hour format
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === 'AM' && hour === 12) {
      hour24 = 0;
    }

    times.push(`${hour24.toString().padStart(2, '0')}:${minute}`);
  }

  if (times.length >= 2) {
    // Return earliest opening and latest closing
    return {
      opening: times[0],
      closing: times[times.length - 1]
    };
  }

  // Default hours if parsing fails
  return {
    opening: '11:00',
    closing: '22:00'
  };
}

// Helper function to convert price range
function convertPriceRange(priceStr) {
  // Extract price range like "$15-25" and convert to $ symbols
  const match = priceStr.match(/\$(\d+)-(\d+)/);
  if (match) {
    const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
    if (avg < 15) return '$';
    if (avg < 25) return '$$';
    if (avg < 35) return '$$$';
    return '$$$$';
  }
  return '$$';
}

// Houston coordinates (base location)
const houstonBase = { lat: 29.7604, lng: -95.3698 };

// Helper to generate nearby coordinates
function generateCoordinates(index, total) {
  // Spread restaurants around Houston area
  const angle = (index / total) * 2 * Math.PI;
  const radius = 0.15; // roughly 10 miles
  return {
    latitude: houstonBase.lat + (Math.cos(angle) * radius),
    longitude: houstonBase.lng + (Math.sin(angle) * radius)
  };
}

// Parse restaurants
const restaurants = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Split by comma, but be careful with commas in quoted fields
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());

  const hours = parseOperatingHours(fields[3] || '');
  const coords = generateCoordinates(i - 1, lines.length - 1);

  const restaurant = {
    id: i.toString(),
    name: fields[0] || '',
    address: fields[1] || '',
    cuisine: (fields[4] || 'Indian').split('/')[0], // Take first cuisine type
    rating: parseFloat(fields[8]) || 4.0,
    priceRange: convertPriceRange(fields[7] || '$10-20'),
    openingHours: hours.opening,
    closingHours: hours.closing,
    operatingHoursDetailed: fields[3] || '', // Preserve full operating hours from CSV
    latitude: coords.latitude,
    longitude: coords.longitude,
    phone: fields[2] || '',
    description: fields[10] || fields[6] || 'Authentic cuisine and excellent service'
  };

  restaurants.push(restaurant);
}

// Create output JSON
const output = {
  restaurants: restaurants
};

// Write to restaurants.json
const outputPath = path.join(__dirname, '../data/restaurants.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✅ Successfully converted ${restaurants.length} restaurants from CSV to JSON`);
console.log(`📁 Output written to: ${outputPath}`);
console.log('\nSample restaurant:');
console.log(JSON.stringify(restaurants[0], null, 2));
