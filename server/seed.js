import mongoose from "mongoose";
import dotenv from "dotenv";
import Test from "./models/Test.js";
import HealthCondition from "./models/HealthCondition.js";
import SampleReport from "./models/SampleReport.js";
import HealthPackage from "./models/HealthPackage.js";

dotenv.config();

const testsData = [
  {
    name: "Complete Blood Count (CBC)",
    price: 349,
    parameters: 24,
    reportTime: "Same Day",
    prerequisites: "No fasting required",
    category: "Haematology",
  },
  {
    name: "HbA1c (Glycated Haemoglobin)",
    price: 499,
    parameters: 1,
    reportTime: "Same Day",
    prerequisites: "No fasting required",
    category: "Diabetes",
  },
  {
    name: "C-Reactive Protein (CRP)",
    price: 599,
    parameters: 1,
    reportTime: "Same Day",
    prerequisites: "No fasting required",
    category: "Inflammation",
  },
  {
    name: "Iron Studies Panel",
    price: 899,
    parameters: 4,
    reportTime: "Next Day",
    prerequisites: "12 hours fasting",
    category: "Nutrition",
  },
  {
    name: "Zinc Level Test",
    price: 749,
    parameters: 1,
    reportTime: "Next Day",
    prerequisites: "No fasting required",
    category: "Nutrition",
  },
  {
    name: "Thyroid Profile (T3, T4, TSH)",
    price: 649,
    parameters: 3,
    reportTime: "Same Day",
    prerequisites: "No fasting required",
    category: "Thyroid",
  },
  {
    name: "Lipid Profile",
    price: 549,
    parameters: 8,
    reportTime: "Same Day",
    prerequisites: "12 hours fasting",
    category: "Cardiac",
  },
  {
    name: "Liver Function Test (LFT)",
    price: 699,
    parameters: 12,
    reportTime: "Same Day",
    prerequisites: "10-12 hours fasting",
    category: "Liver",
  },
  {
    name: "Kidney Function Test (KFT)",
    price: 799,
    parameters: 10,
    reportTime: "Same Day",
    prerequisites: "No fasting required",
    category: "Kidney",
  },
  {
    name: "Vitamin D (25-OH)",
    price: 899,
    parameters: 1,
    reportTime: "Next Day",
    prerequisites: "No fasting required",
    category: "Nutrition",
  },
  {
    name: "Vitamin B12",
    price: 799,
    parameters: 1,
    reportTime: "Next Day",
    prerequisites: "No fasting required",
    category: "Nutrition",
  },
  {
    name: "Full Body Health Checkup",
    price: 1999,
    parameters: 72,
    reportTime: "2-3 Days",
    prerequisites: "12 hours fasting",
    category: "Health Packages",
  },
];

// Map old IDs (1-12) to test index for relating
const oldIdToIndex = {};
testsData.forEach((_, i) => {
  oldIdToIndex[String(i + 1)] = i;
});

