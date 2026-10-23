/* Digitaleem opportunities: internships, jobs and open project briefs.
   Add one object per real opening. The Opportunities pages update automatically.

   {
     id: 'data-analyst-intern-acme-2026',     // unique, lowercase, hyphens only (used in the link)
     type: 'internship',                       // internship | job | project
     title: 'Data Analyst Intern',
     company: 'Company name',
     location: 'Pune',                         // city, or 'Remote'
     country: 'India',                         // optional; any other country shows the listing under 'Abroad'
     mode: 'On-site',                          // On-site | Remote | Hybrid
     domain: 'it',                             // it | engineering | business | healthcare
     duration: '3 months',                     // internships and projects
     pay: 'Stipend ₹10,000 a month',           // or 'Unpaid', or a salary range for jobs
     posted: '2026-10-05',                     // YYYY-MM-DD
     closes: '2026-10-31',                     // YYYY-MM-DD, optional
     summary: 'One or two sentences shown on the listing card.',
     responsibilities: ['...', '...'],
     requirements: ['...', '...'],
     about: 'A short description of the company.'
   }
*/
window.DGT_OPPORTUNITIES = [];
