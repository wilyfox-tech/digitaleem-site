// The four domain families. Each renders /domains/<slug>/.
module.exports = [
  {
    slug: 'it',
    name: 'IT & Digital',
    short: 'Software, data, AI, cloud, security, design and digital marketing.',
    title: 'IT and digital skills, learned by building.',
    intro: 'Technology jobs ask for evidence: code you have written, data you have analysed, systems you have designed. Digitaleem helps you build that evidence in the area you want to work in.',
    fields: ['Software development', 'Web development', 'Mobile development', 'Artificial intelligence', 'Machine learning', 'Data analytics', 'Data science', 'Cybersecurity', 'Cloud computing', 'DevOps', 'UI/UX design', 'Digital marketing', 'Marketing technology', 'Automation', 'IoT', 'Business technology', 'Emerging technologies'],
    projects: ['Build software for an organisation', 'Analyse a company’s operational data', 'Automate an internal process', 'Design an IoT system'],
    roles: ['Software developer', 'Web developer', 'Data analyst', 'QA and test engineer', 'Cloud and DevOps trainee', 'Security analyst', 'UI/UX designer', 'Digital marketing executive'],
    programs: ['training', 'workshops', 'projects', 'internships', 'interview-prep', 'mentoring', 'college-industry']
  },
  {
    slug: 'engineering',
    name: 'Engineering & Industrial',
    short: 'Mechanical, electrical, civil, manufacturing, automation and trades.',
    title: 'Engineering and industrial skills, close to the shop floor.',
    intro: 'Core engineering and technical trades are learned best near real machines, sites and processes. Digitaleem connects engineering, polytechnic and ITI students with practical training, industrial exposure and the companies that need them.',
    fields: ['Mechanical engineering', 'Electrical engineering', 'Electronics', 'Civil engineering', 'Manufacturing', 'Automobile', 'Mechatronics', 'Production', 'Industrial operations', 'Maintenance', 'Quality', 'CAD/CAM', 'CNC', 'PLC', 'Industrial automation', 'Machine operations', 'Technical trades', 'Vocational skills'],
    projects: ['Prepare engineering designs', 'Perform quantity calculations for a site', 'Study a manufacturing process', 'Analyse a production problem'],
    roles: ['Graduate engineer trainee', 'Diploma engineer trainee', 'Maintenance technician', 'Quality inspector', 'CAD designer', 'CNC operator and programmer', 'PLC and automation technician', 'Site engineer'],
    programs: ['training', 'workshops', 'projects', 'internships', 'industrial-training', 'interview-prep', 'mentoring', 'college-industry']
  },
  {
    slug: 'business',
    name: 'Business & Management',
    short: 'Marketing, sales, HR, finance, operations and entrepreneurship.',
    title: 'Business and management skills, tested on real problems.',
    intro: 'Business roles reward judgement, and judgement comes from working on real problems. Digitaleem gives management and commerce students live business problems, mentors from industry and practice for the interviews that follow.',
    fields: ['Marketing', 'Sales', 'Human resources', 'Finance', 'Operations', 'Business analytics', 'Entrepreneurship', 'Management', 'Business development', 'Digital business'],
    projects: ['Develop a marketing plan', 'Conduct market research', 'Create business recommendations', 'Analyse operations for a small business'],
    roles: ['Marketing executive', 'Sales and business development executive', 'HR executive', 'Finance and accounts trainee', 'Operations executive', 'Business analyst'],
    programs: ['training', 'workshops', 'projects', 'internships', 'interview-prep', 'mentoring', 'college-industry']
  },
  {
    slug: 'healthcare',
    name: 'Healthcare & Nursing',
    short: 'Nursing and patient care, with careers in India and abroad.',
    title: 'Nursing careers, prepared step by step.',
    intro: 'Hospitals and care homes, in India and abroad, need nurses who are clinically confident and ready for a new workplace. Digitaleem prepares nurses for that move, starting with nursing careers in Germany.',
    fields: ['Registered nursing', 'Critical care', 'Operating theatre', 'Emergency care', 'Geriatric care', 'Paediatric nursing', 'Medical-surgical nursing', 'Patient safety', 'Clinical documentation', 'Clinical communication', 'Medical German'],
    projects: ['Prepare a care plan for a case study', 'Practise a patient handover in German', 'Review a ward routine for patient safety', 'Present a clinical case to a panel'],
    roles: ['Registered nurse in India', 'Nurse in Germany, after recognition', 'Nursing assistant in Germany during recognition', 'Critical care nurse', 'Geriatric care nurse', 'Operating theatre nurse'],
    programs: ['language', 'training', 'interview-prep', 'mentoring'],
    abroad: '/careers-abroad/nursing-germany/'
  }
];