const healthConditionsData = [
  {
    slug: "bone-health-arthritis",
    label: "Bone Health & Arthritis",
    title: "Bone Health and Arthritis: Symptoms, Risks, Tests, and Early Diagnosis",
    description:
      "Bone health and joint health play a critical role in mobility, independence, and overall quality of life. Yet, conditions affecting bones and joints, especially arthritis, are often dismissed as a normal part of aging.",
    sections: [
      { title: "Introduction / Overview", content: "**Bone health** refers to the strength, density, and structural integrity of bones, which allow the body to support weight, protect organs, and enable movement.\n\n**Arthritis** is a group of conditions characterized by inflammation, degeneration, or damage to one or more joints." },
      { title: "Symptoms & Warning Signs", content: "Common symptoms include persistent joint pain and stiffness, swelling or tenderness around joints, reduced range of motion, bone fractures from minor falls, back pain or loss of height, and a stooped posture." },
      { title: "Risk Factors", content: "Key risk factors include age (bone density decreases after 30), family history of osteoporosis or arthritis, sedentary lifestyle, calcium and vitamin D deficiency, smoking and excessive alcohol consumption, obesity, and hormonal changes." },
      { title: "Recommended Tests", content: "Essential diagnostic tests include Vitamin D (25-OH), Calcium levels, Rheumatoid Factor (RF), Anti-CCP antibodies, Uric Acid levels, CBC, CRP, and ESR." },
      { title: "Prevention & Lifestyle Tips", content: "Maintain adequate calcium and vitamin D intake. Engage in regular weight-bearing exercises. Maintain a healthy body weight. Avoid smoking and limit alcohol consumption." },
    ],
    relatedTestIds: ["1", "3", "10"],
  },
  {
    slug: "heart-health",
    label: "Heart Health",
    title: "Heart Health: Risk Factors, Tests, and Prevention",
    description: "Cardiovascular diseases are the leading cause of death globally. Understanding your heart health through regular screening can help detect risks early.",
    sections: [
      { title: "Introduction / Overview", content: "Heart health encompasses the overall functioning of the cardiovascular system including the heart, blood vessels, and blood circulation." },
      { title: "Symptoms & Warning Signs", content: "Watch for chest pain or discomfort, shortness of breath, fatigue during physical activity, irregular heartbeat, dizziness, and swelling in legs or ankles." },
      { title: "Risk Factors", content: "Major risk factors include high blood pressure, high cholesterol, diabetes, smoking, obesity, family history, sedentary lifestyle, stress, and poor diet." },
      { title: "Recommended Tests", content: "Key tests include Lipid Profile, ECG, Echocardiogram, Blood Pressure monitoring, Blood Sugar levels, CRP, Homocysteine levels, and Troponin tests." },
    ],
    relatedTestIds: ["7", "1", "3"],
  },
  {
    slug: "allergies",
    label: "Allergies",
    title: "Allergies: Types, Triggers, Tests, and Management",
    description: "Allergies occur when the immune system reacts to foreign substances that are usually harmless.",
    sections: [
      { title: "Introduction / Overview", content: "An allergy is an exaggerated immune response to substances known as allergens." },
      { title: "Common Types", content: "Respiratory allergies, food allergies, skin allergies, drug allergies, and insect sting allergies are among the most common types." },
      { title: "Recommended Tests", content: "Allergy testing includes IgE blood tests, skin prick tests, patch tests, and elimination diets." },
    ],
    relatedTestIds: ["1"],
  },
  {
    slug: "diabetes",
    label: "Diabetes",
    title: "Diabetes: Types, Symptoms, Tests, and Management",
    description: "Diabetes is a chronic metabolic disorder that affects how your body processes blood sugar.",
    sections: [
      { title: "Introduction / Overview", content: "Diabetes mellitus is a group of diseases that affect how your body uses blood sugar (glucose)." },
      { title: "Symptoms & Warning Signs", content: "Common symptoms include increased thirst and urination, unexplained weight loss, fatigue, blurred vision, slow-healing wounds." },
      { title: "Recommended Tests", content: "Key diagnostic tests include HbA1c, Fasting Blood Sugar, Post-Prandial Blood Sugar, and Oral Glucose Tolerance Test." },
    ],
    relatedTestIds: ["2", "9"],
  },
  {
    slug: "pregnancy",
    label: "Pregnancy",
    title: "Pregnancy Health: Essential Tests and Care Guide",
    description: "Regular health monitoring during pregnancy ensures the well-being of both mother and baby.",
    sections: [
      { title: "Introduction / Overview", content: "Pregnancy requires careful health monitoring through each trimester." },
      { title: "Essential Tests by Trimester", content: "First trimester: CBC, Blood group & Rh typing, HIV, Hepatitis B & C, Thyroid profile. Second trimester: Glucose tolerance test. Third trimester: Group B Strep, repeat CBC, liver and kidney function tests." },
    ],
    relatedTestIds: ["1", "6", "8", "9"],
  },
  {
    slug: "cancer",
    label: "Cancer",
    title: "Cancer Screening: Early Detection Saves Lives",
    description: "Cancer screening and early detection significantly improve treatment outcomes.",
    sections: [
      { title: "Introduction / Overview", content: "Cancer is characterized by uncontrolled cell growth." },
      { title: "Common Screening Tests", content: "Key screening tests include tumor markers (PSA, CA-125, CEA, AFP), mammography, pap smear, colonoscopy, and CBC." },
    ],
    relatedTestIds: ["1", "3"],
  },
  {
    slug: "neurology",
    label: "Neurology",
    title: "Neurological Health: Understanding Brain and Nerve Conditions",
    description: "Neurological conditions affect the brain, spinal cord, and nerves.",
    sections: [
      { title: "Introduction / Overview", content: "Neurological health encompasses conditions affecting the central and peripheral nervous systems." },
      { title: "Warning Signs", content: "Key warning signs include persistent headaches, numbness or tingling, memory problems, balance issues, vision changes, and muscle weakness." },
    ],
    relatedTestIds: ["1", "11"],
  },
  {
    slug: "eye-health",
    label: "Eye Health",
    title: "Eye Health: Vision Care, Tests, and Prevention",
    description: "Regular eye examinations can detect vision problems and underlying health conditions early.",
    sections: [
      { title: "Introduction / Overview", content: "Eye health is closely linked to overall health. Conditions like diabetes and hypertension can affect vision." },
      { title: "Related Blood Tests", content: "Blood tests that support eye health monitoring include HbA1c for diabetic retinopathy risk, Vitamin A levels, inflammatory markers." },
    ],
    relatedTestIds: ["2", "6"],
  },
  {
    slug: "general-wellness",
    label: "General Wellness",
    title: "General Wellness: Comprehensive Health Screening",
    description: "Preventive health checkups help identify potential health risks before they become serious problems.",
    sections: [
      { title: "Introduction / Overview", content: "General wellness screening involves a comprehensive set of tests that evaluate your overall health." },
      { title: "Recommended Checkup Frequency", content: "Adults under 40 should get a basic health checkup annually. After 40, comprehensive screening is recommended every 6-12 months." },
    ],
    relatedTestIds: ["1", "2", "6", "7", "8", "9", "10", "11", "12"],
  },
  {
    slug: "thyroid-disorders",
    label: "Thyroid Disorders",
    title: "Thyroid Disorders: Symptoms, Diagnosis, and Management",
    description: "The thyroid gland regulates metabolism, energy, and growth.",
    sections: [
      { title: "Introduction / Overview", content: "The thyroid is a butterfly-shaped gland in the neck that produces hormones controlling metabolism." },
      { title: "Symptoms", content: "Hypothyroidism: fatigue, weight gain, cold intolerance. Hyperthyroidism: weight loss, rapid heartbeat, anxiety." },
      { title: "Recommended Tests", content: "Essential thyroid tests include TSH, Free T3, Free T4, Anti-TPO antibodies, and Thyroglobulin." },
    ],
    relatedTestIds: ["6", "1"],
  },
  {
    slug: "womens-health",
    label: "Women's Health",
    title: "Women's Health: Specialized Tests and Screening",
    description: "Women have unique health needs that change throughout life.",
    sections: [
      { title: "Introduction / Overview", content: "Women's health encompasses a wide range of conditions specific to or more common in women." },
      { title: "Recommended Screening", content: "Key tests include CBC, thyroid profile, iron studies, vitamin D, calcium levels, hormonal panels." },
    ],
    relatedTestIds: ["1", "4", "6", "10"],
  },
  {
    slug: "senior-citizen",
    label: "Senior Citizen",
    title: "Senior Citizen Health: Age-Appropriate Screening",
    description: "As we age, regular health monitoring becomes increasingly important.",
    sections: [
      { title: "Introduction / Overview", content: "Senior citizens face increased risk for chronic conditions including heart disease, diabetes, osteoporosis." },
      { title: "Recommended Tests", content: "Essential tests include CBC, Lipid Profile, Blood Sugar, Kidney and Liver Function, Thyroid Profile, Vitamin D, Vitamin B12." },
    ],
    relatedTestIds: ["1", "2", "6", "7", "8", "9", "10", "11", "12"],
  },
];

