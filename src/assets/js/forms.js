/* Digitaleem enquiry forms.
   Each form: title, intro, fields. A field can be:
     { id, label, type: text|email|tel|url|number|select|radio|checks|textarea, options, required, hint, optional, half, showIf: { id, in: [...] } }
   Contact fields are appended to every form by site.js (see CONTACT / ORG_CONTACT). */
(function () {
  var DOMAIN = { id: 'domain', label: 'Which field?', type: 'select', required: true, options: [
    ['it', 'IT & Digital'], ['engineering', 'Engineering & Industrial'], ['business', 'Business & Management'], ['healthcare', 'Healthcare & Nursing'], ['unsure', 'Not sure yet']
  ] };
  var SECTOR = { id: 'sector', label: 'Sector', type: 'select', required: true, half: true, options: [
    ['it', 'IT and software'], ['manufacturing', 'Manufacturing'], ['construction', 'Construction and infrastructure'],
    ['engineering-services', 'Engineering services'], ['healthcare', 'Hospitals and healthcare'], ['startup', 'Startup'], ['msme', 'MSME (other)'], ['services', 'Services and retail'], ['other', 'Other']
  ] };
  var COMPANY = { id: 'company', label: 'Company name', type: 'text', required: true, half: true };

  window.DGT_CONTACT = [
    { id: 'name', label: 'Your name', type: 'text', required: true, autocomplete: 'name' },
    { id: 'phone', label: 'Phone or WhatsApp number', type: 'tel', required: true, half: true, autocomplete: 'tel', hint: '10-digit mobile number' },
    { id: 'email', label: 'Email', type: 'email', required: true, half: true, autocomplete: 'email' }
  ];

  window.DGT_FORMS = {
    student: {
      who: 'students', title: 'Tell us where you are starting',
      intro: 'Answer a few questions and our team will call you with a plan that fits: training, a project, an internship, industrial training or mentoring.',
      fields: [
        { id: 'status', label: 'Where are you now?', type: 'radio', required: true, options: [
          ['studying', 'Studying'], ['graduated', 'Graduated, looking for work'], ['working', 'Working, want to grow or switch'] ] },
        { id: 'institution', label: 'College or institute', type: 'text', required: true, half: true },
        { id: 'course', label: 'Course and branch', type: 'text', required: true, half: true, hint: 'For example: B.Tech Mechanical, Diploma Electrical, MBA, ITI Fitter' },
        { id: 'year', label: 'Year of study', type: 'select', required: true, half: true, showIf: { id: 'status', in: ['studying'] }, options: [
          ['1', '1st year'], ['2', '2nd year'], ['3', '3rd year'], ['4', '4th year'], ['5', '5th year'] ] },
        { id: 'gradYear', label: 'Year you graduated', type: 'select', required: true, half: true, showIf: { id: 'status', in: ['graduated', 'working'] }, options: [
          ['2026', '2026'], ['2025', '2025'], ['2024', '2024'], ['2023', '2023'], ['2022', '2022'], ['earlier', '2021 or earlier'] ] },
        DOMAIN,
        { id: 'specialisation', label: 'Specialisation', type: 'text', optional: true, hint: 'For example: data analytics, PLC, digital marketing' },
        { id: 'level', label: 'Your current level in this field', type: 'radio', required: true, options: [
          ['beginner', 'Beginner'], ['some', 'Some experience'], ['experienced', 'Experienced'] ] },
        { id: 'need', label: 'What do you need?', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['training', 'Training'], ['projects', 'A project'], ['internship', 'An internship'], ['industrial-training', 'Industrial training'],
          ['mentoring', 'Mentoring'], ['language', 'German for work abroad'], ['unsure', 'Not sure yet'] ] },
        { id: 'internshipType', label: 'Internship preference', type: 'radio', optional: true, showIf: { id: 'need', in: ['internship'] }, options: [
          ['online', 'Online'], ['onsite', 'On-site'], ['any', 'Either'] ] },
        { id: 'goal', label: 'What role or industry do you want to work in?', type: 'text', optional: true },
        { id: 'start', label: 'When can you start?', type: 'select', required: true, options: [
          ['now', 'Right away'], ['month', 'Within a month'], ['quarter', 'In 1 to 3 months'], ['vacation', 'Only during vacations'], ['later', 'Later'] ] }
      ]
    },

    interview: {
      who: 'students', title: 'Get ready for your interview',
      intro: 'Tell us the role you are aiming for and how soon you need to be ready. We will set up the assessments and mock interviews that help most.',
      fields: [
        { id: 'role', label: 'Role or industry you are interviewing for', type: 'text', required: true, hint: 'For example: data analyst, graduate engineer trainee, sales executive' },
        DOMAIN,
        { id: 'stage', label: 'Where are you in the process?', type: 'radio', required: true, options: [
          ['placements', 'Preparing for campus placements'], ['applying', 'Applying now'], ['scheduled', 'Interviews scheduled'], ['no-offer', 'Interviewed, no offer yet'] ] },
        { id: 'when', label: 'When is your next interview?', type: 'select', required: true, options: [
          ['week', 'This week'], ['month', 'Within a month'], ['none', 'Not scheduled yet'] ] },
        { id: 'prep', label: 'What do you want help with?', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['resume', 'Resume review'], ['technical', 'Mock technical interview'], ['hr', 'Mock HR interview'], ['aptitude', 'Aptitude'],
          ['communication', 'Communication'], ['projects', 'Explaining my projects'] ] },
        { id: 'resume', label: 'Link to your resume', type: 'url', optional: true, hint: 'A Google Drive or similar link set to "anyone with the link can view".' },
        { id: 'institution', label: 'College or institute', type: 'text', optional: true }
      ]
    },

    college: {
      who: 'colleges', title: 'Request a proposal for your institution',
      intro: 'Tell us about your institution and what your students need. We will come back with a proposal: a single activity, a semester program or a longer partnership.',
      fields: [
        { id: 'institution', label: 'Institution name', type: 'text', required: true },
        { id: 'instType', label: 'Type of institution', type: 'select', required: true, half: true, options: [
          ['university', 'University'], ['engineering', 'Engineering college'], ['management', 'Management institute'], ['degree', 'Degree college'],
          ['polytechnic', 'Polytechnic'], ['iti', 'ITI'], ['skill', 'Skill development institute'], ['other', 'Other'] ] },
        { id: 'district', label: 'District', type: 'text', required: true, half: true },
        { id: 'role', label: 'Your role', type: 'select', required: true, half: true, options: [
          ['head', 'Principal or Director'], ['hod', 'Head of Department'], ['tpo', 'Training & Placement Officer'], ['faculty', 'Faculty'], ['other', 'Other'] ] },
        { id: 'students', label: 'Number of students involved', type: 'select', required: true, half: true, options: [
          ['<60', 'Fewer than 60'], ['60-200', '60 to 200'], ['200-500', '200 to 500'], ['500+', 'More than 500'] ] },
        { id: 'branches', label: 'Branches or departments', type: 'text', required: true, hint: 'For example: Mechanical and Electrical, 3rd year; MBA 1st year' },
        { id: 'interventions', label: 'What would you like to arrange?', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['workshops', 'Workshops'], ['expert-sessions', 'Expert sessions'], ['training', 'Student training'], ['visits', 'Industrial visits'],
          ['industrial-training', 'Industrial training'], ['internships', 'Internships'], ['projects', 'Live projects'], ['assessments', 'Skill assessments'],
          ['placement-prep', 'Placement and interview prep'], ['collaboration', 'Industry collaboration'] ] },
        { id: 'scope', label: 'Scope', type: 'radio', required: true, options: [
          ['single', 'A single activity'], ['semester', 'A semester program'], ['partnership', 'A long-term partnership'], ['unsure', 'Not sure yet'] ] },
        { id: 'dates', label: 'Preferred semester or dates', type: 'text', optional: true }
      ]
    },

    hire: {
      who: 'industry', title: 'Post a hiring requirement',
      intro: 'Tell us who you need. We will shortlist candidates whose training, projects and assessments match the role, and can list the opening on Digitaleem.',
      contact: 'org',
      fields: [
        COMPANY, SECTOR,
        { id: 'roles', label: 'Roles you are hiring for', type: 'text', required: true, half: true },
        { id: 'openings', label: 'Number of openings', type: 'number', required: true, half: true, min: 1 },
        { id: 'kind', label: 'Type of position', type: 'checks', required: true, options: [
          ['internship', 'Internship'], ['apprenticeship', 'Apprenticeship'], ['trainee', 'Trainee'], ['job', 'Full-time job'] ] },
        { id: 'skills', label: 'Key skills required', type: 'textarea', required: true },
        { id: 'location', label: 'Work location', type: 'text', required: true, half: true, hint: 'City, or remote' },
        { id: 'timeline', label: 'When do you need them?', type: 'select', required: true, half: true, options: [
          ['now', 'Immediately'], ['month', 'Within a month'], ['quarter', 'In 1 to 3 months'], ['planning', 'Planning ahead'] ] },
        { id: 'list', label: 'May we list this opening on the Digitaleem Opportunities page?', type: 'radio', required: true, options: [
          ['yes', 'Yes'], ['no', 'No, share candidates privately'] ] }
      ]
    },

    workforce: {
      who: 'industry', title: 'Request a training proposal',
      intro: 'Tell us about your team and what they need to be able to do. We will propose a training plan with trainers from your industry.',
      contact: 'org',
      fields: [
        COMPANY, SECTOR,
        { id: 'teamSize', label: 'How many people need training?', type: 'select', required: true, half: true, options: [
          ['1-10', '1 to 10'], ['11-50', '11 to 50'], ['51-200', '51 to 200'], ['200+', 'More than 200'] ] },
        { id: 'level', label: 'Their current level', type: 'select', required: true, half: true, options: [
          ['new', 'Mostly new to the subject'], ['mixed', 'Mixed'], ['advanced', 'Experienced, need advanced skills'] ] },
        { id: 'areas', label: 'Skill areas', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['digital', 'Digital tools and IT'], ['ai', 'AI and automation'], ['data', 'Data and analytics'], ['technical', 'Technical and engineering'],
          ['quality', 'Quality and safety'], ['management', 'Management'], ['sales', 'Sales and marketing'], ['professional', 'Professional skills'] ] },
        { id: 'outcome', label: 'What should your team be able to do after the training?', type: 'textarea', required: true },
        { id: 'timeline', label: 'When would you like to start?', type: 'select', required: true, options: [
          ['now', 'As soon as possible'], ['month', 'Within a month'], ['quarter', 'In 1 to 3 months'], ['planning', 'Planning ahead'] ] }
      ]
    },

    collaborate: {
      who: 'industry', title: 'Work with colleges and students',
      intro: 'Tell us how you would like to take part. We will connect you with the right colleges and students and handle the coordination.',
      contact: 'org',
      fields: [
        COMPANY, SECTOR,
        { id: 'how', label: 'How would you like to take part?', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['problem', 'Share a problem statement'], ['interns', 'Host interns'], ['visit', 'Host an industrial visit'], ['mentor', 'Mentor students'],
          ['evaluate', 'Evaluate projects'], ['session', 'Run a guest session'], ['program', 'Build a joint program'] ] },
        DOMAIN,
        { id: 'description', label: 'Describe the problem or what you would like to offer', type: 'textarea', required: true },
        { id: 'region', label: 'Preferred colleges or region', type: 'text', optional: true }
      ]
    },

    mentor: {
      who: 'mentors', title: 'Apply to mentor or train',
      intro: 'Tell us about your experience and how you would like to contribute. We will get in touch to talk it through.',
      fields: [
        { id: 'role', label: 'Current role', type: 'text', required: true, half: true },
        { id: 'company', label: 'Company or organisation', type: 'text', required: true, half: true },
        { id: 'experience', label: 'Years of experience', type: 'select', required: true, half: true, options: [
          ['2-5', '2 to 5'], ['5-10', '5 to 10'], ['10-20', '10 to 20'], ['20+', 'More than 20'] ] },
        { id: 'hours', label: 'Hours you could give each month', type: 'select', required: true, half: true, options: [
          ['4', 'Up to 4'], ['8', '4 to 8'], ['16', '8 to 16'], ['16+', 'More than 16'] ] },
        { id: 'domains', label: 'Your fields', type: 'checks', required: true, options: [
          ['it', 'IT & Digital'], ['engineering', 'Engineering & Industrial'], ['business', 'Business & Management'], ['healthcare', 'Healthcare & Nursing'] ] },
        { id: 'specialisations', label: 'Your specialisations', type: 'text', required: true, hint: 'For example: Python and data engineering; CNC programming; B2B sales' },
        { id: 'contribute', label: 'How would you like to contribute?', type: 'checks', required: true, hint: 'Choose all that apply.', options: [
          ['training', 'Training'], ['workshops', 'Workshops'], ['mentoring', 'Mentoring'], ['supervision', 'Project supervision'],
          ['evaluation', 'Project evaluation'], ['interviews', 'Mock interviews'], ['sessions', 'Industry sessions'], ['curriculum', 'Curriculum input'] ] },
        { id: 'linkedin', label: 'LinkedIn profile', type: 'url', required: true }
      ]
    },

    nursing: {
      who: 'students', title: 'Check if nursing in Germany fits you',
      intro: 'Tell us about your qualification and experience. We will call you, explain each step honestly and tell you whether the route fits you now.',
      fields: [
        { id: 'qualification', label: 'Nursing qualification', type: 'select', required: true, half: true, options: [
          ['bsc', 'B.Sc Nursing'], ['pbbsc', 'Post Basic B.Sc Nursing'], ['msc', 'M.Sc Nursing'], ['gnm', 'GNM'], ['anm', 'ANM'], ['studying', 'Still studying'] ] },
        { id: 'registration', label: 'Registered with a State Nursing Council?', type: 'select', required: true, half: true, options: [
          ['yes', 'Yes'], ['process', 'In process'], ['no', 'No'] ] },
        { id: 'experience', label: 'Work experience as a nurse', type: 'select', required: true, half: true, options: [
          ['0', 'None yet'], ['1', 'Less than 1 year'], ['1-2', '1 to 2 years'], ['2-5', '2 to 5 years'], ['5+', 'More than 5 years'] ] },
        { id: 'specialty', label: 'Department or specialty', type: 'text', optional: true, half: true, hint: 'For example: ICU, OT, emergency, medical-surgical' },
        { id: 'german', label: 'Your German level today', type: 'radio', required: true, options: [
          ['none', 'None yet'], ['a1', 'A1'], ['a2', 'A2'], ['b1', 'B1'], ['b2', 'B2 or higher'] ] },
        { id: 'passport', label: 'Do you have a passport?', type: 'radio', required: true, options: [
          ['yes', 'Yes'], ['applied', 'Applied'], ['no', 'Not yet'] ] },
        { id: 'start', label: 'When can you start learning German?', type: 'select', required: true, options: [
          ['now', 'Right away'], ['month', 'Within a month'], ['quarter', 'In 1 to 3 months'], ['later', 'Later'] ] },
        { id: 'questions', label: 'Anything you want to ask us?', type: 'textarea', optional: true }
      ]
    },

    language: {
      who: 'students', title: 'Learn German for work',
      intro: 'Tell us why you are learning German and where you are now. We will place you in the right batch and send you the schedule and fees.',
      fields: [
        { id: 'purpose', label: 'Why are you learning German?', type: 'radio', required: true, options: [
          ['nursing', 'To work as a nurse in Germany'], ['engineering', 'For an engineering or technical job'], ['it', 'For an IT job'], ['other', 'Something else'] ] },
        { id: 'profession', label: 'Your qualification or profession', type: 'text', required: true, hint: 'For example: B.Sc Nursing, B.Tech Mechanical, Diploma Electrical' },
        { id: 'level', label: 'Your German level today', type: 'radio', required: true, options: [
          ['none', 'None yet'], ['a1', 'A1'], ['a2', 'A2'], ['b1', 'B1'] ] },
        { id: 'target', label: 'Level you are aiming for', type: 'select', required: true, half: true, options: [
          ['b1', 'B1'], ['b2', 'B2'], ['unsure', 'Not sure'] ] },
        { id: 'time', label: 'Hours you can study each week', type: 'select', required: true, half: true, options: [
          ['5', 'Up to 5'], ['10', '5 to 10'], ['20', '10 to 20'], ['20+', 'More than 20'] ] }
      ]
    },

    intlhire: {
      who: 'industry', title: 'Recruit nurses from India',
      intro: 'Tell us about your organisation and the roles you need to fill. We will explain how we prepare candidates and agree the next steps with you.',
      contact: 'org',
      fields: [
        { id: 'company', label: 'Organisation name', type: 'text', required: true, half: true },
        { id: 'orgType', label: 'Type of organisation', type: 'select', required: true, half: true, options: [
          ['hospital', 'Hospital'], ['care-home', 'Care home'], ['home-care', 'Home care service'], ['agency', 'Recruitment agency'], ['other', 'Other'] ] },
        { id: 'country', label: 'Country', type: 'text', required: true, half: true },
        { id: 'city', label: 'City or region', type: 'text', required: true, half: true },
        { id: 'roles', label: 'Roles and specialties', type: 'text', required: true, hint: 'For example: ICU nurses, geriatric care' },
        { id: 'openings', label: 'Number of nurses needed', type: 'number', required: true, half: true, min: 1 },
        { id: 'germanLevel', label: 'German level required at arrival', type: 'select', required: true, half: true, options: [
          ['b1', 'B1'], ['b2', 'B2'], ['discuss', 'To discuss'] ] },
        { id: 'timeline', label: 'When do you want them to start?', type: 'select', required: true, options: [
          ['6', 'Within 6 months'], ['12', 'In 6 to 12 months'], ['later', 'Later than 12 months'], ['planning', 'Planning ahead'] ] }
      ]
    },

    apply: {
      who: 'students', title: 'Apply for this opening',
      intro: 'Send your details and we will share your application with the company if your profile fits. We will let you know either way.',
      fields: [
        { id: 'status', label: 'Where are you now?', type: 'radio', required: true, options: [
          ['studying', 'Studying'], ['graduated', 'Graduated'], ['working', 'Working'] ] },
        { id: 'institution', label: 'College or institute', type: 'text', required: true, half: true },
        { id: 'course', label: 'Course and branch', type: 'text', required: true, half: true },
        { id: 'skills', label: 'Your relevant skills', type: 'textarea', required: true },
        { id: 'resume', label: 'Link to your resume', type: 'url', required: true, hint: 'A Google Drive or similar link set to "anyone with the link can view".' },
        { id: 'work', label: 'Link to a project or portfolio', type: 'url', optional: true },
        { id: 'why', label: 'Why does this opening interest you?', type: 'textarea', optional: true }
      ]
    }
  };

  window.DGT_ORG_CONTACT = [
    { id: 'name', label: 'Your name', type: 'text', required: true, half: true, autocomplete: 'name' },
    { id: 'designation', label: 'Designation', type: 'text', required: true, half: true, autocomplete: 'organization-title' },
    { id: 'phone', label: 'Phone or WhatsApp number', type: 'tel', required: true, half: true, autocomplete: 'tel' },
    { id: 'email', label: 'Work email', type: 'email', required: true, half: true, autocomplete: 'email' }
  ];
})();
