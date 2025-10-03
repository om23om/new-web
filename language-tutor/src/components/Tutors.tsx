import React from 'react';
import { mockTutors } from '../data/mockTutors';

const Tutors = () => {
  return (
    <div>
      <h2>Our Tutors</h2>
      <ul>
        {mockTutors.map(tutor => (
          <li key={tutor.id}>{tutor.name} - {tutor.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tutors;