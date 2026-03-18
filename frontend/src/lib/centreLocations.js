export const centreLocations = [
  {
    city: "Gorakhpur",
    name: "Alliance Diagnostic — Gorakhpur",
    address: "Near Saryu Nehar Colony, Opp. Hero Bike Showroom, Deoria Road, Singhariya, Gorakhpur-273008",
    phone: "91187-03479, 70805-63479",
  },
  {
    city: "Patna",
    name: "Alliance Diagnostic — Patna",
    address: "Vedam Netralaya, O-42 Doctor's Colony Kankarbagh, Patna (800020)",
    phone: "6200488170",
  },
  {
    city: "Ranchi",
    name: "Alliance Diagnostic — Ranchi",
    address: "Lig R-32, Harmu Housing Colony, Near Patel Chowk, Ranchi-834002",
    phone: "9934443513",
  },
  {
    city: "Lucknow",
    name: "Alliance Diagnostic — Lucknow",
    address: "Shop No 222, 2nd Floor, Prince Complex, Hazratganj, Lucknow",
    phone: "+91 6392772944, +91 7080563479",
  },
  {
    city: "Ahmedabad",
    name: "Alliance Diagnostic — Ahmedabad",
    address: "Cabin No. 102, 1st Floor, Emreld Building, Above Karnavati, Pagarkha, Near Choice Restaurant, Mithakhali, Navrangpura, Ahmedabad, Gujarat-380009",
    phone: "9725225607",
  },
  {
    city: "Siwan",
    name: "Alliance Diagnostic — Siwan",
    address: "Mahadeva Road, Siwan, Near Shiv Mandir (841226)",
    phone: "8235389036",
  },
  {
    city: "Jaipur",
    name: "Alliance Diagnostic — Jaipur",
    address: "Mahesh Chamber, Opp. Metro Piller No. 176, W-8, Park Street, Near Bank of Baroda, M. I. Road, Jaipur (Raj.)-302001",
    phone: "8824627213, 8094970219",
  },
  {
    city: "Amritsar",
    name: "Alliance Diagnostic — Amritsar",
    address: "SCO-72, 4th Floor, City Centre, Opp. Pingalwara, Near Bus Stand, G. T. Road, Amritsar",
    phone: "8544919364",
  },
  {
    city: "Kolkata",
    name: "Alliance Diagnostic — Kolkata",
    address: "Airport Gate No. 1, Italgacha Road, Kolkata-700028",
    phone: "91477-33317",
  },
  {
    city: "Hyderabad",
    name: "Alliance Diagnostic — Hyderabad",
    address: "7-1-58, Surekha Chambers, Ameerpet Road, Opp. Metro Piller No. C-1434, Near Kerala Coirmat Mart, Ameerpet, Hyderabad-500016, Telangana",
    phone: "8341026607, 8341026608",
  },
  {
    city: "Vadodara",
    name: "Alliance Diagnostic — Vadodara",
    address: "M-2 Antariksh Complex, Opp. World Trade Centre, Kadak Bazar Road, Vadodara",
    phone: "9054722437, 9054822437",
  },
  {
    city: "Chandigarh",
    name: "Alliance Diagnostic — Chandigarh",
    address: "SCO. 23, Top Floor, Sector - 33 D, Chandigarh",
    phone: "9115511309, 9115513031",
  },
  {
    city: "New Delhi",
    name: "Alliance Diagnostic — New Delhi",
    address: "D-9, Shop No.-1, Dal Mill Road, Manjeet Farm Uttam Nagar West, Pillar No. 683, New Delhi-110059",
    phone: "83930-29412",
  },
  {
    city: "Mumbai",
    name: "Alliance Diagnostic — Mumbai",
    address: "Shop No. 04/A Building No. 85, Kanj Kany HSC, Opposite Ambedkar Garden, Near Swamisamarth Temple, Nehru Nagar, Kurla (E), Mumbai-400024",
    phone: "9152668852, 8094970219",
  },
  {
    city: "Mysuru",
    name: "Alliance Diagnostic — Mysuru",
    address: "Pulkeshi Road, Tilak Nagar, Mysuru-570015",
    phone: "9880924042, 9611039134",
  },
  {
    city: "Bengaluru",
    name: "Alliance Diagnostic — Bengaluru",
    address: "169/18, 1st Main, Vidyaranyanagar, Magadi Road, Opp. Old Toll Gate Bus Stop, Bengaluru - 560023",
    phone: "6200488170",
  },
  {
    city: "Gopalganj",
    name: "Alliance Diagnostic — Gopalganj",
    address: "Suman Hospital Near By Banjari Flyover, Gopalganj",
    phone: "6200488170",
  },
  {
    city: "Jamshedpur",
    name: "Alliance Diagnostic — Jamshedpur",
    address: "Arjun Tower, S/No. 9,11,23, Opp, Pirthiwi Paryawaran Uddhyan, Beside Reliance Fresh, New Purlia Road, Mango, Jamshedpur, Jharkhand 831012",
    phone: "6200488170",
  },
  {
    city: "Kerala",
    name: "Alliance Diagnostic — Kerala",
    address: "Chittoor Rd, Shenoys, Ernakulam, Kerala 682035",
    phone: "0484 4022251",
  },
];

export const centreCities = centreLocations.map((centre) => centre.city);

export const topCentreCities = [
  "Patna",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Kolkata",
  "Lucknow",
  "Ranchi",
  "Ahmedabad",
].filter((city) => centreCities.includes(city));

export const defaultCentreCity = centreCities[0] || "Patna";
