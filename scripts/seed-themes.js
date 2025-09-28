// Simple script to add sample themes and problem statements
// Run this after the server is running

const sampleData = {
  themes: [
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
  ],
  problemStatements: [
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
  ]
};

console.log('Sample data structure:');
console.log(JSON.stringify(sampleData, null, 2));

console.log('\nTo add this data to your database:');
console.log('1. Start your Next.js server');
console.log('2. Go to /admin/dashboard');
console.log('3. Use the Themes and Problem Statements tabs to create the data manually');
console.log('4. Or use the API endpoints directly with the data above');
