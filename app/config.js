module.exports = {

  // Base URL
  baseURL: process.env.BASE_URL || 'https://standards.education.gov.uk/',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3941,
  githubrepo: 'https://github.com/DFE-Digital/standards',
  
  assetPath: process.env.assetPath,

  serviceName: 'Service assessment plus',
  cmsURL: process.env.CMS_URL || 'https://standards.education.gov.uk/',
  enableDrafts: process.env.ENABLE_DRAFTS || 'live',
  isbeta: 'true'
};


