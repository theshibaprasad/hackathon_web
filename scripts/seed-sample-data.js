const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Theme = require('../src/models/Theme');
const ProblemStatement = require('../src/models/ProblemStatement');

const sampleThemes = [
  {
    name: 'Artificial Intelligence & Machine Learning',
    description: 'Build intelligent solutions using AI/ML technologies to solve real-world problems'
  },
  {
    name: 'Web Development',
    description: 'Create innovative web applications and solutions using modern technologies'
  },
  {
    name: 'Mobile Development',
    description: 'Develop mobile applications for iOS and Android platforms'
  },
  {
    name: 'Blockchain & Web3',
    description: 'Explore decentralized applications and blockchain solutions'
  },
  {
    name: 'Internet of Things (IoT)',
    description: 'Connect devices and create smart solutions for various industries'
  },
  {
    name: 'FinTech',
    description: 'Innovate in financial technology and digital banking solutions'
  }
];

const sampleProblemStatements = [
  {
    title: 'AI-powered Healthcare Diagnostic Tool',
    description: '<p>Develop an <strong>AI-powered healthcare diagnostic tool</strong> that can analyze medical images and provide preliminary diagnoses.</p><ul><li>Support for X-rays, CT scans, and MRI images</li><li>Integration with existing hospital systems</li><li>Real-time analysis and reporting</li><li>Accuracy metrics and confidence scores</li></ul><p><em>Focus on improving diagnostic accuracy and reducing healthcare costs.</em></p>'
  },
  {
    title: 'Smart Recommendation System for E-commerce',
    description: '<p>Create a <strong>smart recommendation system</strong> for e-commerce platforms that provides personalized product suggestions.</p><ul><li>Machine learning algorithms for user behavior analysis</li><li>Real-time recommendation engine</li><li>Integration with existing e-commerce platforms</li><li>A/B testing capabilities</li></ul><p><em>Improve user experience and increase sales conversion rates.</em></p>'
  },
  {
    title: 'Real-time Collaboration Platform',
    description: '<p>Build a <strong>real-time collaboration platform</strong> that enables teams to work together seamlessly.</p><ul><li>Live document editing</li><li>Video conferencing integration</li><li>Project management tools</li><li>File sharing and version control</li></ul><p><em>Enhance remote work productivity and team collaboration.</em></p>'
  },
  {
    title: 'Progressive Web App for Education',
    description: '<p>Develop a <strong>progressive web app</strong> for educational institutions with offline capabilities.</p><ul><li>Offline content access</li><li>Interactive learning modules</li><li>Progress tracking</li><li>Cross-platform compatibility</li></ul><p><em>Make education accessible to students in areas with limited internet connectivity.</em></p>'
  },
  {
    title: 'Fitness Tracking Mobile App',
    description: '<p>Create a <strong>comprehensive fitness tracking mobile app</strong> with advanced features.</p><ul><li>Activity tracking and monitoring</li><li>Nutrition planning and tracking</li><li>Social features and challenges</li><li>Integration with wearable devices</li></ul><p><em>Help users achieve their fitness goals through technology.</em></p>'
  },
  {
    title: 'Food Delivery Application',
    description: '<p>Build a <strong>food delivery application</strong> with advanced features for restaurants and customers.</p><ul><li>Real-time order tracking</li><li>Payment integration</li><li>Restaurant management dashboard</li><li>Customer reviews and ratings</li></ul><p><em>Streamline the food delivery process and improve customer satisfaction.</em></p>'
  },
  {
    title: 'DeFi (Decentralized Finance) Platform',
    description: '<p>Develop a <strong>DeFi platform</strong> that provides decentralized financial services.</p><ul><li>Smart contract integration</li><li>Liquidity pools and yield farming</li><li>Cross-chain compatibility</li><li>Security and audit features</li></ul><p><em>Democratize access to financial services through blockchain technology.</em></p>'
  },
  {
    title: 'NFT Marketplace',
    description: '<p>Create an <strong>NFT marketplace</strong> for digital art and collectibles.</p><ul><li>Minting and listing functionality</li><li>Bidding and auction system</li><li>Creator royalties</li><li>Community features</li></ul><p><em>Enable creators to monetize their digital assets.</em></p>'
  },
  {
    title: 'Smart Home Automation System',
    description: '<p>Build a <strong>smart home automation system</strong> that controls various home devices.</p><ul><li>IoT device integration</li><li>Voice control capabilities</li><li>Energy monitoring and optimization</li><li>Security and surveillance features</li></ul><p><em>Create a more efficient and secure living environment.</em></p>'
  },
  {
    title: 'Environmental Monitoring Solution',
    description: '<p>Develop an <strong>environmental monitoring solution</strong> using IoT sensors.</p><ul><li>Air quality monitoring</li><li>Weather data collection</li><li>Data visualization dashboard</li><li>Alert system for environmental hazards</li></ul><p><em>Help communities monitor and respond to environmental changes.</em></p>'
  },
  {
    title: 'Personal Finance Management App',
    description: '<p>Create a <strong>personal finance management app</strong> with AI-powered insights.</p><ul><li>Expense tracking and categorization</li><li>Budget planning and monitoring</li><li>Investment tracking</li><li>Financial goal setting</li></ul><p><em>Help users make informed financial decisions and achieve their goals.</em></p>'
  },
  {
    title: 'Digital Payment Solution',
    description: '<p>Build a <strong>digital payment solution</strong> for small businesses and individuals.</p><ul><li>Multiple payment methods</li><li>Transaction security</li><li>Merchant dashboard</li><li>Analytics and reporting</li></ul><p><em>Simplify digital transactions and promote financial inclusion.</em></p>'
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Theme.deleteMany({});
    await ProblemStatement.deleteMany({});
    console.log('Cleared existing data');

    // Create themes
    const createdThemes = await Theme.insertMany(sampleThemes);
    console.log(`Created ${createdThemes.length} themes`);

    // Create problem statements and assign them to themes
    const problemStatements = [];
    
    // AI/ML theme gets first 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[0].title,
      description: sampleProblemStatements[0].description,
      themeId: createdThemes[0]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[1].title,
      description: sampleProblemStatements[1].description,
      themeId: createdThemes[0]._id
    });

    // Web Development theme gets next 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[2].title,
      description: sampleProblemStatements[2].description,
      themeId: createdThemes[1]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[3].title,
      description: sampleProblemStatements[3].description,
      themeId: createdThemes[1]._id
    });

    // Mobile Development theme gets next 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[4].title,
      description: sampleProblemStatements[4].description,
      themeId: createdThemes[2]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[5].title,
      description: sampleProblemStatements[5].description,
      themeId: createdThemes[2]._id
    });

    // Blockchain theme gets next 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[6].title,
      description: sampleProblemStatements[6].description,
      themeId: createdThemes[3]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[7].title,
      description: sampleProblemStatements[7].description,
      themeId: createdThemes[3]._id
    });

    // IoT theme gets next 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[8].title,
      description: sampleProblemStatements[8].description,
      themeId: createdThemes[4]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[9].title,
      description: sampleProblemStatements[9].description,
      themeId: createdThemes[4]._id
    });

    // FinTech theme gets last 2 problem statements
    problemStatements.push({
      title: sampleProblemStatements[10].title,
      description: sampleProblemStatements[10].description,
      themeId: createdThemes[5]._id
    });
    problemStatements.push({
      title: sampleProblemStatements[11].title,
      description: sampleProblemStatements[11].description,
      themeId: createdThemes[5]._id
    });

    const createdProblemStatements = await ProblemStatement.insertMany(problemStatements);
    console.log(`Created ${createdProblemStatements.length} problem statements`);

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedData();