const sampleReportsData = [
  {
    testIndex: 0, // CBC
    title: "Complete Blood Count (CBC)",
    specimen: "EDTA K2 Whole Blood",
    rows: [
      { name: "Hemoglobin (Hb)", result: "12.90", range: "12-15", unit: "g/dL", method: "Spectrophotometry" },
      { name: "Red Blood Cell (RBC) Count", result: "5.02", range: "3.8-4.8", unit: "Million/cu.mm", method: "Impedance", isBold: true },
      { name: "Packed Cell Volume (PCV) / Hematocrit", result: "36.8", range: "36-46", unit: "%", method: "Numeric Integration" },
      { name: "Mean Corpuscular Volume (MCV)", result: "73.4", range: "83-101", unit: "fL", method: "Calculated", isBold: true },
      { name: "Mean Corpuscular Hemoglobin (MCH)", result: "25.7", range: "27-32", unit: "pg", method: "Calculated", isBold: true },
      { name: "Mean Corpuscular Hb Concentration (MCHC)", result: "35.1", range: "31.5-34.5", unit: "g/dL", method: "Calculated" },
      { name: "Red Cell Distribution Width (RDW-CV)", result: "17.1", range: "11.6-14", unit: "%", method: "Calculated", isBold: true },
      { name: "Total Leucocyte Count (TLC)", result: "7,850.0", range: "4000-10000", unit: "Cells/cu.mm", method: "Impedance", isBold: true },
      { name: "Differential Leucocyte Count (DLC)", result: "", range: "", unit: "", method: "", isHeader: true },
      { name: "Neutrophils", result: "57.4", range: "40-80", unit: "%", method: "Impedance & FCM" },
      { name: "Lymphocytes", result: "30.2", range: "20-40", unit: "%", method: "Impedance & FCM" },
      { name: "Monocytes", result: "6.8", range: "2-10", unit: "%", method: "Impedance & FCM" },
      { name: "Eosinophils", result: "5.5", range: "1-6", unit: "%", method: "Impedance & FCM" },
      { name: "Basophils", result: "0.1", range: "0-2", unit: "%", method: "Impedance & FCM" },
      { name: "Absolute Leucocyte Count", result: "", range: "", unit: "", method: "", isHeader: true },
      { name: "Neutrophils", result: "4,506", range: "2000-7000", unit: "Cells/cu.mm", method: "Calculated" },
      { name: "Lymphocytes", result: "2,371", range: "1000-3000", unit: "Cells/cu.mm", method: "Calculated" },
      { name: "Monocytes", result: "534", range: "200-1000", unit: "Cells/cu.mm", method: "Calculated" },
      { name: "Eosinophils", result: "432", range: "20-500", unit: "Cells/cu.mm", method: "Calculated" },
      { name: "Basophils", result: "8", range: "0-100", unit: "Cells/cu.mm", method: "Calculated" },
      { name: "Platelet Count", result: "339,000", range: "150000-410000", unit: "per cu.mm", method: "Impedance", isBold: true },
      { name: "Mean Platelet Volume (MPV)", result: "9.9", range: "7.4-12.0", unit: "fL", method: "Impedance" },
    ],
  },
  {
    testIndex: 1, // HbA1c
    title: "HbA1c (Glycated Haemoglobin)",
    specimen: "EDTA Whole Blood",
    rows: [
      { name: "HbA1c", result: "5.6", range: "<5.7", unit: "%", method: "HPLC" },
      { name: "Estimated Average Glucose (eAG)", result: "114", range: "-", unit: "mg/dL", method: "Calculated" },
    ],
  },
  {
    testIndex: 5, // Thyroid Profile
    title: "Thyroid Profile (T3, T4, TSH)",
    specimen: "Serum",
    rows: [
      { name: "T3 (Triiodothyronine)", result: "1.15", range: "0.8-2.0", unit: "ng/mL", method: "CLIA" },
      { name: "T4 (Thyroxine)", result: "7.8", range: "5.1-14.1", unit: "µg/dL", method: "CLIA" },
      { name: "TSH (Thyroid Stimulating Hormone)", result: "2.45", range: "0.27-4.2", unit: "µIU/mL", method: "CLIA" },
    ],
  },
  {
    testIndex: 6, // Lipid Profile
    title: "Lipid Profile",
    specimen: "Serum (Fasting)",
    rows: [
      { name: "Total Cholesterol", result: "185", range: "<200", unit: "mg/dL", method: "Enzymatic" },
      { name: "Triglycerides", result: "142", range: "<150", unit: "mg/dL", method: "Enzymatic" },
      { name: "HDL Cholesterol", result: "52", range: ">40", unit: "mg/dL", method: "Direct" },
      { name: "LDL Cholesterol (Direct)", result: "105", range: "<100", unit: "mg/dL", method: "Direct", isBold: true },
      { name: "VLDL Cholesterol", result: "28.4", range: "5-40", unit: "mg/dL", method: "Calculated" },
      { name: "Total Cholesterol/HDL Ratio", result: "3.56", range: "<4.5", unit: "-", method: "Calculated" },
      { name: "LDL/HDL Ratio", result: "2.02", range: "<3.5", unit: "-", method: "Calculated" },
      { name: "Non-HDL Cholesterol", result: "133", range: "<130", unit: "mg/dL", method: "Calculated" },
    ],
  },
  {
    testIndex: 7, // LFT
    title: "Liver Function Test (LFT)",
    specimen: "Serum",
    rows: [
      { name: "Total Bilirubin", result: "0.8", range: "0.1-1.2", unit: "mg/dL", method: "Diazo" },
      { name: "Direct Bilirubin", result: "0.2", range: "0-0.3", unit: "mg/dL", method: "Diazo" },
      { name: "Indirect Bilirubin", result: "0.6", range: "0.1-1.0", unit: "mg/dL", method: "Calculated" },
      { name: "SGOT (AST)", result: "28", range: "0-40", unit: "U/L", method: "IFCC" },
      { name: "SGPT (ALT)", result: "32", range: "0-41", unit: "U/L", method: "IFCC" },
      { name: "Alkaline Phosphatase", result: "78", range: "44-147", unit: "U/L", method: "IFCC" },
      { name: "GGT", result: "24", range: "10-71", unit: "U/L", method: "Enzymatic" },
      { name: "Total Protein", result: "7.2", range: "6.6-8.7", unit: "g/dL", method: "Biuret" },
      { name: "Albumin", result: "4.1", range: "3.5-5.2", unit: "g/dL", method: "BCG" },
      { name: "Globulin", result: "3.1", range: "2.0-3.5", unit: "g/dL", method: "Calculated" },
      { name: "A/G Ratio", result: "1.32", range: "1.1-2.5", unit: "-", method: "Calculated" },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Test.deleteMany({});
    await HealthCondition.deleteMany({});
    await SampleReport.deleteMany({});
    console.log("Cleared existing data.");

    // Insert tests
    const insertedTests = await Test.insertMany(testsData);
    console.log(`Inserted ${insertedTests.length} tests.`);

    // Map old IDs to new MongoDB ObjectIds
    const testIdMap = {};
    insertedTests.forEach((test, index) => {
      testIdMap[String(index + 1)] = test._id;
    });

    // Insert health conditions with mapped test IDs
    const conditionsToInsert = healthConditionsData.map((condition) => {
      const { relatedTestIds, ...rest } = condition;
      return {
        ...rest,
        relatedTests: relatedTestIds
          .map((oldId) => testIdMap[oldId])
          .filter(Boolean),
      };
    });
    const insertedConditions = await HealthCondition.insertMany(conditionsToInsert);
    console.log(`Inserted ${insertedConditions.length} health conditions.`);

    // Insert sample reports with mapped test IDs
    const reportsToInsert = sampleReportsData.map((report) => {
      const { testIndex, ...rest } = report;
      return {
        ...rest,
        test: insertedTests[testIndex]._id,
      };
    });
    const insertedReports = await SampleReport.insertMany(reportsToInsert);
    console.log(`Inserted ${insertedReports.length} sample reports.`);

    // ── Health Packages ──
    await HealthPackage.deleteMany({});
    const healthPackagesData = [
      {
        name: "LupiKavach Health Screen Package - Lily",
        price: 1240,
        parameters: 80,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "LupiKavach Health Screen Package - Daisy",
        price: 1790,
        parameters: 87,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "LupiKavach Health Package - Orchid",
        price: 2250,
        parameters: 88,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "LupiKavach Health Screen Package - Dahlia",
        price: 990,
        parameters: 78,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "Complete Wellness Package - Tulip",
        price: 1499,
        parameters: 92,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "Senior Citizen Health Package",
        price: 2999,
        parameters: 110,
        reportTime: "Next Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "Women Wellness Package",
        price: 1899,
        parameters: 65,
        reportTime: "Same Day",
        prerequisites: "Detailed Clinical History",
      },
      {
        name: "Diabetes Care Package",
        price: 1350,
        parameters: 45,
        reportTime: "Same Day",
        prerequisites: "12 hours fasting",
      },
    ];
    const insertedPackages = await HealthPackage.insertMany(healthPackagesData);
    console.log(`Inserted ${insertedPackages.length} health packages.`);

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
