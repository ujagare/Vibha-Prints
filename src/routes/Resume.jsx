import React from 'react';
import { resumeData } from '../data/resumeData';

const Resume = () => {
  const { 
    personalInfo, 
    education, 
    experience, 
    skills, 
    projects, 
    certifications 
  } = resumeData;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Personal Info Section */}
      <div className="text-center mb-12 glassmorphism p-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{personalInfo.name}</h1>
        <p className="text-xl text-gray-600">{personalInfo.title}</p>
        <div className="mt-4 text-gray-700">
          <p>{personalInfo.email} | {personalInfo.phone}</p>
          <p>{personalInfo.location}</p>
        </div>
        <p className="mt-4 text-gray-800 max-w-2xl mx-auto">{personalInfo.summary}</p>
      </div>

      {/* Resume Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Education Section */}
        <div className="bg-white shadow-md rounded-lg p-6 card-hover">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">
                Graduated: {edu.graduationYear} | GPA: {edu.gpa}
              </p>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="bg-white shadow-md rounded-lg p-6 card-hover">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">{exp.title}</h3>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="text-sm">{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills, Projects, and Certifications */}
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {/* Skills Section */}
        <div className="bg-white shadow-md rounded-lg p-6 card-hover">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white shadow-md rounded-lg p-6 card-hover">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">{project.name}</h3>
              <p className="text-gray-600">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech, i) => (
                  <span 
                    key={i} 
                    className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications Section */}
        <div className="bg-white shadow-md rounded-lg p-6 card-hover">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Certifications</h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-medium">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-sm text-gray-500">Year: {cert.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Download Resume Button */}
      <div className="text-center mt-8">
        <button 
          className="btn-primary px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default Resume;
